module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: ['eslint:recommended', 'google'],
  rules: {
    'indent': ['error', 2], // 탭을 스페이스 2칸으로 고정
    'no-tabs': 'off', // 탭 에러 끄기 (권장 X)
    'max-len': ['warn', 120],
  },
  overrides: [
    {
      files: ['**/*.spec.*'],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
