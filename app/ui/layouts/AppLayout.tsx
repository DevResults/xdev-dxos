import { Drawer, DrawerContent } from "@ui/drawer"
import { cx } from "~/lib/cx"
import { useState } from "react"
import { Sidebar } from "../Sidebar"
import type { Contact } from "~/schema/Contact"

export function AppLayout({ self, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {/* show sidebar button (smaller screens) */}
      <div
        className={cx(
          "absolute top-0 z-40 flex w-12 items-center border-r pl-4 lg:hidden",
          "h-12", // matches height of nav in PageLayout
        )}
      >
        <button
          className="text-neutral-700"
          title="Open sidebar"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <IconMenu2 className="size-5" aria-hidden="true" />
        </button>
      </div>

      {/* slideout sidebar (smaller screens) */}
      <Drawer open={sidebarOpen} direction="left" onOpenChange={open => setSidebarOpen(open)}>
        <div className="lg:hidden">
          {/* sidebar container */}
          <DrawerContent
            className="fixed bottom-0 left-0 flex h-full w-[12em] rounded-none"
            handle={null}
          >
            {/* close sidebar button */}
            <div className="absolute left-full top-0 flex w-12 justify-center pt-2">
              <button className="p-1" onClick={() => setSidebarOpen(false)}>
                <span className="sr-only">Close sidebar</span>
                <IconX className="size-5 text-white" aria-hidden="true" />
              </button>
            </div>

            {/* sidebar */}
            <div className="flex h-full grow flex-col gap-y-5 overflow-y-auto bg-white">
              <Sidebar self={self} close={() => setSidebarOpen(false)} />
            </div>
          </DrawerContent>
        </div>
      </Drawer>

      {/* fixed sidebar (larger screens) */}
      <div className="fixed inset-y-0 z-10 hidden w-[12em] flex-col lg:flex">
        <Sidebar self={self} />
      </div>

      {/* page */}
      <main className={`flex h-screen w-full flex-col bg-white lg:pl-[12em]`}>{children}</main>
    </>
  )
}

type Props = {
  self: Contact
  children: React.ReactNode
}
