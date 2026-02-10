import { App } from "antd";
import { setToastMessage } from "@/components/ui/Toast";

const AppInitializer = ({ children }) => {
  const { message } = App.useApp();

  // register message instance once
  setToastMessage(message);

  return children;
};

export default AppInitializer;
