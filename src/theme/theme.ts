import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { colorPalette, fontPalette } from "./pallet.ts";

const config = defineConfig({
  theme: {
    tokens: {
      fonts: fontPalette,
      colors: colorPalette,
    },
  },
});

export const system = createSystem(defaultConfig, config);
