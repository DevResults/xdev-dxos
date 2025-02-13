import { Tabs, TabsList, TabsContent, TabsTrigger } from "~/ui/shadcn/tabs"
import { JsonView, defaultStyles } from "react-json-view-lite"
import "react-json-view-lite/dist/index.css"
import { useSpaces } from "@dxos/react-client/echo"

export default function InspectorPage() {
  const rootDoc = useSpaces()
  if (!rootDoc) return null

  const styles = {
    ...defaultStyles,
    container: "rounded-lg font-mono text-xs",
    label: "text-gray-400 mr-2 font-normal",
    punctuation: "text-gray-500",
    noQuotesForStringValues: true,
  }

  const tabItems = Object.keys(rootDoc) as Array<keyof typeof rootDoc>

  return (
    <div className="flex h-full">
      <Tabs defaultValue={tabItems[0]} className="flex grow flex-col">
        <div>
          <TabsList className="">
            {tabItems.map(tabItem => {
              const count = Object.keys(rootDoc[tabItem]).length
              return (
                <TabsTrigger key={tabItem} value={tabItem}>
                  <span className="mr-1">{tabItem}</span>
                  <span className="text-xs font-light text-neutral-400">({count})</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>
        <div className="grow overflow-scroll">
          {tabItems.map(tabItem => (
            <TabsContent key={tabItem} value={tabItem}>
              <JsonView
                data={rootDoc[tabItem]}
                style={styles}
                shouldExpandNode={level => level < 2}
                clickToExpandNode={true}
              />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  )
}
