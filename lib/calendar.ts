// 日本の祝日データ (2024-2026)
const holidays: Record<string, string[]> = {
  "2024": [
    "2024-01-01", // 元日
    "2024-01-08", // 成人の日
    "2024-02-11", // 建国記念の日
    "2024-02-12", // 建国記念の日 振替休日
    "2024-02-23", // 天皇誕生日
    "2024-03-20", // 春分の日
    "2024-04-29", // 昭和の日
    "2024-05-03", // 憲法記念日
    "2024-05-04", // みどりの日
    "2024-05-05", // こどもの日
    "2024-05-06", // こどもの日 振替休日
    "2024-07-15", // 海の日
    "2024-08-11", // 山の日
    "2024-08-12", // 山の日 振替休日
    "2024-09-16", // 敬老の日
    "2024-09-22", // 秋分の日
    "2024-09-23", // 秋分の日 振替休日
    "2024-10-14", // スポーツの日
    "2024-11-03", // 文化の日
    "2024-11-04", // 文化の日 振替休日
    "2024-11-23", // 勤労感謝の日
  ],
  "2025": [
    "2025-01-01", // 元日
    "2025-01-13", // 成人の日
    "2025-02-11", // 建国記念の日
    "2025-02-23", // 天皇誕生日
    "2025-02-24", // 天皇誕生日 振替休日
    "2025-03-20", // 春分の日
    "2025-04-29", // 昭和の日
    "2025-05-03", // 憲法記念日
    "2025-05-04", // みどりの日
    "2025-05-05", // こどもの日
    "2025-05-06", // こどもの日 振替休日
    "2025-07-21", // 海の日
    "2025-08-11", // 山の日
    "2025-09-15", // 敬老の日
    "2025-09-23", // 秋分の日
    "2025-10-13", // スポーツの日
    "2025-11-03", // 文化の日
    "2025-11-23", // 勤労感謝の日
    "2025-11-24", // 勤労感謝の日 振替休日
  ],
  "2026": [
    "2026-01-01", // 元日
    "2026-01-12", // 成人の日
    "2026-02-11", // 建国記念の日
    "2026-02-23", // 天皇誕生日
    "2026-03-20", // 春分の日
    "2026-04-29", // 昭和の日
    "2026-05-03", // 憲法記念日
    "2026-05-04", // みどりの日
    "2026-05-05", // こどもの日
    "2026-05-06", // こどもの日 振替休日
    "2026-07-20", // 海の日
    "2026-08-11", // 山の日
    "2026-09-21", // 敬老の日
    "2026-09-22", // 秋分の日
    "2026-10-12", // スポーツの日
    "2026-11-03", // 文化の日
    "2026-11-23", // 勤労感謝の日
  ],
};

/**
 * 指定した年月の労働日数を計算
 */
export function calculateMonthlyWorkDays(
  year: number,
  month: number,
): {
  weekdays: number;
  weekends: number;
  holidays: number;
} {
  const daysInMonth = new Date(year, month, 0).getDate();
  const yearStr = year.toString();
  const monthHolidays = holidays[yearStr] || [];

  let weekdays = 0;
  let weekends = 0;
  let holidayCount = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dateStr = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    const dayOfWeek = date.getDay();

    // 祝日チェック
    if (monthHolidays.includes(dateStr)) {
      holidayCount++;
    }
    // 土日チェック
    else if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekends++;
    }
    // 平日
    else {
      weekdays++;
    }
  }

  return {
    weekdays,
    weekends,
    holidays: holidayCount,
  };
}

/**
 * 来月の年月を取得
 */
export function getNextMonth(): { year: number; month: number } {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return {
    year: nextMonth.getFullYear(),
    month: nextMonth.getMonth() + 1,
  };
}

/**
 * 指定した年月の祝日一覧を取得
 */
export function getHolidays(year: number, month: number): string[] {
  const yearStr = year.toString();
  const monthStr = month.toString().padStart(2, "0");
  const monthHolidays = holidays[yearStr] || [];

  return monthHolidays.filter((holiday) => holiday.startsWith(`${yearStr}-${monthStr}`));
}