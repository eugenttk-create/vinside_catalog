const formatDate = (dateStr: string): string => {
  const [month, day, year] = dateStr.split("/").map(Number);

  const fullYear = year < 100 ? 2000 + year : year;

  const pad = (n: number) => String(n).padStart(2, "0");

  return `${pad(day)}.${pad(month)}.${fullYear}`;
};

export default formatDate;
