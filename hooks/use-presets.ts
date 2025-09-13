"use client";

import { useEffect, useState } from "react";
import type { Preset, WorkConditions } from "@/lib/types";

const STORAGE_KEY = "wage-calculator-presets";

export function usePresets() {
  const [presets, setPresets] = useState<Preset[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setPresets(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to load presets:", error);
      }
    }
  }, []);

  const savePreset = (name: string, conditions: WorkConditions) => {
    const newPreset: Preset = {
      id: Date.now().toString(),
      name,
      conditions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newPreset;
  };

  const deletePreset = (id: string) => {
    const updated = presets.filter((p) => p.id !== id);
    setPresets(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const updatePreset = (
    id: string,
    name: string,
    conditions: WorkConditions,
  ) => {
    const updated = presets.map((p) =>
      p.id === id
        ? { ...p, name, conditions, updatedAt: new Date().toISOString() }
        : p,
    );
    setPresets(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return {
    presets,
    savePreset,
    deletePreset,
    updatePreset,
  };
}
