module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["expo", "prettier", "plugin:@typescript-eslint/recommended"],
  plugins: ["prettier", "@typescript-eslint", "import"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "import/no-unresolved": [
      "error",
      {
        ignore: ["^@components/", "^@utils/"],
      },
    ],
  },
  ignorePatterns: ["expo-env.d.ts"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json", // Adjust this path if needed
      },
    },
  },
};
