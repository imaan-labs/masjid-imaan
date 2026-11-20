import { hijriFromDate } from "@/src/lib/lunar/calendarData";

export type RamadanPhase = "approaching" | "active" | null;

export function getTargetRamadanHijriYear(date = new Date()) {
  const hijri = hijriFromDate(date);
  if (hijri.month >= 10) return hijri.year + 1;
  return hijri.year;
}

export function isRamadanSeasonActive(date = new Date()) {
  const hijri = hijriFromDate(date);
  const hijriYear = getTargetRamadanHijriYear(date);
  if (hijri.month === 9) {
    return { active: true, phase: "active" as const, hijriYear: hijri.year };
  }
  if (hijri.month === 8 && hijri.day >= 14) {
    return { active: true, phase: "approaching" as const, hijriYear };
  }
  return { active: false, phase: null as RamadanPhase, hijriYear };
}
