import { Tabs, TabsList, TabsContent, TabsTrigger } from "@ui/tabs"
import "react-json-view-lite/dist/index.css"
import { JsonView, defaultStyles } from "react-json-view-lite"
import { useDatabase } from "~/hooks/useDatabase"
import { Pane } from "ui/layouts/Pane"

export default function InspectorPage() {
  const { clients, contacts, doneEntries, projects, timeEntries } = useDatabase()

  const collections = {
    Contacts: contacts,
    Clients: clients,
    Projects: projects,
    "Time entries": timeEntries,
    "Done entries": doneEntries,
  }

  const styles = {
    ...defaultStyles,
    container: "rounded-lg font-mono text-xs",
    label: "text-gray-400 mr-2 font-normal",
    punctuation: "text-gray-500",
    noQuotesForStringValues: true,
  }

  const defaultTab = Object.keys(collections)[0]

  return (
    <Pane>
      <div className="flex h-full">
        <Tabs defaultValue={defaultTab} className="flex grow flex-col">
          <div>
            <TabsList>
              {Object.entries(collections).map(([name, items]) => (
                <TabsTrigger key={name} value={name}>
                  <span className="mr-1">{name}</span>
                  <span className="text-xs font-light text-neutral-400">({items.length})</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className="grow overflow-scroll">
            {Object.entries(collections).map(([name, items]) => (
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
