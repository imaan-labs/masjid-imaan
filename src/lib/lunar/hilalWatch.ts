import {
  Body,
  Equator,
  Horizon,
  Illumination,
  MoonPhase,
  Observer,
  SearchRiseSet,
} from "astronomy-engine";
import { gregorianForHijri, gregorianLabel, gregorianParts, chicagoDate, hijriLabel } from "./calendarData";

export const MELISSA = {
  latitude: 33.2859,
  longitude: -96.5728,
};

const observer = new Observer(MELISSA.latitude, MELISSA.longitude, 0);

export type VisibilityRating =
  | "Easily Visible"
  | "Visible Under Clear Skies"
  | "Optical Aid / Difficult"
  | "Not Visible";

export type MoonSummary = {
  phaseName: string;
  illuminationPercent: number;
};

export type HilalProspect = {
  hijriLabel: string;
  gregorianLabel: string;
  sunsetLabel: string;
  moonsetLabel: string;
  lagMinutes: number;
  illuminationPercent: number;
  altitudeDegrees: number;
  windowLabel: string;
  rating: VisibilityRating;
};

export function phaseName(angle: number) {
  const normalized = ((angle % 360) + 360) % 360;
  if (normalized < 22.5 || normalized >= 337.5) return "New Moon";
  if (normalized < 67.5) return "Waxing Crescent";
  if (normalized < 112.5) return "First Quarter";
  if (normalized < 157.5) return "Waxing Gibbous";
  if (normalized < 202.5) return "Full Moon";
  if (normalized < 247.5) return "Waning Gibbous";
  if (normalized < 292.5) return "Last Quarter";
  return "Waning Crescent";
}

export function moonSummary(date: Date): MoonSummary {
  const illumination = Illumination(Body.Moon, date).phase_fraction * 100;
  return {
    phaseName: phaseName(MoonPhase(date)),
    illuminationPercent: illumination < 10 ? Math.round(illumination * 10) / 10 : Math.round(illumination),
  };
}

export function visibilityRating(lagMinutes: number, illuminationPercent: number): VisibilityRating {
  if (lagMinutes < 1) return "Not Visible";
  if (lagMinutes > 45 && illuminationPercent > 2) return "Easily Visible";
  if (lagMinutes >= 30 && lagMinutes <= 45) return "Visible Under Clear Skies";
  return "Optical Aid / Difficult";
}

function clock(date: Date) {
  return date.toLocaleTimeString("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    minute: "2-digit",
  });
}

function moonAltitude(date: Date) {
  const equatorial = Equator(Body.Moon, date, observer, true, true);
  return Horizon(date, observer, equatorial.ra, equatorial.dec, "normal").altitude;
}

export function hilalProspect(year: number, month: number): HilalProspect | null {
  const evening = gregorianForHijri(year, month, 29);
  if (!evening) return null;

  const civil = gregorianParts(evening);
  const noon = chicagoDate(civil.year, civil.month, civil.day, 12, 0);
  const sunset = SearchRiseSet(Body.Sun, observer, -1, noon, 1);
  if (!sunset) return null;

  const priorSet = SearchRiseSet(Body.Moon, observer, -1, sunset.date, -2);
  const priorRise = SearchRiseSet(Body.Moon, observer, 1, sunset.date, -2);
  const moonUp = Boolean(priorRise && (!priorSet || priorRise.date.getTime() > priorSet.date.getTime()));
  const moonset = moonUp ? SearchRiseSet(Body.Moon, observer, -1, sunset.date, 2) : priorSet;
  const lagMinutes =
    moonUp && moonset ? (moonset.date.getTime() - sunset.date.getTime()) / 60000 : -1;

  const windowStart = new Date(sunset.date.getTime() + 15 * 60000);
  const windowEnd = new Date(sunset.date.getTime() + 45 * 60000);
  const illumination = Illumination(Body.Moon, windowStart).phase_fraction * 100;
  const altitude = moonAltitude(windowStart);

  return {
    hijriLabel: hijriLabel({ year, month, day: 29 }),
    gregorianLabel: gregorianLabel(evening, true),
    sunsetLabel: clock(sunset.date),
    moonsetLabel: moonset ? clock(moonset.date) : "No moonset",
    lagMinutes: Math.round(lagMinutes),
    illuminationPercent: illumination < 10 ? Math.round(illumination * 10) / 10 : Math.round(illumination),
    altitudeDegrees: Math.round(altitude * 10) / 10,
    windowLabel: `${clock(windowStart)} – ${clock(windowEnd)}`,
    rating: visibilityRating(lagMinutes, illumination),
  };
}
