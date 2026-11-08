const js = require('@eslint/js');

module.exports = [
  {
    ignores: ['node_modules/**'],
  },
  js.configs.recommended,
  {
    files: ['eslint.config.js'],
    languageOptions: {
      globals: {
        module: 'readonly',
        require: 'readonly',
      },
    },
  },
  {
    files: ['**/*.js', '**/*.gs'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script',
      globals: {
        Browser: 'readonly',
        DriveApp: 'readonly',
        EMAILS_BY_LISTENER: 'readonly',
        GASLibrary: 'readonly',
        GmailApp: 'readonly',
        HtmlService: 'readonly',
        Logger: 'readonly',
        MailApp: 'readonly',
        PropertiesService: 'readonly',
        ScriptApp: 'readonly',
        Session: 'readonly',
        SORT_CONFIGS: 'readonly',
        SpreadsheetApp: 'readonly',
        Utilities: 'readonly',
        UrlFetchApp: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { varsIgnorePattern: '^_' }],
      'no-useless-assignment': 'off',
      'no-redeclare': ['error', { builtinGlobals: false }],
    },
  },
  require('eslint-config-prettier/flat'),
];
