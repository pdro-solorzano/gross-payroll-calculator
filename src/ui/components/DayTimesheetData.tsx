import { NumberField } from "./NumberField";

interface Props {
  date: Date;
}

function DayTimesheetData({ date }: Props) {
  const formattedDateText = "Monday, Oct 2";

  return (
    <>
      <article className="px-3 py-6 flex justify-between items-baseline border border-zinc-700 rounded-xl lg:px-4 lg:py-7">
        <span className="text-white block lg:text-lg">{formattedDateText}</span>
        <div className="flex justify-end items-baseline gap-2 lg:gap-3">
          <NumberField
            inputID="nf-hours-monday-10-02"
            className="w-17 text-sm py-1.5 px-3 text-center rounded-md border-zinc-700 bg-zinc-800 lg:text-base lg:w-19"
            placeholder="0.0"
            min="0"
            max="24"
          />
          <span className="text-sm text-gray-400 font-light lg:text-base">
            hrs
          </span>
        </div>
      </article>
    </>
  );
}

export { DayTimesheetData };
