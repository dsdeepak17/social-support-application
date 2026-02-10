import { Spin as AntSpin } from 'antd';

/**
 * Wrapper around Ant Design Spin.
 */
export function Spin({ children, ...props }) {
  return <AntSpin {...props}>{children}</AntSpin>;
}

export default Spin;
