export function getMobileOperatingSystem() {
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent || navigator.platform || navigator.vendor : "";

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // iOS detection
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return "iOS";
  }

  return null;
}
