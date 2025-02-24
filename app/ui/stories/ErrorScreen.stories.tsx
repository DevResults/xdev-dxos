import type { Meta, StoryObj } from "@storybook/react"
import { ErrorScreen } from "../ErrorScreen"
import { CenteredDecorator } from "./util/CenteredDecorator"

const meta = {
  title: "Components/ErrorScreen",
  component: ErrorScreen,
  decorators: [CenteredDecorator],
} satisfies Meta<typeof ErrorScreen>

export default meta
type Story = StoryObj<typeof meta>

export const RouteError: Story = {
  args: {
    // fake React Router ErrorResponse
    error: {
      status: 404,
      statusText: "Not Found",
      data: 'Error: No route matches URL "/asdfasdfasdfasdf"',
    },
  },
}

export const RuntimeError: Story = {
  args: {
    // fake TypeError
    error: {
      name: "TypeError",
      message: "Cannot read properties of undefined (reading 'pizza')",
      stack: [
        "TypeError: Cannot read properties of undefined (reading 'pizza')",
        "    at useSelectedWeek (http://localhost:3000/app/hooks/useSelectedWeek.tsx?t=1713362923237:10:21)",
        "    at MyDones (http://localhost:3000/app/routes/_private+/dones+/me.$date.tsx?t=1713362923237:17:7)",
        "    at renderWithHooks (http://localhost:3000/node_modules/.vite/deps/chunk-YETND2DR.js?v=42d3d22c:12171:26)",
        "    at updateFunctionComponent (http://localhost:3000/node_modules/.vite/deps/chunk-YETND2DR.js?v=42d3d22c:14577:28)",
        "    at beginWork (http://localhost:3000/node_modules/.vite/deps/chunk-YETND2DR.js?v=42d3d22c:15912:22)",
        "    at beginWork$1 (http://localhost:3000/node_modules/.vite/deps/chunk-YETND2DR.js?v=42d3d22c:19749:22)",
        "    at performUnitOfWork (http://localhost:3000/node_modules/.vite/deps/chunk-YETND2DR.js?v=42d3d22c:19194:20)",
        "    at workLoopSync (http://localhost:3000/node_modules/.vite/deps/chunk-YETND2DR.js?v=42d3d22c:19133:13)",
        "    at renderRootSync (http://localhost:3000/node_modules/.vite/deps/chunk-YETND2DR.js?v=42d3d22c:19112:15)",
        "    at performConcurrentWorkOnRoot (http://localhost:3000/node_modules/.vite/deps/chunk-YETND2DR.js?v=42d3d22c:18674:83)",
      ].join("\n"),
    },
    isDevelopment: true,
  },
}
