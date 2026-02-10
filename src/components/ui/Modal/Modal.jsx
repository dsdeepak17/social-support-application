import { Modal as AntModal } from 'antd';

/**
 * Wrapper around Ant Design Modal.
 */
export function Modal({ children, ...props }) {
  return <AntModal {...props}>{children}</AntModal>;
}

export default Modal;
