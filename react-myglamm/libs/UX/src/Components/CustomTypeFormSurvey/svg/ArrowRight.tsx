interface arrowRightProps {
  width: string;
  height: string;
  color: string;
}
const ArrowRight = ({ width, height, color }: arrowRightProps) => (
  <svg width={width} height={height} fill={color}>
    <path d="M5 3.5v1.001H-.002v-1z"></path>
    <path d="M4.998 4L2.495 1.477 3.2.782 6.416 4 3.199 7.252l-.704-.709z"></path>
  </svg>
);

export default ArrowRight;
