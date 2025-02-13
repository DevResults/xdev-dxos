import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"

import { ClientProvider } from "@dxos/react-client"
import { configProvider } from "./config"

import type { Route } from "./+types/root"
import "./app.css"
import { DoneEntry } from "./schema/DoneEntry"
import { TimeEntry } from "./schema/TimeEntry"
import { Contact } from "./schema/Contact"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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

export default function App() {
  return (
    <ClientProvider
      shell="./shell.html"
      config={configProvider}
      createWorker={createWorker}
      types={[Contact, DoneEntry, TimeEntry]}
    >
      <Outlet />
    </ClientProvider>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!"
  let details = "An unexpected error occurred."
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error"
    details =
      error.status === 404 ? "The requested page could not be found." : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
