module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended'
  ],
  parserOptions: {
    sourceType: 'module'
  },
  rules: {
    'no-console': 'off'
    // '@typescript-eslint/no-unused-vars': 'off'
  }
}
