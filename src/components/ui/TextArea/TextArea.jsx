import { Input } from 'antd';

const { TextArea: AntTextArea } = Input;

/**
 * Wrapper around Ant Design TextArea (Input.TextArea).
 */
export function TextArea({ ...props }) {
  return <AntTextArea {...props} />;
}

export default TextArea;
