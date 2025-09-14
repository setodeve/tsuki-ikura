"use client";

import type { WeeklySchedule } from "@/lib/types";
import { InputField } from "./ui/input-field";

interface WeeklyScheduleProps {
  schedule: WeeklySchedule;
  onChange: (schedule: WeeklySchedule) => void;
}

const dayLabels = [
  { key: "monday", label: "月", fullLabel: "月曜日" },
  { key: "tuesday", label: "火", fullLabel: "火曜日" },
  { key: "wednesday", label: "水", fullLabel: "水曜日" },
  { key: "thursday", label: "木", fullLabel: "木曜日" },
  { key: "friday", label: "金", fullLabel: "金曜日" },
  { key: "saturday", label: "土", fullLabel: "土曜日" },
  { key: "sunday", label: "日", fullLabel: "日曜日" },
] as const;

export function WeeklyScheduleForm({
  schedule,
  onChange,
}: WeeklyScheduleProps) {
  const handleDayChange = (day: keyof WeeklySchedule, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    onChange({
      ...schedule,
      [day]: Number.isNaN(numValue) ? 0 : numValue,
    });
  };

  const totalWeeklyHours =
    schedule.monday +
    schedule.tuesday +
    schedule.wednesday +
    schedule.thursday +
    schedule.friday +
    schedule.saturday +
    schedule.sunday;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {dayLabels.map(({ key, fullLabel }) => (
          <div key={key} className="flex items-center gap-3">
            <div className="flex-1">
              <InputField
                label={fullLabel}
                suffix="時間"
                min="0"
                max="24"
                step="0.5"
                value={schedule[key] || ""}
                onChange={(e) => handleDayChange(key, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-gray-50 p-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">週の合計労働時間:</span>
          <span className="font-medium text-gray-900">
            {totalWeeklyHours.toFixed(1)}時間
          </span>
        </div>
      </div>
    </div>
  );
}
