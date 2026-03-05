import type { BiWeeklyPeriod, DayData, WeeklyPeriod } from "../models/models";

function updateDayWorkedHours(
  prevPeriod: WeeklyPeriod | BiWeeklyPeriod,
  dayIndex: number,
  newWorkedHours: DayData["workedHours"]
): WeeklyPeriod | BiWeeklyPeriod {
  if (newWorkedHours !== null && newWorkedHours <= 0) {
    throw new Error("New worked hours must be greater than 0");
  }

  const newPeriod = prevPeriod.map((dayData, index) =>
    index === dayIndex ? { ...dayData, workedHours: newWorkedHours } : dayData
  ) as WeeklyPeriod | BiWeeklyPeriod;

  return newPeriod;
}

export { updateDayWorkedHours };
