import fs from "fs"
import path from "path"
import type { StorybookConfig } from "@storybook/react-vite"

const stories = getUiDirs().flatMap(dir => [{ directory: `${dir}/stories` }])

export default {
  stories,
  addons: [
    "@storybook/addon-links",
    { name: "@storybook/addon-essentials", options: { actions: false } },
    "@storybook/addon-interactions",
    "storybook-addon-remix-react-router",
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  docs: {},
} satisfies StorybookConfig

function fullPath(dir: fs.Dirent) {
  return path.join(dir.path, dir.name)
}

// recurse through all folders  and return relative paths to all directories named "ui"
function getUiDirs(dir: string = path.join(__dirname, "../app")): string[] {
  const dirs = fs.readdirSync(dir, { withFileTypes: true }).filter(dirent => dirent.isDirectory())
  const uiDirs = dirs
    .filter(dir => dir.name === "ui")
    .map(dir => path.relative(__dirname, fullPath(dir)))
  const otherDirs = dirs.filter(dir => dir.name !== "ui")
  return uiDirs.concat(otherDirs.flatMap(subDir => getUiDirs(fullPath(subDir)).sort()))
}
