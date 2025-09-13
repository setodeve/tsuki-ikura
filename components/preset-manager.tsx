"use client";

import { useState } from "react";
import type { Preset, WorkConditions } from "@/lib/types";

interface PresetManagerProps {
  presets: Preset[];
  currentConditions: WorkConditions;
  onSavePreset: (name: string, conditions: WorkConditions) => void;
  onLoadPreset: (preset: Preset) => void;
  onDeletePreset: (id: string) => void;
}

export function PresetManager({
  presets,
  currentConditions,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
}: PresetManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [presetName, setPresetName] = useState("");

  const handleSave = () => {
    if (presetName.trim()) {
      onSavePreset(presetName, currentConditions);
      setPresetName("");
      setIsAdding(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">プリセット</h2>

      {presets.length > 0 && (
        <div className="mb-4 space-y-2">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2"
            >
              <button
                type="button"
                onClick={() => onLoadPreset(preset)}
                className="flex-1 text-left text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                {preset.name}
              </button>
              <button
                type="button"
                onClick={() => onDeletePreset(preset.id)}
                className="ml-2 text-sm text-red-600 hover:text-red-800"
                aria-label={`${preset.name}を削除`}
              >
                削除
              </button>
            </div>
          ))}
        </div>
      )}

      {isAdding ? (
        <div className="space-y-2">
          <input
            type="text"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="プリセット名"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              保存
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setPresetName("");
              }}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="w-full rounded-lg border border-blue-600 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
        >
          現在の設定を保存
        </button>
      )}
    </div>
  );
}
