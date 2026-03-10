import js from '@eslint/js'
import vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'
import pluginVue from 'eslint-plugin-vue'
import pluginTs from '@typescript-eslint/eslint-plugin'
import prettier from 'eslint-config-prettier'

export default [
  {
    ignores: ['node_modules', 'dist'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        sourceType: 'module',
      },
    },
    plugins: {
      vue: pluginVue,
      '@typescript-eslint': pluginTs,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginVue.configs['essential'].rules,
      ...pluginTs.configs['recommended'].rules,
      ...prettier.rules,
    },
  },
]
