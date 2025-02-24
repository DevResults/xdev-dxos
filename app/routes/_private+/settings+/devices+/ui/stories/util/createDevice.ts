import { parse } from "platform"
import type { PublicKey } from "@dxos/react-client"
import { Device, DeviceKind, DeviceType } from "@dxos/react-client/halo"

export const createDevice = (ua: string) => {
  // based on dxos identity-manager https://github.com/DevResults/dxos/blob/5d1ad0f/packages/sdk/client-services/src/packlets/identity/identity-manager.ts
  const platform = parse(ua)
  const type =
    platform.name && (platform.name.startsWith("iOS") || platform.name.startsWith("Android")) ?
      DeviceType.MOBILE
    : DeviceType.BROWSER

  return {
    deviceKey: "" as unknown as PublicKey,
    kind: DeviceKind.CURRENT,
    presence: Device.PresenceState.ONLINE,
    profile: {
      type,
      platform: platform.name ?? "",
      platformVersion: platform.version ?? "",
      architecture:
        typeof platform.os?.architecture === "number" ? String(platform.os.architecture) : "",
      os: platform.os?.family ?? "",
      osVersion: platform.os?.version ?? "",
    },
  }
}
