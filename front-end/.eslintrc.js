module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb", "airbnb-typescript", "plugin:import/recommended", "plugin:prettier/recommended", "prettier"],
  overrides: [{ files: ["**/*.tsx"] }],
  parser: "@typescript-eslint/parser",
  ignorePatterns: [".eslintrc.js", "**/*.js", "**/*.jsx", "**/*.ts"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  plugins: ["react"],
  rules: {
    quotes: [1, "double", { avoidEscape: true }],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "react/function-component-definition": 0,
    "react/no-arrow-function-lifecycle": 0,
    "react/no-invalid-html-attribute": 0,
    "react/no-unused-class-component-methods": 0,
    "@typescript-eslint/no-unused-vars": 1,
    "react/jsx-props-no-spreading": 0,
    "react/require-default-props": "off",
    "import/no-cycle": 0,
  },
};
