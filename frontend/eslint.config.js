import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    extends: [
      js.configs.recommended,
      reactRefresh.configs.vite,
    ],
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // Plain @eslint/js doesn't know JSX usage (<Foo />) counts as a
      // reference to `Foo`, so it false-positives on every imported
      // component. Ignore unused caught error args (e.g. `catch (err)`)
      // but otherwise rely on the bundler/build to catch true dead imports.
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z]', args: 'none', caughtErrors: 'none' }],
      // CityDataContext intentionally exports both the provider component
      // and the useCityData hook from one file — a common, working React
      // pattern that just means Fast Refresh can't isolate the component.
      'react-refresh/only-export-components': 'warn',
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
