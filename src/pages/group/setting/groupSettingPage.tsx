import { Flex } from "@chakra-ui/react";
import { List, Typography } from "antd";
import { CalendarOutlined, RightOutlined, TeamOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";

const { Text } = Typography;

const MENU_ITEMS = [
  {
    key: "schedule",
    icon: <CalendarOutlined style={{ fontSize: 18 }} />,
    label: "스케줄 관리",
    desc: "월별 스케줄 생성 및 수정",
    path: (id: string) => `/group/${id}/setting/schedule`,
  },
  {
    key: "user",
    icon: <TeamOutlined style={{ fontSize: 18 }} />,
    label: "그룹원 관리",
    desc: "멤버 초대 및 권한 설정",
    path: (id: string) => `/group/${id}/setting/user`,
  },
];

const GroupSettingPage = () => {
  const { group_id } = useParams();
  const navigate = useNavigate();

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <PageHeader title="그룹 설정" />

      <List
        dataSource={MENU_ITEMS}
        renderItem={(item) => (
          <List.Item
            onClick={() => navigate(item.path(group_id!))}
            style={{ cursor: "pointer", padding: "14px 8px" }}
            extra={<RightOutlined style={{ color: "#bfbfbf" }} />}
          >
            <List.Item.Meta
              avatar={
                <Flex
                  align={"center"}
                  justify={"center"}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "#f0f5ff",
                    color: "#1677ff",
                  }}
                >
                  {item.icon}
                </Flex>
              }
              title={<Text strong>{item.label}</Text>}
              description={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {item.desc}
                </Text>
              }
            />
          </List.Item>
        )}
      />
    </Flex>
  );
};

export default GroupSettingPage;
