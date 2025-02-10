import { runShell } from "@dxos/shell";
import "@dxos/shell/style.css";
import { configProvider } from "./config";

const main = async () => {
  const config = await configProvider();
  await runShell(config);
};

void main();
