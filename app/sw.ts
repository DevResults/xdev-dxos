/* eslint-disable @typescript-eslint/no-floating-promises */

import { clientsClaim } from "workbox-core"
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching"
import { NavigationRoute, registerRoute } from "workbox-routing"

declare let self: ServiceWorkerGlobalScope

// Self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// Clean old assets
cleanupOutdatedCaches()

// To allow work offline
registerRoute(new NavigationRoute(createHandlerBoundToURL("index.html")))

self.skipWaiting()
clientsClaim()
