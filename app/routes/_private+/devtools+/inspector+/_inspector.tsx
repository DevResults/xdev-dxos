import { Tabs, TabsList, TabsContent, TabsTrigger } from "@ui/tabs"
import { JsonView, defaultStyles } from "react-json-view-lite"
import "react-json-view-lite/dist/index.css"
import { useSpaces } from "@dxos/react-client/echo"

export default function InspectorPage() {
  const spaces = useSpaces()
  if (!spaces) return null

  const styles = {
    ...defaultStyles,
    container: "rounded-lg font-mono text-xs",
    label: "text-gray-400 mr-2 font-normal",
    punctuation: "text-gray-500",
    noQuotesForStringValues: true,
  }

  return (
    <div className="flex h-full">
      <Tabs defaultValue={spaces[0].id} className="flex grow flex-col">
        <div>
          <TabsList className="">
            {spaces.map(space => {
              return (
                <TabsTrigger key={space.id} value={space.id}>
                  <span className="mr-1">{space.id}</span>
                  {/* <span className="text-xs font-light text-neutral-400">({count})</span> */}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>
        <div className="grow overflow-scroll">
          {spaces.map(space => (
            <TabsContent key={space.id} value={space.id}>
              <JsonView
                data={space}
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
