/** Strip to digits and normalize Indian mobiles to 10 digits (6–9 leading). */
export function normalizeIndianMobile(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  return digits;
}

export function isValidIndianMobile(normalized: string): boolean {
  return /^[6-9]\d{9}$/.test(normalized);
}
