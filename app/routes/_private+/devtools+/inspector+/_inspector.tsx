import { Obj } from "@dxos/echo"
import { Filter, useQuery, useSpace } from "@dxos/react-client/echo"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@ui/tabs"
import { useMemo } from "react"
import "react-json-view-lite/dist/index.css"
import { JsonView, defaultStyles } from "react-json-view-lite"
import { Pane } from "ui/layouts/Pane"
import { useLocalState } from "~/hooks/useLocalState"

export default function InspectorPage() {
  const { spaceKey } = useLocalState()
  const space = useSpace(spaceKey)
  const allObjects = useQuery(space, Filter.everything())

  const collections = useMemo(() => groupByTypename(allObjects), [allObjects])

  const styles = {
    ...defaultStyles,
    container: "rounded-lg font-mono text-xs",
    label: "text-gray-400 mr-2 font-normal",
    punctuation: "text-gray-500",
    noQuotesForStringValues: true,
  }

  const entries = Array.from(collections.entries())
  const defaultTab = entries[0]?.[0]

  return (
    <Pane>
      <div className="flex h-full">
        <Tabs defaultValue={defaultTab} className="flex grow flex-col">
          <div>
            <TabsList>
              {entries.map(([name, items]) => (
                <TabsTrigger key={name} value={name}>
                  <span className="mr-1">{name}</span>
                  <span className="text-xs font-light text-neutral-400">({items.length})</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className="grow overflow-scroll">
            {entries.map(([name, items]) => (
              <TabsContent key={name} value={name}>
                <JsonView
                  data={items}
                  style={styles}
                  shouldExpandNode={level => level < 2}
                  clickToExpandNode={true}
                />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </Pane>
  )
}

/** Group objects by their DXOS typename, using the short name (after the last `/`). */
const groupByTypename = (objects: Obj.Any[]) => {
  const grouped = new Map<string, Obj.Any[]>()
  for (const obj of objects) {
    const fullTypename = Obj.getTypename(obj) ?? "Unknown"
    const shortName = fullTypename.split("/").pop() ?? fullTypename
    const list = grouped.get(shortName) ?? []
    list.push(obj)
    grouped.set(shortName, list)
  }
  return new Map([...grouped.entries()].toSorted(([a], [b]) => a.localeCompare(b)))
}
