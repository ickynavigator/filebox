/** Convert bytes to megabytes */
export const bytesToMegaBytes = (bytes: number, real = true) =>
  bytes / (real ? 1000 : 1024) ** 2;
