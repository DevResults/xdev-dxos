import { runShell } from "@dxos/shell"
import "@dxos/shell/style.css"
import { configProvider } from "./config"

const main = async () => {
  const config = await configProvider()
  await runShell(config) // eslint-disable-line @typescript-eslint/no-unsafe-call
}

void main()
