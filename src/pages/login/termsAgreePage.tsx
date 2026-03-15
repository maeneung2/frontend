import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Button, Checkbox, Divider, Typography } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../api/axios";
import { useAuthStore } from "../../store/authStore";

const { Title, Text, Paragraph } = Typography;

const TERMS = [
  {
    key: "service",
    label: "서비스 이용약관 동의",
    required: true,
    content:
      "본 서비스를 이용하시려면 아래 약관에 동의하셔야 합니다. 서비스 이용약관은 회사와 이용자 간의 권리·의무 및 책임사항을 규정합니다.",
  },
  {
    key: "privacy",
    label: "개인정보 수집 및 이용 동의",
    required: true,
    content:
      "수집 항목: 이름, 이메일, 프로필 사진 / 수집 목적: 회원 식별 및 서비스 제공 / 보유 기간: 회원 탈퇴 시까지",
  },
  {
    key: "marketing",
    label: "마케팅 정보 수신 동의 (선택)",
    required: false,
    content: "이벤트, 혜택 등 마케팅 정보를 이메일로 받아보실 수 있습니다.",
  },
];

const TermsAgreePage = () => {
  const [searchParams] = useSearchParams();
  const tempToken = searchParams.get("tempToken");
  const navigate = useNavigate();
  const setLogin = useAuthStore((s) => s.setLogin);

  const [checked, setChecked] = useState<Record<string, boolean>>({
    service: false,
    privacy: false,
    marketing: false,
  });

  const allRequired = TERMS.filter((t) => t.required).every((t) => checked[t.key]);
  const allChecked = TERMS.every((t) => checked[t.key]);

  const toggleAll = (value: boolean) => {
    setChecked({ service: value, privacy: value, marketing: value });
  };

  // OAuth 신규 유저: 동의 후 유저 생성
  const { mutate: agreeOAuth, isPending } = useMutation({
    mutationFn: () =>
      api.post("/api/v1/auth/oauth/agree", { tempToken }).then((r) => r.data),
    onSuccess: async ({ accessToken, refreshToken }) => {
      const res = await api.get("/api/v1/user/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setLogin(accessToken, refreshToken, res.data);
      navigate("/", { replace: true });
    },
    onError: () => {
      alert("오류가 발생했습니다. 다시 로그인해주세요.");
      navigate("/login", { replace: true });
    },
  });

  const handleAgree = () => {
    if (tempToken) {
      // OAuth 신규 유저
      agreeOAuth();
    } else {
      // 일반 회원가입 → 약관 동의 완료 상태를 가지고 signup 페이지로 이동
      navigate("/login/sign-up", { state: { agreedTerms: true } });
    }
  };

  return (
    <Flex flexDir={"column"} h={"100%"} p={6} maxW={480} mx={"auto"} gap={4}>
      <Flex flexDir={"column"} align={"center"} gap={1} mb={4}>
        <Title level={2} style={{ margin: 0 }}>
          약관 동의
        </Title>
        <Text type="secondary">서비스 이용을 위해 약관에 동의해주세요</Text>
      </Flex>

      {/* 전체 동의 */}
      <Flex
        align={"center"}
        p={4}
        borderRadius={8}
        style={{ background: "#f5f5f5" }}
      >
        <Checkbox
          checked={allChecked}
          indeterminate={!allChecked && Object.values(checked).some(Boolean)}
          onChange={(e) => toggleAll(e.target.checked)}
        >
          <Text strong>전체 동의</Text>
        </Checkbox>
      </Flex>

      <Divider style={{ margin: "4px 0" }} />

      {/* 개별 약관 */}
      <Flex flexDir={"column"} gap={4}>
        {TERMS.map((term) => (
          <Flex key={term.key} flexDir={"column"} gap={2}>
            <Checkbox
              checked={checked[term.key]}
              onChange={(e) =>
                setChecked((prev) => ({ ...prev, [term.key]: e.target.checked }))
              }
            >
              <Text>
                {term.label}
                {term.required && (
                  <Text type="danger" style={{ marginLeft: 4 }}>
                    (필수)
                  </Text>
                )}
              </Text>
            </Checkbox>
            <Paragraph
              type="secondary"
              style={{
                fontSize: 12,
                marginLeft: 24,
                marginBottom: 0,
                padding: "8px 12px",
                background: "#fafafa",
                borderRadius: 4,
                border: "1px solid #f0f0f0",
              }}
            >
              {term.content}
            </Paragraph>
          </Flex>
        ))}
      </Flex>

      <Button
        type="primary"
        size="large"
        block
        disabled={!allRequired}
        loading={isPending}
        onClick={handleAgree}
        style={{ marginTop: "auto" }}
      >
        동의하고 계속하기
      </Button>
    </Flex>
  );
};

export default TermsAgreePage;