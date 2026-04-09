declare module "bun:test" {
  export const describe: (name: string, fn: () => void | Promise<void>) => void;
  export const it: (name: string, fn: () => void | Promise<void>) => void;
  export const expect: {
    (value: unknown): {
      toBe: (expected: unknown) => void;
      toBeInstanceOf: (expected: new (...args: unknown[]) => unknown) => void;
      toEqual: (expected: unknown) => void;
      toMatchObject: (expected: object) => void;
      rejects: {
        toMatchObject: (expected: object) => Promise<void>;
      };
    };
  };
}
