export const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const allowedKeys = [
    "Backspace",
    "Tab",
    "ArrowLeft",
    "ArrowRight",
    "Delete",
    "a", // untuk Ctrl+A
  ];

  // Izinkan navigasi & penghapusan
  if (
    allowedKeys.includes(e.key) ||
    (e.key.toLowerCase() === "a" && (e.ctrlKey || e.metaKey)) // Ctrl+A (atau Cmd+A di Mac)
  ) {
    return;
  }

  // Izinkan angka (0-9) dan titik (.), tetapi blokir koma (,)
  if (!/[\d.]/.test(e.key)) {
    e.preventDefault();
  }

  const inputValue = e.currentTarget.value;

  // Cegah input lebih dari satu titik
  if (e.key === "." && (inputValue.includes(".") || inputValue === "")) {
    e.preventDefault();
  }
};

export const handleKeyDownPercent = (event: any) => {
  const { key, target } = event;
  const value = target.value;

  // Mencegah huruf dan simbol kecuali angka, backspace, delete, dan titik desimal
  if (
    !/[\d.]/.test(key) &&
    !["Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(key)
  ) {
    event.preventDefault();
  }

  // Cegah lebih dari satu titik desimal
  if (key === "." && value.includes(".")) {
    event.preventDefault();
  }

  // Cegah input yang menyebabkan nilai lebih dari 100
  setTimeout(() => {
    const newValue = parseFloat(target.value);
    if (newValue > 100) {
      target.value = "100"; // Paksa jadi 100 jika lebih
    }
  }, 0);
};

export const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  let value = e.target.value.replace(/[^\d.]/g, ""); // Hanya izinkan angka dan titik
  let [integer, decimal] = value.split("."); // Pisahkan bagian sebelum dan setelah titik desimal

  // Jika integer diawali dengan "0" dan diikuti angka lain, hapus "0"
  if (integer.length > 1 && integer.startsWith("0")) {
    integer = integer.replace(/^0+/, ""); // Menghapus semua 0 di depan
  }

  // Format bagian integer dengan koma pemisah ribuan
  integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Gabungkan kembali jika ada bagian desimal
  e.target.value = decimal !== undefined ? `${integer}.${decimal}` : integer;
};
