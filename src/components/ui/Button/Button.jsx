import { Button as AntButton } from 'antd';

/**
 * Wrapper around Ant Design Button.
 * Allows swapping the UI library later without changing consuming code.
 */
export function Button({ children, ...props }) {
  return <AntButton {...props}>{children}</AntButton>;
}

export default Button;
