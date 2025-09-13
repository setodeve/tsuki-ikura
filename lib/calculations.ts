import type { CalculationResult, WorkConditions } from "./types";

export function calculateIncome(conditions: WorkConditions): CalculationResult {
  const {
    hourly,
    hoursWeekday,
    hoursHoliday,
    hoursNationalHoliday,
    weekdaysPerMonth,
    holidaysPerMonth,
    nationalHolidaysPerMonth,
  } = conditions;

  // 日額計算
  const weekdayDaily = hourly * hoursWeekday;
  const holidayDaily = hourly * hoursHoliday;
  const nationalHolidayDaily = hourly * hoursNationalHoliday;

  // 月額計算
  const monthly =
    weekdayDaily * weekdaysPerMonth +
    holidayDaily * holidaysPerMonth +
    nationalHolidayDaily * nationalHolidaysPerMonth;

  // 週額（平日5日想定）
  const weekly = weekdayDaily * 5;

  // 年額（月額×12）
  const yearly = monthly * 12;

  return {
    monthly,
    weekdayDaily,
    holidayDaily,
    nationalHolidayDaily,
    weekly,
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

  const hoursFields = [
    { field: "hoursWeekday", label: "平日の労働時間" },
    { field: "hoursHoliday", label: "休日の労働時間" },
    { field: "hoursNationalHoliday", label: "祝日の労働時間" },
  ];

  for (const { field, label } of hoursFields) {
    const value = conditions[field as keyof WorkConditions] as number;
    if (value !== undefined) {
      if (value < 0 || value > 24) {
        errors.push(`${label}は0〜24時間の範囲で入力してください`);
      }
    }
  }

  const daysFields = [
    { field: "weekdaysPerMonth", label: "平日数" },
    { field: "holidaysPerMonth", label: "休日数" },
    { field: "nationalHolidaysPerMonth", label: "祝日数" },
  ];

  for (const { field, label } of daysFields) {
    const value = conditions[field as keyof WorkConditions] as number;
    if (value !== undefined) {
      if (value < 0 || value > 31) {
        errors.push(`${label}は0〜31日の範囲で入力してください`);
      }
    }
  }

  return errors;
}
