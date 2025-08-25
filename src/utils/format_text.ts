export const toPascalCase = (str: string) => {
  return str.toLowerCase().replace(/\b\w/g, (chr) => chr.toUpperCase());
};
