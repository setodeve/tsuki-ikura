// 曜日別設定の型定義
export interface WeeklySchedule {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
}

export interface WorkConditions {
  hourly: number;
  weeklySchedule: WeeklySchedule;
  selectedYear?: number;
  selectedMonth?: number;
}

export interface CalculationResult {
  monthly: number;
  averageDaily: number;
  yearly: number;
  calculationBreakdown?: {
    year: number;
    month: number;
    weekdays: number;
    weekends: number;
    holidays: number;
    totalDays: number;
  };
}

export interface Preset {
  id: string;
  name: string;
  conditions: WorkConditions;
  createdAt: string;
  updatedAt: string;
}
