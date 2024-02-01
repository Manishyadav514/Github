import { useAmp } from "next/amp";

const AmpWrap = ({ ampOnly, nonAmp }: { ampOnly?: any; nonAmp?: any }) => {
  const isAmp = useAmp();

  if (ampOnly) return isAmp && ampOnly;

  return !isAmp && nonAmp;
};

export default AmpWrap;
