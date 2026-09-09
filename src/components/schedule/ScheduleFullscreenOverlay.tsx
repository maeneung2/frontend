import { Button } from "antd";
import { FullscreenExitOutlined } from "@ant-design/icons";
import { Flex } from "@chakra-ui/react";

interface Props {
  onClose: () => void;
  children: React.ReactNode;
}

const ScheduleFullscreenOverlay = ({ onClose, children }: Props) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      background: "white",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        width: "100vh",
        height: "100vw",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%) rotate(90deg)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 12,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Flex justify={"flex-end"} flexShrink={0}>
        <Button icon={<FullscreenExitOutlined />} onClick={onClose} size="middle" />
      </Flex>
      {children}
    </div>
  </div>
);

export default ScheduleFullscreenOverlay;
