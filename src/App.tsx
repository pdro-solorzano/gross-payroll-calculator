import { DashboardLayout } from "./layouts/DashboardLayout";
import { SettingsLayout } from "./layouts/SettingsLayout";
import { PaySettingsView } from "./views/PaySettingsView";
import { TimesheetView } from "./views/TimesheetView";

function App() {
  return (
    <>
      <DashboardLayout>
        <TimesheetView />
      </DashboardLayout>

      <br />
      <br />

      <SettingsLayout>
        <PaySettingsView />
      </SettingsLayout>
    </>
  );
}

export default App;
