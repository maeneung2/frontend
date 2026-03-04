// 라이트 모드 원천값
export const lightColors = {
  frame: "#F3F4F6",
  bgColor: "#FFFFFF",
  primary: "#4F46E5",
  secondary: "#7C3AED",
  text: "#111827",
  subText: "#6B7280",
  border: "#E5E7EB",
  danger: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",
  disabled: "#D1D5DB",
} as const;

// 다크 모드 원천값
export const darkColors = {
  frame: "#1F2937",
  bgColor: "#111827",
  primary: "#818CF8",
  secondary: "#A78BFA",
  text: "#F9FAFB",
  subText: "#9CA3AF",
  border: "#374151",
  danger: "#FCA5A5",
  success: "#6EE7B7",
  warning: "#FCD34D",
  disabled: "#4B5563",
} as const;

export const fonts = {
  mainText: "18px",
  subText: "12px",
  mainHeader: "20px",
} as const;

// Chakra UI v3 토큰 형식 (semantic tokens에서 사용)
export const fontPalette: Record<string, { value: string }> = Object.fromEntries(
  Object.entries(fonts).map(([k, v]) => [k, { value: v }])
);