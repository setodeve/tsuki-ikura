"use client";

import { useCallback, useEffect, useState } from "react";
import {
  calculateIncome,
  createDefaultConditions,
  formatCurrency,
  validateWorkConditions,
} from "@/lib/calculations";
import type {
  CalculationResult,
  WeeklySchedule,
  WorkConditions,
} from "@/lib/types";
import { InputField } from "./ui/input-field";
import { WeeklyScheduleForm } from "./weekly-schedule";

export function WageCalculator() {
  const [conditions, setConditions] = useState<WorkConditions>(() =>
    createDefaultConditions(),
  );
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

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

  const handleMonthSelect = (year: number, month: number) => {
    setConditions((prev) => ({
      ...prev,
      selectedYear: year,
      selectedMonth: month,
    }));
  };

  const handleWeeklyScheduleChange = (schedule: WeeklySchedule) => {
    setConditions((prev) => ({
      ...prev,
      weeklySchedule: schedule,
    }));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">月いくら？</h1>
        <p className="mt-2 text-sm text-gray-600">
          時給と労働時間から月収を簡単に計算
        </p>
      </header>

      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex items-start">
          <div className="text-blue-500 mr-3 mt-0.5">💡</div>
          <div>
            <h2 className="text-sm font-medium text-blue-900 mb-2">使い方</h2>
            <ol className="text-xs text-blue-800 space-y-1">
              <li>
                <span className="font-medium">1.</span> 時給を入力
              </li>
              <li>
                <span className="font-medium">2.</span>{" "}
                月〜日曜日の労働時間を個別に設定
              </li>
              <li>
                <span className="font-medium">3.</span>{" "}
                計算対象月を選択(デフォルトは来月設定)
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <InputField
              label="時給"
              suffix="円"
              value={conditions.hourly || ""}
              onChange={(e) => handleInputChange("hourly", e.target.value)}
            />
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <WeeklyScheduleForm
              schedule={conditions.weeklySchedule}
              onChange={handleWeeklyScheduleChange}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="block text-sm font-medium text-gray-700 mb-1">
              計算対象月
            </div>
            <select
              value={
                conditions.selectedYear && conditions.selectedMonth
                  ? `${conditions.selectedYear}-${conditions.selectedMonth}`
                  : ""
              }
              onChange={(e) => {
                const [year, month] = e.target.value.split("-").map(Number);
                handleMonthSelect(year, month);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {(() => {
                const options = [];
                const now = new Date();
                const currentYear = now.getFullYear();
                const currentMonth = now.getMonth() + 1;

                for (let i = 0; i < 12; i++) {
                  const targetMonth = currentMonth + i;
                  const targetYear =
                    currentYear + Math.floor((targetMonth - 1) / 12);
                  const adjustedMonth = ((targetMonth - 1) % 12) + 1;

                  options.push(
                    <option
                      key={`${targetYear}-${adjustedMonth}`}
                      value={`${targetYear}-${adjustedMonth}`}
                    >
                      {targetYear}年{adjustedMonth}月
                    </option>,
                  );
                }
                return options;
              })()}
            </select>
          </div>

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
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 text-center">
                計算結果
              </h2>

              {results.calculationBreakdown && (
                <div className="rounded-lg bg-blue-50 p-3 mb-6">
                  <p className="text-sm text-blue-900 text-center">
                    {results.calculationBreakdown.year}年
                    {results.calculationBreakdown.month}月（
                    {results.calculationBreakdown.totalDays}日間）
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {/* 月収 - メイン */}
                <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="text-sm text-blue-700 mb-1">月収</div>
                  <div className="text-3xl font-bold text-blue-900">
                    {formatCurrency(results.monthly)}
                  </div>
                </div>

                {/* サブ情報 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">平均日額</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(results.averageDaily)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {results.calculationBreakdown
                        ? `${results.calculationBreakdown.totalDays}日で割った平均`
                        : "30日で割った平均"}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">年間見込</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(results.yearly)}
                    </div>
                    <div className="text-xs text-gray-500">月収×12ヶ月</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TODO: プリセット機能を追加する */}
          {/* <PresetManager
            presets={presets}
            currentConditions={conditions}
            onSavePreset={savePreset}
            onLoadPreset={handleLoadPreset}
            onDeletePreset={deletePreset}
          /> */}
        </div>
      </div>
    </div>
  );
}
