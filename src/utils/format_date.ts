export const formatDate = (dateString: string, isMMMM?: boolean) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month =
    isMMMM === true
      ? date.toLocaleString("id-ID", { month: "long" })
      : String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());

  return isMMMM === true
    ? `${day} ${month} ${year}`
    : `${day}/${month}/${year}`;
};

export const getTodayDate = (): string => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
};

export const calculateDaysDifference = (dateString: string): number => {
  const today = new Date();
  const targetDate = new Date(dateString);

  const differenceInTime = targetDate.getTime() - today.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

  return differenceInDays;
};

export const dateDifference = (date: string) => {
  const targetDate = new Date(date);
  const today = new Date();

  const daysRemaining = Math.ceil(
    (today.getTime() - targetDate.getTime()) / 86400000
  );

  return daysRemaining;
};

export const getDateDifference = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Menghitung selisih dalam milidetik
  const diffInMs = d1.getTime() - d2.getTime();

  // Mengonversi ke hari
  return diffInMs / (1000 * 60 * 60 * 24);
};
