import { makeClient, type Client } from "../schema/Client"
import { parseClientCodes } from "./clientCodes"

const codes = parseClientCodes()

/** Plain client data for use in tests */
export const clients = codes.map(code => ({
  id: code,
  code,
  timestamp: new Date().toISOString(),
})) as Client[]

/** Create DXOS client objects lazily to avoid issues during SSR/prerender */
export const createClients = () => {
  const sNow = new Date().toISOString()
  return codes.map(code => makeClient({ code, timestamp: sNow }))
}
