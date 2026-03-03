interface Props {
  children?: React.ReactNode;
}

function SettingsLayout({ children }: Props) {
  return (
    <section className="w-screen h-svh flex justify-center lg:justify-between">
      <aside className="hidden lg:flex lg:flex-col lg:w-5/12 lg:py-10 lg:px-15 lg:h-dvh lg:justify-center lg:space-y-3">
        <h1 className="font-header text-8xl font-semibold space-y-2">
          <p className="text-white">Payroll</p>
          <p className="text-blue-500">Calculator</p>
        </h1>
        <p className="block text-gray-400 font-body text-lg font-medium">
          Set basic payment data to get estimates of your gross periodic payroll
          and keep your records safe through the time.
        </p>
      </aside>
      <main className="w-9/10 lg:w-7/12 lg:px-20 lg:py-15 lg:bg-transparent">
        <section className="w-full h-full flex flex-col gap-10 lg:bg-zinc-900/60 lg:rounded-3xl lg:py-7 lg:px-9 lg:border lg:border-gray-700 lg:shadow-2xl lg:h-fit">
          {children}
        </section>
      </main>
    </section>
  );
}

export { SettingsLayout };
