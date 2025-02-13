import { CenteredLayout } from "./layouts/CenteredLayout"

export const ComingSoon = ({ children }: { children: React.ReactNode }) => (
  <CenteredLayout>
    <p className="flex flex-col items-center">
      <span className="text-6xl text-gray-400">{children}</span>
      <span className="text-sm">Coming soon!</span>
    </p>
  </CenteredLayout>
)
