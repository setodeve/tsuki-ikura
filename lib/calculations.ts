import { calculateMonthlyWorkDays, getNextMonth } from "./calendar";
import type { CalculationResult, WorkConditions, WeeklySchedule } from "./types";

/**
 * デフォルトの労働条件を生成
 */
export function createDefaultConditions(): WorkConditions {
  const nextMonth = getNextMonth();

  return {
    hourly: 1000,
    weeklySchedule: {
      monday: 8,
      tuesday: 8,
      wednesday: 8,
      thursday: 8,
      friday: 8,
      saturday: 0,
      sunday: 0,
    },
    selectedYear: nextMonth.year,
    selectedMonth: nextMonth.month,
  };
}


export function calculateIncome(conditions: WorkConditions): CalculationResult {
  const { hourly, weeklySchedule, selectedYear, selectedMonth } = conditions;

  // 年月が指定されている場合は正確な日数で計算
  if (selectedYear && selectedMonth) {
    const workDays = calculateMonthlyWorkDays(selectedYear, selectedMonth);

    // 曜日別日額
    const weekdayDaily = hourly * ((weeklySchedule.monday + weeklySchedule.tuesday + weeklySchedule.wednesday + weeklySchedule.thursday + weeklySchedule.friday) / 5);
    const holidayDaily = hourly * ((weeklySchedule.saturday + weeklySchedule.sunday) / 2);
    const nationalHolidayDaily = weekdayDaily; // 祝日は平日と同じ扱い

    // 月収計算（正確な日数）
    const monthly =
      weekdayDaily * workDays.weekdays +
      holidayDaily * workDays.weekends +
      nationalHolidayDaily * workDays.holidays;

    // その月の総日数
    const totalDays = workDays.weekdays + workDays.weekends + workDays.holidays;

    // 平均日額
    const averageDaily = monthly / totalDays;

    // 年額
    const yearly = monthly * 12;

    return {
      monthly,
      averageDaily,
      yearly,
      calculationBreakdown: {
        year: selectedYear,
        month: selectedMonth,
        weekdays: workDays.weekdays,
        weekends: workDays.weekends,
        holidays: workDays.holidays,
        totalDays,
      },
    };
  }

  // フォールバック: 平均的な計算
  const weeksInMonth = 4.33;
  const weeklyTotalHours =
    weeklySchedule.monday +
    weeklySchedule.tuesday +
    weeklySchedule.wednesday +
    weeklySchedule.thursday +
    weeklySchedule.friday +
    weeklySchedule.saturday +
    weeklySchedule.sunday;

  const monthly = hourly * weeklyTotalHours * weeksInMonth;
  const averageDaily = monthly / 30; // 平均的な月の日数
  const yearly = monthly * 12;

  return {
    monthly,
    averageDaily,
    yearly,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function validateWorkConditions(
  conditions: Partial<WorkConditions>,
): string[] {
  const errors: string[] = [];

  if (conditions.hourly !== undefined && conditions.hourly < 0) {
    errors.push("時給は0以上である必要があります");
  }

  if (conditions.weeklySchedule) {
    const dayFields = [
      { key: "monday", label: "月曜日" },
      { key: "tuesday", label: "火曜日" },
      { key: "wednesday", label: "水曜日" },
      { key: "thursday", label: "木曜日" },
      { key: "friday", label: "金曜日" },
      { key: "saturday", label: "土曜日" },
      { key: "sunday", label: "日曜日" },
    ];

    for (const { key, label } of dayFields) {
      const value = conditions.weeklySchedule[key as keyof WeeklySchedule];
      if (value !== undefined && (value < 0 || value > 24)) {
        errors.push(`${label}の労働時間は0〜24時間の範囲で入力してください`);
      }
    }
  }

  return errors;
}
