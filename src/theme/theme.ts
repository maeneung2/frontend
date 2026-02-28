import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { colorPalette, fontPalette } from "./pallet.ts";

const config = () => {
  return defineConfig({
    theme: {
      tokens: {
        fonts: fontPalette as never,
        colors: colorPalette as never,
      },
    },
  });
};

export const system = createSystem(defaultConfig, config());
