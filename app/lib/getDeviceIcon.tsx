import type { ReactNode } from "react";
import { DeviceType, type Device } from "@dxos/react-client/halo";

export const getDeviceIcon = (deviceInfo: Device) =>
  deviceInfo.profile?.type === DeviceType.MOBILE ? <IconDeviceMobile /> : <IconDeviceDesktop />;

const getMatchingIcon =
  (accessor: (deviceInfo: Device) => string | undefined, lookup: Record<string, ReactNode>, fallback: ReactNode) =>
  (deviceInfo: Device) => {
    const text = accessor(deviceInfo) ?? "";
    const key = Object.keys(lookup).find((val) => text.toLocaleLowerCase().includes(val));
    return key ? lookup[key] : fallback;
  };

export const getBrowserIcon = getMatchingIcon(
  (i) => i.profile?.platform,
  {
    chrome: <IconBrandChrome />,
    edge: <IconBrandEdge />,
    firefox: <IconBrandFirefox />,
    opera: <IconBrandOpera />,
    safari: <IconBrandSafari />,
    android: <IconBrandAndroid />,
  },
  <IconBrowser />
);

export const getOsIcon = getMatchingIcon(
  (i) => i.profile?.os,
  {
    windows: <IconBrandWindows />,
    mac: <IconBrandFinder />,
    ios: <IconBrandApple />,
    android: <IconBrandAndroid />,
    linux: <IconBrandQq />,
    ubuntu: <IconBrandQq />,
    chromium: <IconBrandChrome />,
  },
  null
);
