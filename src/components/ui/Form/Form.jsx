import { Form as AntForm } from 'antd';

/**
 * Wrapper around Ant Design Form.
 */
export function Form({ children, ...props }) {
  return <AntForm {...props}>{children}</AntForm>;
}

export default Form;
