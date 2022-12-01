module.exports = {
  extends: [
    "next/core-web-vitals",
    "prettier",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["prettier", "import", "simple-import-sort", "@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-empty-interface": "off",
  },
};
