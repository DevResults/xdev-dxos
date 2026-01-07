const OFF = 0
const WARN = 1
const ERROR = 2
const NEVER = "never"
const ALWAYS = "always"

export default [
  // Global ignores (must be standalone config item)
  {
    ignores: ["**/*.cjs", "**/*.js"],
  },
  // Main config
  {
    // Use spaces (2 spaces) instead of tabs
    space: true,

    // Use existing prettier config
    prettier: true,

    rules: {
      // DISABLED RULES

      "@typescript-eslint/consistent-type-assertions": OFF, // Sometimes you need to use `as T`
      "@typescript-eslint/no-dynamic-delete": OFF, // Need to be able to do e.g. `delete s.dones[id]`
      "@typescript-eslint/no-empty-function": OFF, // Don't see the problem
      "@typescript-eslint/no-redeclare": OFF, // Already checked by tsc
      "@typescript-eslint/no-this-alias": OFF, // With generator functions in class methods, `const _this=this` is the cleanest approach
      "ban-types": OFF, // Deprecated
      "capitalized-comments": OFF, // Case in point this comment
      "default-case": OFF, // Conflicts with the superior @typescript-eslint/switch-exhaustiveness-check"
      "import-x/no-cycle": OFF, // This artificially prevents us from modularizing some code, e.g. `TimeEntry` and `parseTimeEntry` would have to be in the same file
      "n/file-extension-in-import": OFF, // Duplicate of import/extensions
      "n/prefer-global/process": OFF, // Not helpful for browser code
      "new-cap": OFF, // @effect/schema has things like `S.Class` and `Context.Tag` that aren't constructors
      "require-yield": OFF, // Effect.gen generator functions won't always yield
      "unicorn/filename-case": OFF, // There are different rules for routes, maybe at some point we should enforce them but not now
      "unicorn/no-abusive-eslint-disable": OFF, // When we say ignore, we mean it
      "unicorn/no-array-callback-reference": OFF, // Too many false positives (e.g. repo.find(id))
      "unicorn/no-array-reduce": OFF, // Sometimes I like to reduce
      "unicorn/no-this-assignment": OFF, // With generator functions in class methods, `const _this=this` is the cleanest approach
      "unicorn/prevent-abbreviations": OFF, // Gets mad about "numLikes" etc.
      "unicorn/throw-new-error": OFF, // False positive for `extends Data.TaggedError(...)` pattern

      // MODIFIED RULES

      // default makes us wrap every arrow function shorthand expression with braces,
      // which spreads a single line out to 3 lines
      "@typescript-eslint/no-confusing-void-expression": [WARN, { ignoreArrowShorthand: true }],

      // Default is camelCase only. We want PascalCase for React components, and UPPER_CASE for constants.
      "@typescript-eslint/naming-convention": [
        ERROR,
        {
          selector: "variable",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
        },
      ],

      // Default is to always require extensions in imports. We don't want them for .js imports,
      // but we do for everything else
      "import-x/extensions": [ERROR, NEVER, { json: ALWAYS, css: ALWAYS, csv: ALWAYS }],

      // Use only-throw-error instead of no-throw-literal https://typescript-eslint.io/rules/no-throw-literal/
      "no-throw-literal": OFF,
      "@typescript-eslint/no-throw-literal": OFF,
      "@typescript-eslint/only-throw-error": ERROR,
    },
  },
]
