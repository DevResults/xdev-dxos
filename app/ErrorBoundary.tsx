import { useRouteError } from "react-router"
import { ErrorScreen } from "./ui/ErrorScreen"

export function ErrorBoundary() {
  const error = useRouteError() as Error
  const isDevelopment = process.env.NODE_ENV === "development"

  return <ErrorScreen error={error} isDevelopment={isDevelopment} />
}
