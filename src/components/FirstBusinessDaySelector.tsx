type Days = {
  value: string;
  label: string;
};

interface Props {
  labelText: string;
  options?: Days[];
}

const days: Days[] = [
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
  { label: "Saturday", value: "saturday" },
  { label: "Sunday", value: "sunday" },
];

function FirstBusinessDaySelector({ labelText, options = days }: Props) {
  return (
    <label
      htmlFor="slc-first-business-day"
      className="relative font-body text-white space-y-2 lg:space-y-3.5"
    >
      <span className="block text-2xl font-medium font-header lg:text-3xl">
        {labelText}
      </span>
      <select
        name=""
        id="slc-first-business-day"
        className="block text-right py-6 px-3 bg-zinc-800 rounded-xl w-full text-lg outline-0 border-2 border-transparent text-blue-500 mb-0
          focus:border-blue-500 cursor-pointer lg:bg-zinc-700/35 lg:pb-4.5 lg:pt-10.5 lg:rounded-2xl lg:text-left lg:pl-[calc(60px+(87px-60px)/2+.5rem)] lg:text-white"
      >
        {options.map((opt) => (
          <option value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <span className="bg-blue-500 size-13 absolute top-13 left-3 flex justify-center items-center rounded-lg pointer-events-none mb-0 lg:size-15 lg:left-[calc((87px-60px)/2)] lg:top-[calc(100%-60px-(87px-60px)/2)] lg:rounded-lg">
        <svg
          className="fill-white size-8"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M19 4h-2V2h-2v2H9V2H7v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2M5 20V8h14V6v14z"></path>
        </svg>
      </span>
      <span className="absolute top-16 left-19 text-left pointer-events-none text-lg lg:left-[calc(60px+(87px-60px)/2+.5rem+2px)] lg:tracking-tighter lg:uppercase lg:text-sm lg:text-gray-400 lg:top-17.5">
        First work day
      </span>
    </label>
  );
}

export { FirstBusinessDaySelector };
