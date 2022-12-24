// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require("tailwindcss/plugin")
const storybookContentFiles = process.env.STORYBOOK_RUNNING ? [ "./**/stories.js" ] : []

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/stories.js",
    "./components/**/*.{vue,js,ts,tsx,css}",
    "./layouts/*.vue",
    "./pages/*.vue",
    "./pages/**/*.vue",
    "./App.vue",
    ...storybookContentFiles,
  ],
  theme: {
    fontFamily: {},

    fontSize: {
      "size-30": "30px",
      "size-26": "26px",
      "size-20": "20px",
      "size-18": "18px",
      "size-16": "16px",
      "size-15": "15px",
      "size-14": "14px",
      "size-12": "12px",
      "size-11": "11px",
      "size-9": "9px",
    },
    lineHeight: {
      36: "36px",
      32: "32px",
      30: "30px",
      28: "28px",
      26: "26px",
      24: "24px",
      20: "20px",
      16: "16px",
      12: "12px",
    },
    fontWeight: {
      700: 700,
      600: 600,
      500: 500,
      400: 400,
    },

    colors: {
      transparent: "transparent",
      white: "#FFFFFF",
      black: "#000000",
      red: "#CB1D1D",
      green: "#1DCB43",

      // Buttons
      "btn-pink": "#981E97",
      "btn-purple": "#BA2DA6",
      "btn-light-grey": "#F3F2F3",
      "btn-white": "#FFFFFF14",
      "btn-red": "#CB1D1D",
      "btn-light-pink": "#FDF6FC",

      // Icons
      "icon-grey": "#99A2AD",
      "icon-black": "#424242",
      "icon-middle-grey": "#6D7885",
      "icon-pink": "#CB1DAB",
      "icon-white": "#FFFFFF",
      "icon-red": "#CB1D1D",
      "icon-toxic-green": "#05FF00",
      "icon-light-red": "#FBEDED",
      "icon-green": "#1DCB43",
      "icon-orange": "#FF5C00",
      "icon-yellow": "#F6FF0C",
    },

    extend: {
      textColor: {
        black: "#424242",
        grey: "#99A2AD",
        white: "#FFFFFF",
        pink: "#CB1DAB",
        red: "#CB1D1D",
        "light-grey": "#99A2AD",
        green: "#1DCB43",
        orange: "#FF5C00",

        "btn-orange": "#FF5C00",
      },

      boxShadow: {
        up: "0 -4px 10px 0 rgb(0 0 0 / 0.05)",
        down: "0 4px 10px 0 rgb(0 0 0 / 0.05)",
        bg: "0 2px 15px 5px rgb(0 0 0 / 8%)",
      },

      backgroundImage: {
        // Main
        "gradient-purple": "linear-gradient(180deg, #D960F7 0%, #7431E2 100%)",
        "gradient-purple-horizontal": "linear-gradient(90deg, #D960F7 0%, #7431E2 63.89%)",
        // Buttons
        "btn-gradient-purple-active": "linear-gradient(88.59deg, #B22AD3 1.68%, #6121CB 100%)",
        "btn-gradient-orange": "linear-gradient(265.7deg, #FF5C00 3.2%, #FF7D34 53.5%)",
      },
      backgroundColor: {
        "light-grey": "#FBFBFB",
        "light-blue": "#F6F6F6",
        "light-pink": "#FBEDF9",
        "light-green": "#EDFBF0",
        "light-orange": "#FFF9F5",
        error: "#CB1D1DCC",

        // Buttons
        "btn-orange": "#FFF2E9",

        // Tabs
        "tabs-white": "#FFFFFF",
        "tabs-light-grey": "#F6F6F6",
        "tabs-light-pink": "#FDF6FC",

        // ViewCells / Rows
        "view-cell-white": "#FFFFFF",
        "view-cell-light-grey": "#E3E4E3",
        "view-cell-light-red": "#FDF6F6",
        "view-cell-light-pink": "#FDF6FC",
        "view-cell-light-blue": "#FAFAFA",
        "view-cell-light-green": "#F6FDF8",
        "view-cell-orange": "#FFF9F5",
      },

      borderColor: {
        "input-stroke-light": "#F2F2F2",
        "input-stroke-grey": "#E3E3E3",
        grey: "#F2F2F2",
        pink: "#CB1DAB",
        red: "#CB1D1D",
        white: "#FFFFFF",
        "light-blue": "#F7F8FA",
        "light-red": "#FCF2F2",
      },
    },
  },

  plugins: [
    plugin(function ({
      addComponents,
      theme,
    }) {
      const typography = {
        // === === === Title === === ===
        ".h1-text-accent-30": {
          fontSize: theme("fontSize.size-30"),
          fontWeight: theme("fontWeight.700"),
          lineHeight: theme("lineHeight.36"),
          letterSpacing: "1px",
        },
        ".h1-text-reg-30": {
          fontSize: theme("fontSize.size-30"),
          fontWeight: theme("fontWeight.400"),
          lineHeight: theme("lineHeight.36"),
          letterSpacing: "1px",
        },

        ".h2-text-accent-26": {
          fontSize: theme("fontSize.size-26"),
          fontWeight: theme("fontWeight.700"),
          lineHeight: theme("lineHeight.32"),
          letterSpacing: "1px",
        },
        ".h2-text-reg-26": {
          fontSize: theme("fontSize.size-26"),
          fontWeight: theme("fontWeight.400"),
          lineHeight: theme("lineHeight.32"),
          letterSpacing: "1px",
        },

        ".h3-text-accent-20": {
          fontSize: theme("fontSize.size-20"),
          fontWeight: theme("fontWeight.700"),
          lineHeight: theme("lineHeight.28"),
          letterSpacing: "0.25px",
        },
        ".h3-text-med-20": {
          fontSize: theme("fontSize.size-20"),
          fontWeight: theme("fontWeight.500"),
          lineHeight: theme("lineHeight.26"),
          letterSpacing: "0.25px",
        },
        ".h3-text-reg-20": {
          fontSize: theme("fontSize.size-20"),
          fontWeight: theme("fontWeight.400"),
          lineHeight: theme("lineHeight.30"),
          letterSpacing: "0.25px",
        },

        ".h4-text-accent-18": {
          fontSize: theme("fontSize.size-18"),
          fontWeight: theme("fontWeight.500"),
          lineHeight: theme("lineHeight.24"),
          letterSpacing: "0.25px",
        },
        ".h4-text-reg-18": {
          fontSize: theme("fontSize.size-18"),
          fontWeight: theme("fontWeight.400"),
          lineHeight: theme("lineHeight.24"),
          letterSpacing: "0.25px",
        },

        ".h5-text-comment-caps": {
          fontSize: theme("fontSize.size-12"),
          fontWeight: theme("fontWeight.400"),
          lineHeight: theme("lineHeight.16"),
          letterSpacing: "2px",
          textTransform: "uppercase",
        },

        // === === === Subtitle === === ===
        ".st1-text-accent-16": {
          fontSize: theme("fontSize.size-16"),
          fontWeight: theme("fontWeight.700"),
          lineHeight: theme("lineHeight.24"),
          letterSpacing: "0.5px",
        },

        // === === === Body === === ===
        ".b1-text-accent-16": {
          fontSize: theme("fontSize.size-16"),
          fontWeight: theme("fontWeight.700"),
          lineHeight: theme("lineHeight.24"),
          letterSpacing: "0.5px",
        },
        ".b1-text-med-16": {
          fontSize: theme("fontSize.size-16"),
          fontWeight: theme("fontWeight.500"),
          lineHeight: theme("lineHeight.24"),
          letterSpacing: "0.25px",
        },
        ".b1-text-reg-16": {
          fontSize: theme("fontSize.size-16"),
          fontWeight: theme("fontWeight.400"),
          lineHeight: theme("lineHeight.24"),
          letterSpacing: "0.15px",
        },

        ".b2-text-body-accent-14": {
          fontSize: theme("fontSize.size-14"),
          fontWeight: theme("fontWeight.500"),
          lineHeight: theme("lineHeight.20"),
          letterSpacing: "0.0025em",
        },
        ".b2-text-body-reg-14": {
          fontSize: theme("fontSize.size-14"),
          fontWeight: theme("fontWeight.400"),
          lineHeight: theme("lineHeight.20"),
        },

        // === === === Comment === === ===
        ".c1-text-accent-12": {
          fontSize: theme("fontSize.size-12"),
          fontWeight: theme("fontWeight.500"),
          lineHeight: theme("lineHeight.16"),
        },
        ".c1-text-reg-12": {
          fontSize: theme("fontSize.size-12"),
          fontWeight: theme("fontWeight.400"),
          lineHeight: theme("lineHeight.16"),
          letterSpacing: "0.2px",
        },
        ".c2-text-accent-11": {
          fontSize: theme("fontSize.size-11"),
          fontWeight: theme("fontWeight.500"),
          lineHeight: theme("lineHeight.16"),
          letterSpacing: "0.5px",
        },
        ".c2-text-reg-11": {
          fontSize: theme("fontSize.size-11"),
          fontWeight: theme("fontWeight.400"),
          lineHeight: theme("lineHeight.16"),
          letterSpacing: "0.2px",
        },
      }

      addComponents({
        ".section-block": {
          display: "inline-flex",
          gap: "4px",
          padding: theme("spacing.4"),
          backgroundColor: theme("backgroundColor.light-blue"),
          borderRadius: theme("borderRadius.lg"),
          ...typography[".b1-text-med-16"],
          cursor: "pointer",
          userSelect: "none",
          width: "236px",
          transitionProperty: theme("transitionProperty.colors"),
          transitionDuration: theme("transitionDuration.150"),
          transitionTimingFunction: theme("transitionTimingFunction.ease"),
          "&:hover": {
            backgroundColor: theme("backgroundColor.light-pink"),
            color: theme("textColor.pink"),
          },
        },

        ...typography,
      })
    }),
  ],
}
