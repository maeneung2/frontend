import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { theme as antdThemeUtil } from "antd";
import type { ThemeConfig } from "antd";
import { lightColors, darkColors, fontPalette } from "./pallet.ts";

// Chakra UI: semantic tokens으로 _light/_dark 자동 전환
const config = defineConfig({
  theme: {
    tokens: {
      fonts: fontPalette,
    },
    semanticTokens: {
      colors: Object.fromEntries(
        Object.keys(lightColors).map((key) => [
          key,
          {
            value: {
              _light: lightColors[key as keyof typeof lightColors],
              _dark: darkColors[key as keyof typeof darkColors],
            },
          },
        ])
      ),
    },
  },
});

export const system = createSystem(defaultConfig, config);

// antd 공통 token (primary 등은 모드별로 다름)
const baseToken = (colors: Record<keyof typeof lightColors, string>) => ({
  colorPrimary: colors.primary,
  colorError: colors.danger,
  colorSuccess: colors.success,
  colorWarning: colors.warning,
  colorBgBase: colors.bgColor,
  colorTextBase: colors.text,
  colorBorder: colors.border,
  colorTextSecondary: colors.subText,
  colorBgLayout: colors.frame,
});

export const antdLightTheme: ThemeConfig = {
  algorithm: antdThemeUtil.defaultAlgorithm,
  token: baseToken(lightColors),
};

export const antdDarkTheme: ThemeConfig = {
  algorithm: antdThemeUtil.darkAlgorithm,
  token: baseToken(darkColors),
};
