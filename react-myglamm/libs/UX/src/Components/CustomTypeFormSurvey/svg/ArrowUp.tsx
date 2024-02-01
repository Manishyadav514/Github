interface arrowUpProps {
  width: string;
  height: string;
  color: string;
}
const ArrowUp = ({ width, height, color }: arrowUpProps) => (
  <svg width={width} height={height} fill={color}>
    <path d="M11.996 8.121l1.414-1.414L6.705 0 0 6.707l1.414 1.414 5.291-5.293z"></path>
  </svg>
);

export default ArrowUp;
