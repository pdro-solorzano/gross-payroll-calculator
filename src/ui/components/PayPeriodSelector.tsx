import { useState } from "react";

interface Props {
  labelText: string;
}

function PayPeriodSelector({ labelText }: Props) {
  const [payPeriod, setPayPeriod] = useState<string>("weekly");

  return (
    <fieldset className="flex flex-col font-body space-y-2 lg:space-y-3.5">
      <legend className="text-2xl font-medium font-header text-white lg:text-3xl">
        {labelText}
      </legend>
      <div className="bg-zinc-800 flex justify-between p-1 rounded-xl text-gray-400 text-sm font-bold text-center lg:bg-zinc-700/35 lg:p-1.3 lg:rounded-2xl">
        <label
          htmlFor="cb-weekly"
          className="py-3 w-1/2 rounded-lg has-checked:bg-zinc-900 has-checked:text-blue-500 transition-colors cursor-pointer lg:py-4.5 lg:rounded-xl lg:text-lg"
        >
          <span>Weekly</span>
          <input
            type="radio"
            id="cb-weekly"
            name="pay-period"
            value="Weekly"
            className="hidden"
          />
        </label>

        <label
          htmlFor="cb-fortnight"
          className="py-3 w-1/2 rounded-lg has-checked:bg-zinc-900 has-checked:text-blue-500 transition-colors cursor-pointer lg:py-4.5 lg:rounded-xl lg:text-lg"
        >
          <span>Fortnight</span>
          <input
            type="radio"
            id="cb-fortnight"
            name="pay-period"
            value="Fortnight"
            className="hidden"
          />
        </label>
      </div>
    </fieldset>
  );
}

export { PayPeriodSelector };
