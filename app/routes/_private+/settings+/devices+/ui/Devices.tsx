import { Link } from "react-router";
import { Button } from "~/ui/shadcn/button";
import { cx } from "~/lib/cx";
import { getBrowserIcon, getDeviceIcon, getOsIcon } from "~/lib/getDeviceIcon";
import type UAParser from "ua-parser-js";
import { MetadataList } from "./MetadataList";

export const Devices = ({ ownDevice, devices = [] }: Props) => {
  return (
    <div className="w-full max-w-xl ">
      <div className="flex flex-row items-center">
        <h2 className="flex-1">Devices</h2>
        <Button
          asChild
          intent="primary"
        >
          <Link to="/settings/devices/invite">Link another device</Link>
        </Button>
      </div>
      <div
        className="Devices my-3 grid gap-x-4 border-t text-sm "
        style={{
          gridTemplateColumns: "1fr min-content",
        }}
      >
        {devices?.sort(selfFirst(ownDevice)).map((device) => {
          const { deviceName, deviceId, created } = device;
          const deviceInfo = device.deviceInfo as UAParser.IResult; // should Device be generic over deviceInfo?
          return (
            <div
              key={device.deviceId}
              className="DeviceInfo col-span-2 grid grid-cols-subgrid items-center border-b p-2"
            >
              <div className="flex flex-1 flex-row items-center gap-2">
                <div className={cx("text-3xl", deviceId === ownDevice.deviceId ? "text-primary-500" : "text-gray-400")}>
                  {getDeviceIcon(deviceInfo)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{deviceName}</div>
                  <MetadataList>
                    <div>{toDate(created)}</div>
                    <div className="flex gap-1">
                      {getOsIcon(deviceInfo)}
                      {deviceInfo.device.vendor} {deviceInfo.device.model ?? deviceInfo.os.name}
                    </div>
                    <div className="flex gap-1">
                      {getBrowserIcon(deviceInfo)}
                      {deviceInfo.browser.name} {deviceInfo.browser.version?.split(".")[0] ?? ""}
                    </div>
                  </MetadataList>
                </div>
              </div>
              <div>
                {ownDevice.deviceId === deviceId ? null : (
                  <Link
                    to="/team/remove"
                    state={{ deviceId }}
                    title="Remove device from team"
                    className="opacity-10 hover:text-danger-500 hover:opacity-100"
                    children={<IconTrash className="size-4" />}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

type Props = {
  ownDevice: any;
  devices?: any[];
};

const toDate = (timestamp?: number) =>
  timestamp
    ? new Date(timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

const selfFirst = (self: any) => (a: any, b: any) => a === self ? -1 : a.deviceName.localeCompare(b.deviceName);
