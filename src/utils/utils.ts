import type { DayName } from "../models/models";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import dayOfYear from "dayjs/plugin/dayOfYear";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";

dayjs.extend(weekOfYear);
dayjs.extend(dayOfYear);
dayjs.extend(isSameOrBefore);
dayjs.extend(utc);
dayjs.extend(isBetween);

function castValueToInput<T>(value: T) {
  return value === null || value === undefined ? "" : value + "";
}

function castValueToNumber<T>(value: T) {
  return value === null || value === undefined ? "0" : value + "";
}

function checkIfValueIsInvalid(value: string, allowZero?: boolean) {
  if (value === "") {
    return false;
  }

  return allowZero ? Number(value) < 0 : Number(value) <= 0;
}

function isNullOrEmpty(obj: object) {
  return obj === null || obj === undefined || Object.keys(obj).length === 0;
}

function getKeyByValue(value: DayName) {
  const i = Object.values(weekDaysIndex).findIndex((el) => el === value);
  return Number(Object.keys(weekDaysIndex)[i]);
}

function toCapitalize(text: string) {
  return `${text.slice(0, 1).toUpperCase()}${text.slice(1)}`;
}

function isDayAfterDay(baseDay: DayName, day2: DayName) {
  return getKeyByValue(baseDay) >= getKeyByValue(day2);
}

const weekDaysIndex: Record<number, DayName> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

export {
  castValueToInput,
  checkIfValueIsInvalid,
  weekDaysIndex,
  getKeyByValue,
  dayjs,
  toCapitalize,
  castValueToNumber,
  isNullOrEmpty,
  isDayAfterDay,
};
