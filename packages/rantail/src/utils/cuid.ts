import {init} from '@paralleldrive/cuid2'
// Generate a random class name
export const generateCUID = (): string => {
    const cuid = init({ length: 12 });
    return cuid();
  }