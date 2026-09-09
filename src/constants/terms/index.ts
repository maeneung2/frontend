import { SERVICE_TERMS } from "./service";
import { PRIVACY_TERMS } from "./privacy";
import { MARKETING_TERMS } from "./marketing";

export const TERMS = [
  {
    key: "service",
    label: "서비스 이용약관 동의",
    required: true,
    content: SERVICE_TERMS,
  },
  {
    key: "privacy",
    label: "개인정보 수집 및 이용 동의",
    required: true,
    content: PRIVACY_TERMS,
  },
  {
    key: "marketing",
    label: "마케팅 정보 수신 동의 (선택)",
    required: false,
    content: MARKETING_TERMS,
  },
];