export interface WorkConditions {
  hourly: number;
  hoursWeekday: number;
  hoursHoliday: number;
  hoursNationalHoliday: number;
  weekdaysPerMonth: number;
  holidaysPerMonth: number;
  nationalHolidaysPerMonth: number;
}

export interface CalculationResult {
  monthly: number;
  weekdayDaily: number;
  holidayDaily: number;
  nationalHolidayDaily: number;
  weekly: number;
  yearly: number;
}

export interface Preset {
  id: string;
  name: string;
  conditions: WorkConditions;
  createdAt: string;
  updatedAt: string;
}
