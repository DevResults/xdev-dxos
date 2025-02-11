import { Link } from "react-router";
import { Button } from "~/ui/shadcn/button";
import { cx } from "~/lib/cx";
import { getBrowserIcon, getDeviceIcon, getOsIcon } from "~/lib/getDeviceIcon";
import type UAParser from "ua-parser-js";
import { MetadataList } from "./MetadataList";
import { useShell } from "@dxos/react-client";
import type { Device } from "@dxos/react-client/halo";

export const Devices = ({ ownDevice, devices = [] }: Props) => {
  const shell = useShell();
  return (
    <div className="w-full max-w-xl ">
      <div className="flex flex-row items-center">
        <h2 className="flex-1">Devices</h2>
        <Button
          intent="primary"
          onClick={async () => {
            const { device } = await shell.shareIdentity();
          }}
        >
          Link another device
        </Button>
      </div>
      <div
        className="Devices my-3 grid gap-x-4 border-t text-sm "
        style={{
          gridTemplateColumns: "1fr min-content",
        }}
      >
        {devices?.sort(selfFirst(ownDevice)).map((device) => {
          return (
            <div
              key={device.deviceKey.toString()}
              className="DeviceInfo col-span-2 grid grid-cols-subgrid items-center border-b p-2"
            >
              <div className="flex flex-1 flex-row items-center gap-2">
                <div
                  className={cx(
                    "text-3xl",
                    device.deviceKey === ownDevice.deviceKey ? "text-primary-500" : "text-gray-400"
                  )}
                >
                  {getDeviceIcon(device)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">&#123; deviceName &#125;</div>
                  <MetadataList>
                    <div>&#123; date &#125;</div>
                    <div className="flex gap-1">
                      {getOsIcon(device)}
                      {device.profile?.os} {device.profile?.osVersion}
                    </div>
                    <div className="flex gap-1">
                      {getBrowserIcon(device)}
                      {device.profile?.platform} {device.profile?.platformVersion}
                    </div>
                  </MetadataList>
                </div>
              </div>
              <div>
                {ownDevice.deviceKey === device.deviceKey ? null : (
                  <Link
                    to="/team/remove"
                    state={{ deviceId: device.deviceKey }}
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
  ownDevice: Device;
  devices?: Device[];
};

const selfFirst = (self: Device) => (a: Device, b: Device) =>
  a === self ? -1 : a.deviceKey.toString().localeCompare(b.deviceKey.toString());
