//	2023-04-06T09:02:23.362Z (date format expected as input)
export function formatDate(date: any) {
  if (!date) {
    return "-";
  }
  var monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const localDate = new Date(date);
  const day = localDate.getUTCDate();
  const m = localDate.getUTCMonth();
  var month = monthArray[m];
  const year = localDate.getUTCFullYear();
  const h = localDate.getHours();
  const hour = h > 12 ? h - 12 : h;
  const min = localDate.getMinutes();
  var ampm = 24 > hour && hour > 12 ? "PM" : "AM";
  const time = `${prependZero(hour)}:${prependZero(min)} ${ampm}`;
  return day ? `${day} ${month} ${year}, ${time}` : "";
}

export function prependZero(n: number) {
  return n > 9 ? n : `0${n}`;
}
