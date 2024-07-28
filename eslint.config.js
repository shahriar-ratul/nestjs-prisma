const { FlatCompat } = require('@eslint/eslintrc');
const typescriptParser = require('@typescript-eslint/parser');
const eslintPlugin = require('@typescript-eslint/eslint-plugin');
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

//eslint.config.js

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: tseslint.config(
        eslint.configs.recommended,
        ...tseslint.configs.recommended
    ),
});

module.exports = [
    {
        ignores: [
            'eslint.config.js',
            'coverage',
            'dist',
            'test',
            'node_modules',
            'public',
            'pnpm-lock.yaml',
            'pnpm-workspace.yaml',
            '*.config.js',
            '*.json',
            'commitlint.config.js',
            'jest.preset.js',
            'jest.config.js',
            'dist/*',
            'tsconfig.json',
            'tsconfig.*.json',
        ],
    },

    eslintPluginPrettierRecommended,
    ...compat.config({ parser: 'jsonc-eslint-parser' }).map((config) => ({
        ...config,

        rules: {
            ...config.rules,
        },
    })),
    {
        files: ['*.ts', '*.tsx'],

        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            parser: typescriptParser,
            parserOptions: {
                extraFileExtensions: ['.json'],
                project: 'tsconfig.json',
                tsconfigRootDir: __dirname,
                sourceType: 'module',
            },
        },

        plugins: {
            '@typescript-eslint/eslint-plugin': eslintPlugin,
        },
        // root: true,

        rules: {
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            'prettier/prettier': [
                'error',
                {
                    trailingComma: 'all',
                    tabWidth: 4,
                    semi: true,
                    singleQuote: true,
                    bracketSpacing: true,
                    eslintIntegration: true,
                    printWidth: 120,
                },
            ],
        },
    },
];
