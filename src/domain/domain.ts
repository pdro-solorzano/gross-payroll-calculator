import { setUIStateError, updateAppData } from "../logic/appDataOperations.ts";
import { changeAppDataStatus } from "../logic/appDataOperations.ts";
import type {
  AppData,
  DayData,
  DayName,
  ReadyAppData,
  TimesheetData,
  UpdatableAppData,
  WeeklyPeriod,
} from "../models/models";
import { getKeyByValue, weekDaysIndex } from "../utils/utils";

type WorkedHoursData = {
  regularHours: number;
  overtimeHours: number;
};

type PaymentData = {
  regularPay: number;
  overtimePay: number;
};

function isFirstWeekOfFortnight(weekNumber: number) {
  return weekNumber % 2 !== 0;
}

function isFromSundayToSaturday(firstBusinessDay: DayName) {
  return firstBusinessDay === "sunday";
}

function isDayAheadOfFirstBusinessDay(day: DayName, firstBusinessDay: DayName) {
  return getKeyByValue(day) >= getKeyByValue(firstBusinessDay);
}

function getLastBusinessDay(firstBusinessDay: DayName): DayName {
  if (firstBusinessDay === "sunday") {
    return "saturday";
  }

  const i =
    Object.values(weekDaysIndex).findIndex((el) => el === firstBusinessDay) - 1;
  return Object.values(weekDaysIndex)[i];
}

function getDayName(dayIndex: number): DayName {
  if (dayIndex > 6) {
    throw new Error("dayIndex must be between 0 and 6");
  }

  return weekDaysIndex[dayIndex];
}

function canPromoteToReady(appData: AppData): AppData {
  // Check
  const { firstBusinessDay, hourlyRate, payPeriod } = appData.data;

  if (firstBusinessDay !== null && hourlyRate !== null && payPeriod !== null) {
    return changeAppDataStatus(appData, "ready");
  }

  return changeAppDataStatus(appData, "setup");
}

function isTimesheetCurrent(
  timesheet: TimesheetData,
  currentTimesheet: TimesheetData,
) {
  return (
    timesheet.period.length === currentTimesheet.period.length &&
    timesheet.startDate.getTime() === currentTimesheet.startDate.getTime()
  );
}

function calculateWeeklyWorkedHours(period: WeeklyPeriod): WorkedHoursData {
  if (period.length !== 7) {
    throw new Error("Period length is not weekly period");
  }

  const workedHours = period.reduce(
    (acc: number, currentDayData: DayData) =>
      acc + (currentDayData.workedHours ?? 0),
    0,
  );
  const regularHours = workedHours >= 40 ? 40 : workedHours;
  const overtimeHours = workedHours >= 40 ? workedHours - 40 : 0;

  return { regularHours, overtimeHours };
}

function calculateWorkedHours(
  payPeriod: ReadyAppData["data"]["payPeriod"],
  period: TimesheetData["period"],
): WorkedHoursData {
  if (payPeriod === "weekly") {
    if (period.length !== 7) {
      throw new Error("Period length must be 7 days");
    }

    return calculateWeeklyWorkedHours(period);
  } else {
    if (period.length !== 14) {
      throw new Error("Period length must be 14 days");
    }

    let startIndex = 0;
    let endIndex = period.length / 2;
    let regularHours = 0;
    let overtimeHours = 0;

    for (let i = 0; i < 2; i++) {
      const { regularHours: reg, overtimeHours: ovr } =
        calculateWeeklyWorkedHours(
          period.slice(startIndex, endIndex) as WeeklyPeriod,
        );
      regularHours += reg;
      overtimeHours += ovr;

      startIndex = endIndex;
      endIndex = period.length;
    }

    return { regularHours, overtimeHours };
  }
}

function calculatePayment(
  workedHours: WorkedHoursData,
  hourlyRate: ReadyAppData["data"]["hourlyRate"],
): PaymentData {
  if (hourlyRate <= 0) {
    throw new Error("Hourly rate must be a positive number");
  }

  const regularPay = workedHours.regularHours * hourlyRate;
  const overtimePay = workedHours.overtimeHours * hourlyRate * 1.5;
  return { regularPay, overtimePay };
}

function handleAppDataUpdateTransition<T extends AppData>(
  prevAppData: T,
  newData: Partial<UpdatableAppData>,
): T {
  try {
    const newAppData = updateAppData(prevAppData, newData);
    return newAppData;
  } catch (error) {
    if (error instanceof Error) {
      const failedAppData = setUIStateError(prevAppData, error.message);
      return failedAppData;
    }
  }

  return prevAppData;
}

export {
  isFirstWeekOfFortnight,
  isFromSundayToSaturday,
  isDayAheadOfFirstBusinessDay,
  canPromoteToReady,
  getLastBusinessDay,
  getDayName,
  isTimesheetCurrent,
  calculateWorkedHours,
  calculatePayment,
  handleAppDataUpdateTransition,
};
