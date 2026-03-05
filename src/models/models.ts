type UIState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string };

type AppData =
  | {
      status: "setup";
      data: {
        payPeriod: "weekly" | "biweekly" | null;
        timesheet: TimesheetMap;
        hourlyRate: number | null;
        firstBusinessDay: DayName | null;
        uiState: UIState;
      };
    }
  | {
      status: "ready";
      data: {
        payPeriod: "weekly" | "biweekly";
        timesheet: TimesheetMap;
        hourlyRate: number; // Cannot be 0
        firstBusinessDay: DayName;
        uiState: UIState;
      };
    };

type SetUpAppData = Extract<AppData, { status: "setup" }>;
type ReadyAppData = Extract<AppData, { status: "ready" }>;
type UpdatableAppData = Pick<
  ReadyAppData["data"],
  "payPeriod" | "hourlyRate" | "firstBusinessDay"
>;

type DayName =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

type DayData = {
  name: DayName;
  workedHours: number;
  date: Date;
};

type TimesheetKey = `${ReadyAppData["data"]["payPeriod"]}-${string}`;
type TimesheetMap = Record<TimesheetKey, TimesheetData>;

type TimesheetData = {
  startDate: Date;
  endDate: Date;
  period: WeeklyPeriod | BiWeeklyPeriod;
  hourlyRate: ReadyAppData["data"]["hourlyRate"]; // same, cannot be 0
};

type WeeklyPeriod = [
  DayData,
  DayData,
  DayData,
  DayData,
  DayData,
  DayData,
  DayData,
];

type BiWeeklyPeriod = [
  DayData,
  DayData,
  DayData,
  DayData,
  DayData,
  DayData,
  DayData,
  DayData,
  DayData,
  DayData,
  DayData,
  DayData,
  DayData,
  DayData,
];

export type {
  AppData,
  UpdatableAppData,
  DayData,
  DayName,
  TimesheetData,
  WeeklyPeriod,
  BiWeeklyPeriod,
  TimesheetKey,
  TimesheetMap,
  SetUpAppData,
  ReadyAppData,
  UIState,
};
