import type { ReactNode } from "react"
import type UAParser from "ua-parser-js"

export const getDeviceIcon = (deviceInfo: UAParser.IResult) =>
  deviceInfo.device.type === "mobile" ? <IconDeviceMobile /> : <IconDeviceDesktop />

const getMatchingIcon =
  (
    accessor: (deviceInfo: UAParser.IResult) => string | undefined,
    lookup: Record<string, ReactNode>,
    fallback: ReactNode,
  ) =>
  (deviceInfo: UAParser.IResult) => {
    const text = accessor(deviceInfo) ?? ""
    const key = Object.keys(lookup).find(val => text.toLocaleLowerCase().includes(val))
    return key ? lookup[key] : fallback
  }

export const getBrowserIcon = getMatchingIcon(
  i => i.browser.name,
  {
    chrome: <IconBrandChrome />,
    edge: <IconBrandEdge />,
    firefox: <IconBrandFirefox />,
    opera: <IconBrandOpera />,
    safari: <IconBrandSafari />,
    android: <IconBrandAndroid />,
  },
  <IconBrowser />,
)

export const getOsIcon = getMatchingIcon(
  i => i.os.name,
  {
    windows: <IconBrandWindows />,
    mac: <IconBrandFinder />,
    ios: <IconBrandApple />,
    android: <IconBrandAndroid />,
    linux: <IconBrandQq />,
    ubuntu: <IconBrandQq />,
    chromium: <IconBrandChrome />,
  },
  null,
)
