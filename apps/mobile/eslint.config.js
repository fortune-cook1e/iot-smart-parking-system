// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const rootConfig = require('../../.eslintrc.js');

module.exports = defineConfig([
  rootConfig,
  expoConfig,
  {
    ignores: ['dist/*'],
    rules: {
      // Mobile 特定规则：允许 console.log（调试时有用）
      'no-console': 'off',
    },
  },
]);
