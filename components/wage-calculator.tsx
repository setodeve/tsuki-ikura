"use client";

import { useCallback, useEffect, useState } from "react";
import { usePresets } from "@/hooks/use-presets";
import {
  calculateIncome,
  formatCurrency,
  validateWorkConditions,
} from "@/lib/calculations";
import type { CalculationResult, Preset, WorkConditions } from "@/lib/types";
import { PresetManager } from "./preset-manager";
import { InputField } from "./ui/input-field";
import { ResultCard } from "./ui/result-card";

const initialConditions: WorkConditions = {
  hourly: 1000,
  hoursWeekday: 8,
  hoursHoliday: 0,
  hoursNationalHoliday: 0,
  weekdaysPerMonth: 20,
  holidaysPerMonth: 8,
  nationalHolidaysPerMonth: 2,
};

export function WageCalculator() {
  const [conditions, setConditions] =
    useState<WorkConditions>(initialConditions);
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const { presets, savePreset, deletePreset } = usePresets();

  const calculate = useCallback(() => {
    const validationErrors = validateWorkConditions(conditions);
    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      const result = calculateIncome(conditions);
      setResults(result);
    }
  }, [conditions]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const handleInputChange = (field: keyof WorkConditions, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    setConditions((prev) => ({
      ...prev,
      [field]: Number.isNaN(numValue) ? 0 : numValue,
    }));
  };

  const handleLoadPreset = (preset: Preset) => {
    setConditions(preset.conditions);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">月いくら？</h1>
        <p className="mt-2 text-sm text-gray-600">
          時給と労働時間から月収を即座に計算
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              基本情報
            </h2>
            <InputField
              label="時給"
              suffix="円"
              value={conditions.hourly || ""}
              onChange={(e) => handleInputChange("hourly", e.target.value)}
            />
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              労働時間と日数
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="平日の労働時間"
                  suffix="時間"
                  value={conditions.hoursWeekday || ""}
                  onChange={(e) =>
                    handleInputChange("hoursWeekday", e.target.value)
                  }
                />
                <InputField
                  label="平日数"
                  suffix="日"
                  value={conditions.weekdaysPerMonth || ""}
                  onChange={(e) =>
                    handleInputChange("weekdaysPerMonth", e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="休日の労働時間"
                  suffix="時間"
                  value={conditions.hoursHoliday || ""}
                  onChange={(e) =>
                    handleInputChange("hoursHoliday", e.target.value)
                  }
                />
                <InputField
                  label="休日数"
                  suffix="日"
                  value={conditions.holidaysPerMonth || ""}
                  onChange={(e) =>
                    handleInputChange("holidaysPerMonth", e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="祝日の労働時間"
                  suffix="時間"
                  value={conditions.hoursNationalHoliday || ""}
                  onChange={(e) =>
                    handleInputChange("hoursNationalHoliday", e.target.value)
                  }
                />
                <InputField
                  label="祝日数"
                  suffix="日"
                  value={conditions.nationalHolidaysPerMonth || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "nationalHolidaysPerMonth",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {errors.length > 0 && (
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">入力エラー</p>
              <ul className="mt-2 list-inside list-disc text-sm text-red-700">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {results && errors.length === 0 && (
            <>
              <ResultCard
                title="月額"
                amount={formatCurrency(results.monthly)}
                variant="primary"
              />

              <div className="grid grid-cols-2 gap-3">
                <ResultCard
                  title="平日日額"
                  amount={formatCurrency(results.weekdayDaily)}
                />
                <ResultCard
                  title="休日日額"
                  amount={formatCurrency(results.holidayDaily)}
                />
                <ResultCard
                  title="祝日日額"
                  amount={formatCurrency(results.nationalHolidayDaily)}
                />
                <ResultCard
                  title="週額"
                  amount={formatCurrency(results.weekly)}
                  description="平日5日想定"
                />
              </div>

              <ResultCard
                title="年間見込"
                amount={formatCurrency(results.yearly)}
                description="月額×12ヶ月"
              />
            </>
          )}

          <PresetManager
            presets={presets}
            currentConditions={conditions}
            onSavePreset={savePreset}
            onLoadPreset={handleLoadPreset}
            onDeletePreset={deletePreset}
          />
        </div>
      </div>
    </div>
  );
}
