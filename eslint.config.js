import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginReactRefresh from 'eslint-plugin-react-refresh'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  { ignores: ['node_modules', 'dist/', 'dist-electron/', 'dist-react/'] },
  pluginReactRefresh.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'react-hooks': pluginReactHooks
    }
  },
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      quotes: ['error', 'double'],
      semi: ['error', 'always'],
      indent: ['error', 2],
      'max-len': ['error', { code: 80 }],
      // "comma-style": ["error", "last"],
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': 'error',
      'object-curly-newline': ['error', { multiline: true, consistent: true }],
      'arrow-parens': ['error', 'always'],
      'comma-spacing': ['error', { before: false, after: true }],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',
      // "import/no-unresolved": "off",
      // "no-shadow": "off",
      'react/react-in-jsx-scope': 'off',
      ...pluginReactHooks.configs.recommended.rules
    }
  },
  eslintPluginPrettierRecommended
]
