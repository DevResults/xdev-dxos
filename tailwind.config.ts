import type { Config } from "tailwindcss"
import tailwindAnimate from "tailwindcss-animate"
import tailwindLogical from "tailwindcss-logical"
import tailwindColors from "tailwindcss/colors"

const emoji = "Segoe UI Emoji"
const mono = "IBM Plex Mono"
const sans = "IBM Plex Sans"
const serif = "IBM Plex Serif"

const { white, black, blue, zinc, green, orange, red } = tailwindColors

const config = {
  plugins: [tailwindAnimate, tailwindLogical],
  content: ["./app/**/*.{html,tsx,ts}"],
  theme: {
    extend: {
      fontFamily: {
        mono: [mono, emoji, "monospace"],
        sans: [sans, emoji, "sans-serif"],
        serif: [serif, emoji, "serif"],
      },
      colors: withDefaults({
        primary: blue,
        neutral: zinc,
        success: green,
        warning: orange,
        danger: red,
        background: white,
        "primary-foreground": white,
        ring: blue,
        text: black,
      }),
      fontSize: {
        "2xs": "0.6875rem", // 11px
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        text: "450",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      rotate: {
        "-30": "-30deg",
        "-15": "-15deg",
        15: "15deg",
        30: "30deg",
      },

      keyframes: {
        shake: {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-3px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(3px, 0, 0)" },
        },

        celebrate: {
          "0%,100%": {
            outline: "1px dotted transparent",
            borderRadius: "100%",
            outlineOpacity: "0",
          },
          "25%": {
            outline: ".3em dotted currentColor",
            transform: "scale(.8) rotate(-30deg)",
            outlineOffset: ".3em",
            outlineOpacity: "1",
          },
          "50%": {},
          "75%": {
            outlineOffset: ".6em",
            transform: "scale(1.5) rotate(0deg)",
          },
          "100%": {
            transform: "rotate(0deg)",
            outlineOffset: ".3em",
            outlineOpacity: "0",
          },
        },
      },

      animation: {
        shake: "500ms shake",
        shortshake: "100ms shake",

        /** Use for icons in a button confirming an action, e.g. checkmark on a `Copy` button */
        celebrate: "200ms celebrate linear",
      },
    },
  },
}

export default config satisfies Config

function withDefaults(colors: ColorDefinition) {
  return Object.fromEntries(
    Object.entries(colors).map(([key, value]) => [
      key,
      typeof value === "string" || !(500 in value) ? value : { ...value, DEFAULT: value[500] },
    ]),
  )
}

type ColorDefinition = {
  [key: string | number]: string | ColorDefinition
}
