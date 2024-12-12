import { toast } from "react-toastify";

// "success" | "error" | "info" | "warn"
const createNotification: (type: string, message?: string, timeout?: number) => void = (
  type,
  message,
  timeout = 2000,
) => {
  toast[type as "success" | "error" | "info" | "warn"](message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: timeout,
  });
};

export default createNotification;
