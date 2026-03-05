declare let onconnect: ((event: MessageEvent) => void) | null

onconnect = async (event: MessageEvent) => {
  const { onconnect: dxosOnConnect } = await import("@dxos/react-client/worker")
  await dxosOnConnect(event)
}
