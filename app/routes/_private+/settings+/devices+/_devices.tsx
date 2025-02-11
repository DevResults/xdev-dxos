import { Outlet } from "react-router";
import { Devices } from "./ui/Devices";

export default function DevicesPage() {
  const device = {};
  const devices: any[] = [];
  return (
    <>
      <Devices
        ownDevice={device}
        devices={devices ?? []}
      />
      {/* Outlet for dialogs */}
      <Outlet />
    </>
  );
}
