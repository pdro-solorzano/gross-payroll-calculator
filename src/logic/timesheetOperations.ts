import {
  calculatePayment,
  calculateWorkedHours,
  getDayName,
  getLastBusinessDay,
  isFirstWeekOfFortnight,
  isFromSundayToSaturday,
  isTimesheetCurrent,
} from "../domain/domain";
import {
  dayjs,
  getKeyByValue,
  isDayAfterDay,
  isNullOrEmpty,
} from "../utils/utils";
import type {
  BiWeeklyPeriod,
  DayName,
  ReadyAppData,
  TimesheetData,
  TimesheetKey,
  TimesheetMap,
  WeeklyPeriod,
} from "../models/models";

type TimesheetContext = {
  payPeriod: ReadyAppData["data"]["payPeriod"];
  firstBusinessDay: ReadyAppData["data"]["firstBusinessDay"];
  lastBusinessDay: DayName;
  currentWeekNumber: number;
  currentDayName: DayName;
  previousPeriods: number;
};

type TimesheetGeneratorParams = Pick<
  ReadyAppData["data"],
  "firstBusinessDay" | "hourlyRate" | "payPeriod"
> & { previousPeriods?: number };

type UpdatableTimesheetData = Pick<TimesheetData, "period" | "hourlyRate">;

type PaymentInfo = {
  regularPay: number;
  overtimePay: number;
  regularHours: number;
  overtimeHours: number;
};

function createTimesheetKey(
  payPeriod: ReadyAppData["data"]["payPeriod"],
  startDate: TimesheetData["startDate"]
): TimesheetKey {
  const startDateString = startDate.toISOString().split("T")[0];
  return `${payPeriod}-${startDateString}`;
}

function createTimesheetRecord(
  params: TimesheetGeneratorParams
): TimesheetData {
  if (params.hourlyRate < 0) {
    throw new Error("Hourly Rate must be greater than 0");
  }

  const context = buildTimesheetContext(params);
  const { startDate, endDate } =
    context.payPeriod === "weekly"
      ? calculateWeeklyPeriod(context)
      : calculateBiWeeklyPeriod(context);
  const period = createPeriod(startDate, endDate, context.payPeriod);

  return { startDate, endDate, hourlyRate: params.hourlyRate, period };
}

// CreateTimesheet helper functions
function buildTimesheetContext(
  params: TimesheetGeneratorParams
): TimesheetContext {
  const lastBusinessDay = getLastBusinessDay(params.firstBusinessDay);
  const currentWeekNumber = dayjs().week();
  const currentDayName = getDayName(dayjs().day());

  return {
    payPeriod: params.payPeriod,
    firstBusinessDay: params.firstBusinessDay,
    lastBusinessDay,
    currentWeekNumber,
    currentDayName,
    previousPeriods: params.previousPeriods ?? 0,
  };
}

function calculateWeeklyPeriod(context: TimesheetContext): {
  startDate: Date;
  endDate: Date;
} {
  let startWeekAdjustment: number;
  let endWeekAdjustment: number;
  const weekNumber = context.currentWeekNumber - context.previousPeriods;
  const firstBusinessDayNumber = getKeyByValue(context.firstBusinessDay);
  const lastBusinessDayNumber = getKeyByValue(context.lastBusinessDay);

  if (isFromSundayToSaturday(context.firstBusinessDay)) {
    // Business Week Sunday - Saturday -> Same dayjs week
    const startDate: Date = getDateFromWeekAndDay(
      weekNumber,
      firstBusinessDayNumber
    );
    const endDate: Date = getDateFromWeekAndDay(
      weekNumber,
      lastBusinessDayNumber
    );

    return { startDate, endDate };
  }

  if (isDayAfterDay(context.currentDayName, context.firstBusinessDay)) {
    // current day belongs to current business week
    startWeekAdjustment = 0;
    endWeekAdjustment = 1;
  } else {
    // current day belongs to prev business week
    startWeekAdjustment = -1;
    endWeekAdjustment = 0;
  }
  const startDate: Date = getDateFromWeekAndDay(
    weekNumber + startWeekAdjustment,
    firstBusinessDayNumber
  );
  const endDate: Date = getDateFromWeekAndDay(
    weekNumber + endWeekAdjustment,
    lastBusinessDayNumber
  );

  return { startDate, endDate };
}

function calculateBiWeeklyPeriod(context: TimesheetContext): {
  startDate: Date;
  endDate: Date;
} {
  let startWeekAdjustment: number;
  let endWeekAdjustment: number;
  const weekNumber = context.currentWeekNumber - context.previousPeriods * 2;
  const firstBusinessDayNumber = getKeyByValue(context.firstBusinessDay);
  const lastBusinessDayNumber = getKeyByValue(context.lastBusinessDay);

  if (isFromSundayToSaturday(context.firstBusinessDay)) {
    return isFirstWeekOfFortnight(weekNumber)
      ? {
          startDate: getDateFromWeekAndDay(weekNumber, firstBusinessDayNumber),
          endDate: getDateFromWeekAndDay(weekNumber + 1, lastBusinessDayNumber),
        }
      : {
          startDate: getDateFromWeekAndDay(
            weekNumber - 1,
            firstBusinessDayNumber
          ),
          endDate: getDateFromWeekAndDay(weekNumber, lastBusinessDayNumber),
        };
  }

  if (isFirstWeekOfFortnight(weekNumber)) {
    // First fortnight week
    if (isDayAfterDay(context.currentDayName, context.firstBusinessDay)) {
      // current date is in same dayjs week than start business day
      startWeekAdjustment = 0;
      endWeekAdjustment = 2;
    } else {
      // current date before business start date. So it belongs to previous bi-weekly period
      startWeekAdjustment = -2;
      endWeekAdjustment = 0;
    }
  } else {
    // Second Fortnight week
    // Business weeks != dayjs weeks
    // current day belongs to last week of bi-weekly period
    startWeekAdjustment = -1;
    endWeekAdjustment = 1;
  }

  const startDate: Date = getDateFromWeekAndDay(
    weekNumber + startWeekAdjustment,
    firstBusinessDayNumber
  );
  const endDate: Date = getDateFromWeekAndDay(
    weekNumber + endWeekAdjustment,
    lastBusinessDayNumber
  );

  return { startDate, endDate };
}

function getDateFromWeekAndDay(weekNumber: number, day: number): Date {
  if (weekNumber < 0 || day < 0) {
    throw new Error("weekNumber or day must be greater than 0");
  }
  return dayjs().week(weekNumber).day(day).startOf("date").toDate();
}

function createPeriod(
  startDate: Date,
  endDate: Date,
  payPeriod: ReadyAppData["data"]["payPeriod"]
): WeeklyPeriod | BiWeeklyPeriod {
  const period: WeeklyPeriod | BiWeeklyPeriod = createEmptyPeriod(payPeriod);

  let date = dayjs(startDate);
  let i = 0;
  while (date.isSameOrBefore(endDate)) {
    period[i] = {
      name: getDayName(date.day()),
      date: date.toDate(),
      workedHours: 0,
    };
    date = date.add(1, "day");
    i++;
  }

  return period;
}

function createEmptyPeriod(
  payPeriod: ReadyAppData["data"]["payPeriod"]
): WeeklyPeriod | BiWeeklyPeriod {
  if (payPeriod === "biweekly") {
    return Array(14).fill(null) as BiWeeklyPeriod;
  }

  return Array(7).fill(null) as WeeklyPeriod;
}

function addTimesheetRecord(
  prevTimesheetMap: TimesheetMap,
  newTimesheetRecordKey: TimesheetKey,
  newTimesheetRecord: TimesheetData
): TimesheetMap {
  return { ...prevTimesheetMap, [newTimesheetRecordKey]: newTimesheetRecord };
}

function getTimesheetRecordByKey(
  timesheetMap: TimesheetMap,
  timesheetRecordKey: TimesheetKey
): TimesheetData {
  return timesheetMap[timesheetRecordKey];
}

function updateTimesheetRecord(
  prevTimesheetMap: TimesheetMap,
  timesheetRecordKey: TimesheetKey,
  newData: Partial<UpdatableTimesheetData>
): TimesheetMap {
  if (newData.hourlyRate !== undefined && newData.hourlyRate < 1) {
    throw new Error("New hourly rate must be greater than 0");
  }

  const record: TimesheetData = prevTimesheetMap[timesheetRecordKey];
  if (!record) {
    return prevTimesheetMap;
  }

  return {
    ...prevTimesheetMap,
    [timesheetRecordKey]: {
      ...record,
      hourlyRate: newData.hourlyRate ?? record.hourlyRate,
      period: newData.period ?? record.period,
    },
  };
}

function canCreateTimesheetRecord(context: TimesheetGeneratorParams): boolean {
  const {
    firstBusinessDay,
    hourlyRate,
    payPeriod,
    previousPeriods = 0,
  } = context;
  const timesheet = createTimesheetRecord({
    firstBusinessDay,
    hourlyRate,
    payPeriod,
    previousPeriods,
  });

  return !isNullOrEmpty(timesheet);
}

function checkIfTimesheetRecordIsCurrent(
  timesheet: TimesheetData,
  currentTimesheetParams: TimesheetGeneratorParams
) {
  const currentTimesheet = createTimesheetRecord(currentTimesheetParams);
  return isTimesheetCurrent(timesheet, currentTimesheet);
}

function generateTimesheetRecordData(
  prevTimesheetMap: TimesheetMap,
  params: TimesheetGeneratorParams
): TimesheetData {
  // hourlyRate must take its value depends of the current timesheet record shown
  const timesheet = createTimesheetRecord(params);
  const timesheetKey = createTimesheetKey(
    params.payPeriod,
    timesheet.startDate
  );
  const searchedTimesheet = getTimesheetRecordByKey(
    prevTimesheetMap,
    timesheetKey
  );

  if (!isNullOrEmpty(searchedTimesheet)) {
    return searchedTimesheet;
  }

  return timesheet;
}

function getTimesheetRecordsPaymentInfo(
  timesheetRecord: TimesheetData
): PaymentInfo {
  const payPeriod: ReadyAppData["data"]["payPeriod"] =
    timesheetRecord.period.length === 7 ? "weekly" : "biweekly";
  const workedHoursData = calculateWorkedHours(
    payPeriod,
    timesheetRecord.period
  );
  const paymentData = calculatePayment(
    workedHoursData,
    timesheetRecord.hourlyRate
  );

  return {
    regularHours: workedHoursData.regularHours,
    overtimeHours: workedHoursData.overtimeHours,
    regularPay: paymentData.regularPay,
    overtimePay: paymentData.overtimePay,
  };
}

export {
  createTimesheetKey,
  createTimesheetRecord,
  addTimesheetRecord,
  getTimesheetRecordByKey,
  updateTimesheetRecord,
  canCreateTimesheetRecord,
  checkIfTimesheetRecordIsCurrent,
  generateTimesheetRecordData,
  getTimesheetRecordsPaymentInfo,
};

export type { TimesheetGeneratorParams };
