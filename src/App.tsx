import { DashboardLayout } from "./ui/layouts/DashboardLayout";
import { SettingsLayout } from "./ui/layouts/SettingsLayout";
import { PaySettingsView } from "./ui/views/PaySettingsView";
import { TimesheetView } from "./ui/views/TimesheetView";
import { useLocalStorage } from "./ui/hooks/useLocalStorage";
import type { AppData, ReadyAppData } from "./models/models";
import { updateAppData } from "./logic/appDataOperations";
import {
  canPromoteToReady,
  handleAppDataUpdateTransition,
} from "./domain/domain";

const initialAppData: AppData = {
  status: "setup",
  data: {
    firstBusinessDay: null,
    hourlyRate: null,
    payPeriod: null,
    timesheet: {},
    uiState: { status: "idle" },
  },
};

function App() {
  // STATE -> REACT STUFF
  // HOOKS -> REACT STUFF
  // DERIVED STATE
  // HANDLERS
  // RENDER HELPERS

  const [appData, setAppData] = useLocalStorage<AppData>({
    locStorageItemName: "gross-payroll-app-data",
    initialValue: initialAppData,
  });

  // TODO: Logic to decide if user is ready to see Timesheet or need to fill pay settings, Does this goes in logic?

  const step = appData.status === "setup" ? 0 : 1;

  // HANDLERS
  const handleChangeGeneralHourlyRate = (
    newHourlyRate: ReadyAppData["data"]["hourlyRate"],
  ) => {
    setAppData((current) => {
      let newAppData = handleAppDataUpdateTransition(current, {
        hourlyRate: newHourlyRate,
      });
      newAppData = canPromoteToReady(newAppData);
      return newAppData;
    });
  };

  return (
    <>
      {step === 0 ? (
        <SettingsLayout>
          <PaySettingsView
            appData={appData}
            onChangeHourlyRate={handleChangeGeneralHourlyRate}
          />
        </SettingsLayout>
      ) : (
        <DashboardLayout>
          <TimesheetView />
        </DashboardLayout>
      )}
    </>
  );
}

export default App;
