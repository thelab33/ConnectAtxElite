const js = require('@eslint/js');

module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        console: "readonly",
        window: "readonly",
        document: "readonly",
        // Add any other globals you use here
      },
    },
  },
  js.configs.recommended,
];
