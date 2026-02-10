import { Select as AntSelect } from 'antd';

/**
 * Wrapper around Ant Design Select.
 */
export function Select({ children, options, ...props }) {
  return (
    <AntSelect options={options} {...props}>
      {children}
    </AntSelect>
  );
}

export default Select;
