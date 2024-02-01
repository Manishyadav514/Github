interface checkmarkProps {
  width: string;
  height: string;
  color: string;
}
const Checkmark = ({ width, height, color }: checkmarkProps) => (
  <svg width={width} height={height} fill={color}>
    <path d="M14.293.293l1.414 1.414L5 12.414.293 7.707l1.414-1.414L5 9.586z"></path>
  </svg>
);

export default Checkmark;
