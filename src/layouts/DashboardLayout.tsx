import { SummaryCard } from "../components/SummaryCard";
import { OvertimeIcon, RegularIcon, TotalPayIcon } from "../components/Icons";
import { NumberField } from "../components/NumberField";

interface Props {
  children?: React.ReactNode;
  startDate: Date;
  endDate: Date;
}

function DashboardLayout({ children, startDate, endDate }: Props) {
  const current = true;
  const formattedPeriodText = "1 Oct 2026 - 7 Oct 2026";

  return (
    <article className="w-full mx-auto lg:w-9/10 lg:my-10">
      <div className="w-full flex flex-col mt-3.5 font-body gap-5 lg:bg-zinc-900/60 lg:mt-0 lg:gap-8 lg:px-10 lg:py-13 lg:pt-5 lg:rounded-3xl lg:border lg:border-gray-700 lg:shadow-2xl">
        <header className="w-full flex flex-nowrap justify-between font-header border-zinc-700 border-b-1 px-3 lg:justify-evenly">
          <button className="p-2 text-center active:bg-gray-700 cursor-pointer rounded-xl">
            <svg
              className="size-10 fill-gray-400 lg:size-12"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M14.29 6.29 8.59 12l5.7 5.71 1.42-1.42-4.3-4.29 4.3-4.29z"></path>
            </svg>
          </button>
          <div className="w-full text-center font-semibold space-y-0.5 lg:w-fit">
            <p className="text-white text-xl lg:text-2xl">
              {formattedPeriodText}
            </p>
            {current && (
              <p className="text-blue-500 uppercase text-xs tracking-tighter lg:text-sm">
                Current period
              </p>
            )}
          </div>
          <button className="p-2 text-center active:bg-gray-700 cursor-pointer rounded-xl">
            <svg
              className="size-10 fill-gray-400 lg:size-12"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="m9.71 17.71 5.7-5.71-5.7-5.71-1.42 1.42 4.3 4.29-4.3 4.29z"></path>
            </svg>
          </button>
        </header>
        <section className="w-full flex flex-wrap justify-between px-3 gap-3 last:bg-blue-600 *:px-3 *:py-6 *:rounded-xl *:space-x-2 lg:gap-4">
          <SummaryCard
            className="flex-1 bg-zinc-800"
            label="Regular"
            amount={850}
            icon={
              <RegularIcon className="size-5 fill-gray-400 inline-block lg:size-6" />
            }
          />
          <SummaryCard
            className="flex-1 bg-zinc-800"
            label="Overtime"
            amount={850}
            icon={
              <OvertimeIcon className="size-5 fill-gray-400 inline-block lg:size-6" />
            }
          />
          <SummaryCard
            className="flex-2 min-w-full lg:flex-1 lg:min-w-0"
            label="Estimated Gross Payment"
            amount={850}
            total
            icon={
              <TotalPayIcon className="size-5 fill-blue-500 inline-block lg:size-6" />
            }
          />
        </section>
        <section className="w-full px-3">
          <NumberField
            labelClasses="font-medium text-xs uppercase tracking-tight lg:text-sm"
            className="bg-zinc-800/35 border-transparent py-2 pl-8 text-2xl font-semibold rounded-xl lg:text-3xl lg:py-4 lg:pl-11"
            adornmentClasses="text-2xl bottom-2.5 left-3 lg:text-3xl lg:top-8"
            inputID="nf-hourly-rate-dashboard"
            labelText="Period's hourly rate"
            inputAdornment="$"
            placeholder="0.00"
            min="0.01"
            max="99999.99"
          />
        </section>
        <main className="w-full px-3 space-y-2">{children}</main>
      </div>
    </article>
  );
}

export { DashboardLayout };
