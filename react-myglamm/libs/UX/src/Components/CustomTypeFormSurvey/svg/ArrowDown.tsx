interface arrowDownProps {
  width: string;
  height: string;
  color: string;
}
const ArrowDown = ({ width, height, color }: arrowDownProps) => (
  <svg width={width} height={height} fill={color}>
    <path d="M12.293.293l1.414 1.414L7 8.414.293 1.707 1.707.293 7 5.586z"></path>
  </svg>
);

export default ArrowDown;
