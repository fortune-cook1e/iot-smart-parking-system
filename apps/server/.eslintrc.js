/* eslint-env node */
module.exports = {
  extends: ['../../.eslintrc.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    // Server 特定规则：允许 console（服务器日志）
    'no-console': 'off',
  },
  env: {
    node: true,
  },
};
