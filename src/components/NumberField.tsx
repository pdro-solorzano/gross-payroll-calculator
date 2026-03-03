interface Props {
  labelText?: string;
  labelClasses?: string;
  inputAdornment?: string;
  adornmentClasses?: string;
  className?: string;
  inputID: string;
  adornmentPos?: "start" | "end";
  placeholder: string;
  max: string;
  min: string;
}

function NumberField({
  labelText,
  labelClasses,
  inputAdornment,
  adornmentClasses,
  adornmentPos = "start",
  className,
  inputID,
  placeholder,
  max,
  min,
}: Props) {
  return (
    <div className="flex flex-col font-body relative">
      {labelText && (
        <label
          htmlFor={inputID}
          className={`font-header text-gray-400 ${labelClasses ?? "font-semibold text-sm uppercase tracking-tight lg:text-base lg:mb-2"}`}
        >
          {labelText}
        </label>
      )}
      <input
        type="number"
        name={inputID}
        id={inputID}
        className={`font-body text-gray-400 outline-0 border out-of-range:border-red-500 focus:not-out-of-range:border-blue-500
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none lg:bg-zinc-700/35
          ${className ?? "border-2 text-5xl font-bold text-center px-4 py-8 rounded-xl lg:rounded-3xl lg:text-6xl lg:text-left lg:py-10 lg:pl-19 border-transparent bg-zinc-800/35"}`}
        placeholder={placeholder}
        max={max}
        min={min}
      />
      {inputAdornment && (
        <span
          className={`text-blue-500 absolute pointer-events-none 
            ${
              adornmentClasses ??
              `text-5xl font-medium top-14 lg:text-6xl lg:top-19 
              ${
                adornmentPos === "start"
                  ? "right-[calc(100%-3rem)] lg:right-[calc(100%-4rem)]"
                  : "left-[calc(100%-3rem)] lg:left-[calc(100%-4rem)]"
              }`
            }`}
        >
          {inputAdornment}
        </span>
      )}
    </div>
  );
}

export { NumberField };
