import { table } from "console";
import { DayTimesheetData } from "../components/DayTimesheetData";

function TimesheetView() {
  return (
    <>
      <header className="flex justify-between items-baseline font-header">
        <span className="font-semibold text-lg text-white lg:text-xl">
          Hours Record
        </span>
        <span className="text-xs text-gray-400 text-right lg:text-sm">
          Manual Entry
        </span>
      </header>
      <section className="flex flex-col gap-3 lg:gap-5">
        <DayTimesheetData />
        <DayTimesheetData />
      </section>
    </>
  );
}

export { TimesheetView };
