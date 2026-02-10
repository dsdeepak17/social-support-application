import { InputNumber as AntInputNumber } from 'antd';

/**
 * Wrapper around Ant Design InputNumber.
 */
export function InputNumber({ ...props }) {
  return <AntInputNumber {...props} />;
}

export default InputNumber;
