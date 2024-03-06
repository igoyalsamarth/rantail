import { init } from '@paralleldrive/cuid2'

// Generate a cuid2
export const generateCUID = (cuidLength: number, prefix?: string, suffix?: string): string => {
  const cuid = init({ length: cuidLength });
  let generatedCuid = cuid();

  if (prefix) {
    generatedCuid = prefix + generatedCuid;
  }

  if (suffix) {
    generatedCuid = generatedCuid + suffix;
  }

  return generatedCuid;
}