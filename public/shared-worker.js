onconnect = async (event) => {
  const { onconnect } = await import("@dxos/react-client/worker");
  await onconnect(event);
};
