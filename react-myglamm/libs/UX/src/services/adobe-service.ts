export function getDigitalData() {
  if ((window as any).digitalData) {
    return (window as any).digitalData;
  }
  return null;
}

export function setDigitalData(data: any) {
  (window as any).digitalData = data;
}
