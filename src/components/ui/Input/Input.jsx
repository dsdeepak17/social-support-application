import { Input as AntInput } from 'antd';

/**
 * Wrapper around Ant Design Input.
 */
export function Input({ ...props }) {
  return <AntInput {...props} />;
}

export default Input;
