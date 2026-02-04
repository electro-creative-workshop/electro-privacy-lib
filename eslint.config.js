const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
                ELECTRO_PRIVACY_VERSION: 'readonly',
            },
        },
        rules: {
            'no-unused-vars': ['error', { 
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
            }],
            'no-console': ['warn', { 
                allow: ['warn', 'error'] 
            }],
            'no-undef': 'error',
            'prefer-const': 'warn',
            'no-var': 'error',
        },
    },
    {
        ignores: [
            'dist/**',
            'node_modules/**',
            '*.config.js',
            '!eslint.config.js',
        ],
    },
];

