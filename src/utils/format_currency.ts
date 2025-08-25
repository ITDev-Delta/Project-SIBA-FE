export const formatCurrency = (
  value: any,
  useParenthesesForNegative: boolean = false
): string => {
  // 1. Normalisasi input menjadi angka yang bersih.
  // Mengatasi string, null, undefined, dan NaN.
  let numericValue = typeof value === "string" ? parseFloat(value) : value;
  if (typeof numericValue !== "number" || isNaN(numericValue)) {
    numericValue = 0;
  }

  // 2. Tentukan opsi format angka.
  const options: Intl.NumberFormatOptions = {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  };

  // 3. Cek jika format tanda kurung untuk angka negatif diminta DAN nilainya negatif.
  if (useParenthesesForNegative && numericValue < 0) {
    // Ambil nilai absolut (positif) dari angka tersebut
    const absoluteValue = Math.abs(numericValue);

    // Format nilai positifnya
    const formattedPositiveValue = new Intl.NumberFormat(
      "en-US",
      options
    ).format(absoluteValue);

    // Kembalikan dengan dibungkus tanda kurung
    return `(${formattedPositiveValue})`;
  }

  // 4. Jika tidak, gunakan format default untuk semua angka lainnya.
  return new Intl.NumberFormat("en-US", options).format(numericValue);
};
export const inputDecimal = (input: string) => {
  input = input.replace(/[^\d.]/g, "");

  // Prevent more than one dot
  const parts = input.split(".");
  if (parts.length >= 2) {
    parts[1] = `.${parts[1]}`;
    input = parts[0] + "." + parts[1];
  }

  // Limit to 2 decimal places
  if (parts[1]?.length > 3) {
    parts[1] = parts[1].substring(0, 3);
    input = parts.join(".");
  }

  const decimalInput = parts[1] || "";
  const result = formatCurrency(parts[0]) + decimalInput;

  return result;
};
