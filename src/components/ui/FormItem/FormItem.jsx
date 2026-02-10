import { Form } from 'antd';

const { Item: AntFormItem } = Form;

/**
 * Wrapper around Ant Design Form.Item.
 */
export function FormItem({ ...props }) {
  return <AntFormItem {...props} />;
}

export default FormItem;
