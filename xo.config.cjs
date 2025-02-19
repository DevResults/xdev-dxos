const OFF = 0
const WARN = 1
const ERROR = 2
const NEVER = "never"
const ALWAYS = "always"

module.exports = {
  extends: ["plugin:storybook/recommended"],
  plugins: ["unused-imports"],

  // use existing prettier config
  prettier: true,

  // not bothering with config files & scripts for now
  ignore: ["*.cjs", "*.js"],

  rules: {
    // ADDED RULES

    "unused-imports/no-unused-imports": ERROR,
    "unused-imports/no-unused-vars": [
      ERROR,
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],

    // DISABLED RULES

    "@typescript-eslint/consistent-type-assertions": OFF, // sometimes you need to use `as T`
    "@typescript-eslint/no-dynamic-delete": OFF, // need to be able to do e.g. `delete s.dones[id]`
    "@typescript-eslint/no-empty-function": OFF, // don't see the problem
    "@typescript-eslint/no-redeclare": OFF, // already checked by tsc
    "@typescript-eslint/no-this-alias": OFF, // with generator functions in class methods, `const _this=this` is the cleanest approach
    "ban-types": OFF, // deprecated
    "capitalized-comments": OFF, // case in point this comment
    "default-case": OFF, // conflicts with the superior @typescript-eslint/switch-exhaustiveness-check"
    "import/no-cycle": OFF, // this artificially prevents us from modularizing some code, e.g. `TimeEntry` and `parseTimeEntry` would have to be in the same file
    "n/file-extension-in-import": OFF, // duplicate of import/extensions
    "n/prefer-global/process": OFF, // not helpful for browser code
    "new-cap": OFF, // @effect/schema has things like `S.Class` and `Context.Tag` that aren't constructors
    "require-yield": OFF, // Effect.gen generator functions won't always yield
    "unicorn/filename-case": OFF, // there are different rules for routes, maybe at some point we should enforce them but not now
    "unicorn/no-abusive-eslint-disable": OFF, // when we say ignore, we mean it
    "unicorn/no-array-callback-reference": OFF, // too many false positives (e.g. repo.find(id))
    "unicorn/no-array-reduce": OFF, // sometimes I like to reduce
    "unicorn/no-this-assignment": OFF, // with generator functions in class methods, `const _this=this` is the cleanest approach
    "unicorn/prevent-abbreviations": OFF, // gets mad about "numLikes" etc.

    // MODIFIED RULES

    // default makes us wrap every arrow function shorthand expression with braces,
    // which spreads a single line out to 3 lines
    "@typescript-eslint/no-confusing-void-expression": [WARN, { ignoreArrowShorthand: true }],

    // default is camelCase only. We want PascalCase for React components, and UPPER_CASE for constants.
    "@typescript-eslint/naming-convention": [
      ERROR,
      {
        selector: "variable",
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
        leadingUnderscore: "allow",
      },
    ],

    // default is to always require extensions in imports. We don't want them for .js imports,
    // but we do for everything else
    "import/extensions": [ERROR, NEVER, { json: ALWAYS, css: ALWAYS, csv: ALWAYS }],

    // use only-throw-error instead of no-throw-literal https://typescript-eslint.io/rules/no-throw-literal/
    "no-throw-literal": OFF,
    "@typescript-eslint/no-throw-literal": OFF,
    "@typescript-eslint/only-throw-error": ERROR,
  },

  overrides: [],
}
