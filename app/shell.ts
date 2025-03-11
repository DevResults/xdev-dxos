import { runShell } from "@dxos/shell/react"
import "@dxos/shell/style.css"
import { configProvider } from "./config"

const main = async () => {
  const config = await configProvider()
  await runShell(config)
}

void main()
