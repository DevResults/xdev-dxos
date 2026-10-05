onconnect = async (event: MessageEvent) => {
  const { onconnect } = await import("@dxos/react-client/worker")
  await onconnect(event)
}
