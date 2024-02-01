export function getUpdatedDate(categoryMeta: any) {
  const date = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  function dateDaySuffix(date: any) {
    return (
      date.getDate() +
      (date.getDate() % 10 == 1 && date.getDate() != 11
        ? "st"
        : date.getDate() % 10 == 2 && date.getDate() != 12
        ? "nd"
        : date.getDate() % 10 == 3 && date.getDate() != 13
        ? "rd"
        : "th")
    );
  }

  const newCategoryMeta = {
    ...categoryMeta,
    cms: [
      {
        ...categoryMeta?.cms?.[0],
        metadata: {
          ...categoryMeta?.cms?.[0]?.metadata,
          pageDescription: categoryMeta?.cms?.[0]?.metadata?.pageDescription?.replace(
            /last updated:/i,
            `Last Updated: ${dateDaySuffix(date)} ${months[date.getMonth()]} ${date.getFullYear()}`
          ),
        },
      },
    ],
  };

  return newCategoryMeta;
}
