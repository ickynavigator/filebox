/** Convert bytes to megabytes */
export const bytesToMegaBytes = (bytes: number, real = true) =>
  bytes / (real ? 1000 : 1024) ** 2;

export function createSingleton<T>(name: string, create: () => T): T {
  const s = Symbol.for(name);
  const g = globalThis as unknown as Record<symbol, T | undefined>;

  let scope = g[s];
  if (scope === undefined) {
    scope = create();
    g[s] = scope;
  }

  return scope as T;
}
