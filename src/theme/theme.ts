import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { colorPalette, fontPalette } from "./pallet.ts";

const config = () => {
  const fonts: Record<string, string> = {};
  const colors: Record<string, string> = {};

  for (const font of fontPalette) fonts[font.name] = font.value;
  for (const color of colorPalette) colors[color.name] = color.value;

  return defineConfig({
    theme: {
      tokens: {
        fonts: fonts as never,
        colors: colors as never,
      },
    },
  });
};

export const system = createSystem(defaultConfig, config());
