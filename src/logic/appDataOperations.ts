import type {
  AppData,
  DayData,
  ReadyAppData,
  TimesheetData,
  TimesheetMap,
  UIState,
  UpdatableAppData,
} from "../models/models";
import { updateDayWorkedHours } from "./periodOperations";
import {
  addTimesheetRecord,
  checkIfTimesheetRecordIsCurrent,
  createTimesheetKey,
  getTimesheetRecordByKey,
  updateTimesheetRecord,
} from "./timesheetOperations";

function changeUIState<T extends AppData>(
  prevAppData: T,
  newUIState: UIState,
): T {
  return { ...prevAppData, data: { ...prevAppData.data, uiState: newUIState } };
}

function setUIStateError<T extends AppData>(
  prevAppData: T,
  errorMessage: string,
): T {
  return changeUIState(prevAppData, {
    status: "error",
    message: errorMessage,
  });
}

function setUIStateLoading<T extends AppData>(prevAppData: T): T {
  return changeUIState(prevAppData, { status: "loading" });
}

function setUIStateIdle<T extends AppData>(prevAppData: T): T {
  return changeUIState(prevAppData, { status: "idle" });
}

function changeAppDataStatus<T extends AppData>(
  prevAppData: T,
  newAppDataStatus: "setup" | "ready",
): T {
  return { ...prevAppData, status: newAppDataStatus };
}

function updateAppData<T extends AppData>(
  prevAppData: T,
  newData: Partial<UpdatableAppData>,
): T {
  if (newData.hourlyRate !== undefined && newData.hourlyRate < 0) {
    throw new Error("Hourly rate must be greater than 0");
  }

  return {
    ...prevAppData,
    data: { ...prevAppData.data, ...newData },
  };
}

function updateAppDataTimesheetMap<T extends AppData>(
  prevAppData: T,
  newTimesheetMap: TimesheetMap,
): T {
  return {
    ...prevAppData,
    data: { ...prevAppData.data, timesheet: newTimesheetMap },
  };
}

function updateHourlyRateInAppData(
  prevAppData: ReadyAppData,
  timesheetRecord: TimesheetData,
  newHourlyRate: ReadyAppData["data"]["hourlyRate"],
): AppData {
  const newAppData = prevAppData;
  const { firstBusinessDay, hourlyRate, payPeriod } = prevAppData.data;
  const timesheetKey = createTimesheetKey(
    prevAppData.data.payPeriod,
    timesheetRecord.startDate,
  );

  // If timesheetRecord is current, updateHourlyRate in AppData too
  if (
    checkIfTimesheetRecordIsCurrent(timesheetRecord, {
      firstBusinessDay,
      hourlyRate,
      payPeriod,
    })
  ) {
    newAppData.data.hourlyRate = newHourlyRate;
  }

  if (getTimesheetRecordByKey(prevAppData.data.timesheet, timesheetKey)) {
    const newTimesheetMap = updateTimesheetRecord(
      prevAppData.data.timesheet,
      timesheetKey,
      { hourlyRate: newHourlyRate },
    );
    newAppData.data.timesheet = newTimesheetMap;
  } else {
    const newTimesheetMap = addTimesheetRecord(
      prevAppData.data.timesheet,
      timesheetKey,
      { ...timesheetRecord, hourlyRate: newHourlyRate }, // Ensure hourlyRate is the one passed in onChange params
    );
    newAppData.data.timesheet = newTimesheetMap;
  }

  return newAppData;
}

function updateWorkedHoursInTimesheetRecord(
  prevAppData: ReadyAppData,
  timesheetRecord: TimesheetData,
  dayIndex: number,
  newWorkedHours: DayData["workedHours"],
): AppData {
  if (
    (prevAppData.data.payPeriod === "weekly" && dayIndex < 0 && dayIndex > 6) ||
    (prevAppData.data.payPeriod === "biweekly" && dayIndex < 0 && dayIndex > 13)
  ) {
    throw new Error("Day Index provided exceeds period range");
  }

  const newAppData = prevAppData;
  const timesheetKey = createTimesheetKey(
    prevAppData.data.payPeriod,
    timesheetRecord.startDate,
  );

  if (getTimesheetRecordByKey(prevAppData.data.timesheet, timesheetKey)) {
    const newPeriod = updateDayWorkedHours(
      prevAppData.data.timesheet[timesheetKey].period,
      dayIndex,
      newWorkedHours,
    );
    const newTimesheetMap = updateTimesheetRecord(
      prevAppData.data.timesheet,
      timesheetKey,
      { period: newPeriod },
    );
    newAppData.data.timesheet = newTimesheetMap;
  } else {
    const newPeriod = updateDayWorkedHours(
      prevAppData.data.timesheet[timesheetKey].period,
      dayIndex,
      newWorkedHours,
    );
    const newTimesheetMap = addTimesheetRecord(
      prevAppData.data.timesheet,
      timesheetKey,
      { ...timesheetRecord, period: newPeriod },
    );
    newAppData.data.timesheet = newTimesheetMap;
  }

  return newAppData;
}

export {
  changeUIState,
  setUIStateError,
  setUIStateLoading,
  setUIStateIdle,
  changeAppDataStatus,
  updateAppData,
  updateAppDataTimesheetMap,
  updateHourlyRateInAppData,
  updateWorkedHoursInTimesheetRecord,
};
