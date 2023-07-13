module.exports = {
  root: true,
  env: {
    es2020: true,
  },
  extends: ["eslint:recommended", "prettier"],
  rules: {
    "no-unused-vars": "off",
    "no-undef": "off",
  },
  ignorePatterns: ["src/*/libs"],
};
