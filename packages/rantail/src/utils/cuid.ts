import { init } from '@paralleldrive/cuid2'

// Generate a cuid2
export const generateCUID = (): string => {
  const cuid = init({ length: 12 });
  return cuid();
}