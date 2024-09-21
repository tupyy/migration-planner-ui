import globals from "globals";
import eslintJs from "@eslint/js";
import tsEslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';

const config = tsEslint.config(
  eslintJs.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    name: "General",
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals:
      {
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "all",
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "warn",
    }
  },
  {
    name: "React (Web)",
    files: ["**/*.{tsx,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      }
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    plugins: {
      'react': pluginReact,
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh,
    },
    rules: {
      ...pluginReact.configs.flat['jsx-runtime'].rules,
      ...pluginReactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": "warn",
    },
  },
  {
    name: "Ignored",
    ignores: ["**/dist", "**/node_modules", "eslint.config.js"],
  }
);

export default config;
