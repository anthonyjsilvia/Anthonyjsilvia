import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const nextCoreWebVitals = require("eslint-config-next/core-web-vitals");

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  ...nextCoreWebVitals,
  {
    rules: {
      // Legitimate SSR/hydration and localStorage sync patterns in this app
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
