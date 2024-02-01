export function getCommaSeparatedAmount(amount: number) {
  if (amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return amount;
}
