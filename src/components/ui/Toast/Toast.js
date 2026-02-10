/**
 * Toast/notification wrapper.
 * AntD v5 requires message from App.useApp() (context aware).
 */

let messageApi = null;

// call this once from a component wrapped by <App>
export const setToastMessage = (api) => {
  messageApi = api;
};

export const Toast = {
  success(text) {
    messageApi?.success(text);
  },
  error(text) {
    messageApi?.error(text);
  },
  warning(text) {
    messageApi?.warning(text);
  },
  info(text) {
    messageApi?.info(text);
  },
  loading(text, duration = 0) {
    return messageApi?.loading(text, duration);
  },
};

export default Toast;
