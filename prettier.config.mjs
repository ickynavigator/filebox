// @ts-check

/** @type {import('prettier').Config & import("@ianvs/prettier-plugin-sort-imports").PluginConfig} */
const config = {
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'avoid',
  endOfLine: 'auto',
  tabWidth: 2,
  useTabs: false,

  jsxSingleQuote: true,

  plugins: ['@ianvs/prettier-plugin-sort-imports'],

  // #region @ianvs/prettier-plugin-sort-imports
  importOrder: ['<THIRD_PARTY_MODULES>', '', '^~/', '^[.][.]/', '^[.]/'],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.0.0',
  // #endregion @ianvs/prettier-plugin-sort-imports
};

export default config;
