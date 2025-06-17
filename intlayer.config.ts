import { Locales, type IntlayerConfig } from "intlayer";

const config: IntlayerConfig = {
  internationalization: {
    locales: [
      Locales.ENGLISH,
      Locales.ARABIC,
    ],
    defaultLocale: Locales.ENGLISH,
  },
  middleware: {
    headerName: "x-intlayer-locale",
  },
  content: {
    typesDir: "src/@types",
    fileExtensions: [".content.ts", ".content.tsx"],
  },
  editor: {
    enabled: process.env.NODE_ENV === "development",
  },
};

export default config; 