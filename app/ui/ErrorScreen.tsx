import { Card, CardContent, CardHeader, CardTitle } from "@ui/card"
import type { ErrorResponse } from "react-router"
import { CenteredLayout } from "./layouts/CenteredLayout"
import { Heading } from "~/ui/Heading"

const isRouteErrorResponse = (e: Error | ErrorResponse): e is ErrorResponse =>
  "status" in e && "statusText" in e && "data" in e

export function ErrorScreen({ error, isDevelopment = false }: Props) {
  const isRouteError = isRouteErrorResponse(error)

  const getMessage = (status: number) => {
    switch (status) {
      case 401:
      case 402: {
        return <>Sorry, you are not authorized to view this page.</>
      }

      case 404: {
        return (
          <>
            Sorry, couldn't find <strong>{globalThis.location.pathname}</strong>.
          </>
        )
      }

      default: {
        return <>Sorry, something went wrong on our end.</>
      }
    }
  }

  const output = isRouteError
    ? {
        status: error.status,
        statusText: error.statusText,
        message: getMessage(error.status),
      }
    : {
        status: error.name,
        statusText: error.message,
        stack: trimStack(error.stack),
      }

  return (
    <CenteredLayout>
      <Card className="w-[36em]">
        <CardHeader className="text-danger-700">
          <CardTitle>
            <div className="flex items-center gap-2 text-base font-semibold text-danger-700">
              <IconExclamationCircle className="inline-block h-6 w-6" />
              {output.status}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Heading className="mt-4">{output.statusText}</Heading>

          {output.message ? (
            <pre className="mt-6 text-sm leading-7 text-neutral-600">{output.message}</pre>
          ) : null}
          {isDevelopment && output.stack ? (
            <pre className="max-h-48 overflow-auto rounded-lg bg-neutral-50 p-2 text-[.6em]">
              {output.stack}
            </pre>
          ) : null}
        </CardContent>
      </Card>
    </CenteredLayout>
  )
}

/** Trims the first N rows from an error stack () */
const trimStack = (stack: string | undefined, rows = 1) => {
  if (!stack) {
    return ""
  }

  return (
    stack
      ?.split("\n")
      .slice(rows)
      .map(s => s.trim())
      .join("\n") ?? ""
  )
}

type Props = {
  error: Error | ErrorResponse
  isDevelopment?: boolean
}
