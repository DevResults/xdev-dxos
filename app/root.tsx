import "@ibm/plex/css/ibm-plex.css"
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"
import { ClientProvider } from "@dxos/react-client"
import { configProvider } from "./config"
import "./index.css"
import { DoneEntry } from "./schema/DoneEntry"
import { TimeEntry } from "./schema/TimeEntry"
import { Contact } from "./schema/Contact"
import { Loading } from "./ui/Loading"
import { Client } from "./schema/Client"
import { Project } from "./schema/Project"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/local-maskable-192x192.png" />
        <link rel="mask-icon" href="/favicon.ico" color="#000000" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

const createWorker = () =>
  new SharedWorker(new URL("../public/shared-worker", import.meta.url), {
    type: "module",
    name: "dxos-client-worker",
  })

const config = await configProvider()
;(globalThis as any).dxosConfig = config.values

export default function App() {
  return (
    <ClientProvider
      shell="./shell.html"
      config={config}
      createWorker={createWorker}
      types={[Contact, DoneEntry, TimeEntry, Client, Project]}
    >
      <Outlet />
    </ClientProvider>
  )
}

export function HydrateFallback() {
  return <Loading />
}

export { ErrorBoundary } from "./ErrorBoundary"
