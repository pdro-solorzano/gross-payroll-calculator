import type React from "react";

interface Props {
  icon: React.ReactNode;
  label: string;
  amount: number;
  className?: string;
  total?: boolean;
}

function SummaryCard({ icon, label, amount, className, total }: Props) {
  const formattedAmountText = "$2,850.00";
  const formattedHoursText = "40 Hrs";

  // bg-blue-500/30 text-blue-500

  return (
    <div className={`${className} ${total ? "bg-blue-500/25" : ""}`}>
      {icon}
      <span
        className={`font-header text-xs uppercase tracking-tight inline-block font-medium ${total ? "text-blue-500" : "text-gray-400"} lg:text-sm`}
      >
        {label}
      </span>
      <p
        className={`font-semibold mt-2 text-2xl ${total ? "text-blue-500" : "text-white"} lg:text-3xl`}
      >
        {formattedAmountText}
      </p>
      <p
        className={`mt-1 text-xs  tracking-tighter font-light ${total ? "text-blue-500" : "text-gray-400"} lg:text-sm`}
      >
        {formattedHoursText}
      </p>
    </div>
  );
}

export { SummaryCard };
