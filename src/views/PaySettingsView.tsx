import { FirstBusinessDaySelector } from "../components/FirstBusinessDaySelector.tsx";
import { NumberField } from "../components/NumberField.tsx";
import { PayPeriodSelector } from "../components/PayPeriodSelector.tsx";
import { Button } from "../components/Button.tsx";

function PaySettingsView() {
  return (
    <>
      <div className="space-y-3.5 lg:space-y-5">
        <h3 className="text-white font-header font-medium text-4xl mt-5 lg:text-5xl lg:mt-8">
          Pay period settings
        </h3>
        <p className="text-gray-400 font-body font-light lg:text-lg">
          Provide basic payment info to calculate your payroll
        </p>
      </div>
      <NumberField
        labelText="Hourly Rate"
        inputAdornment="$"
        inputID="nf-hourly-rate-settings"
        placeholder="0.00"
        min="0.01"
        max="99999.99"
      />
      <PayPeriodSelector labelText="Pay period" />
      <FirstBusinessDaySelector labelText="Period start" />
      <section className="h-full flex flex-col justify-end mb-5 lg:mb-0">
        <Button text="Next" />
      </section>
    </>
  );
}

export { PaySettingsView };
