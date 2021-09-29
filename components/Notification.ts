import { notification } from "antd";
interface Props {}

export default function Notification() {
  notification.error({
    message: `Request error ${status}`,
    description: "errorText",
  });
}
