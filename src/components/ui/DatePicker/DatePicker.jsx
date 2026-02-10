import { DatePicker as AntDatePicker } from 'antd';

/**
 * Wrapper around Ant Design DatePicker.
 */
export function DatePicker({ ...props }) {
  return <AntDatePicker {...props} />;
}

export default DatePicker;
