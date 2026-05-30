import { configs as jsConfigs } from '@eslint/js';
import { globalIgnores } from 'eslint/config';
import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import prettier from 'eslint-plugin-prettier';
import sis from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import { configs as tsConfigs } from 'typescript-eslint';

export default defineConfig([
    globalIgnores(['dist', 'prisma']),
    jsConfigs.recommended,
    ...tsConfigs.strict,
    prettierConfig,
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        plugins: { prettier, sis },
        languageOptions: { globals: globals.node },
        rules: {
            'prettier/prettier': 'error',
            'sis/imports': 'error',
            'sis/exports': 'error',
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/explicit-member-accessibility': 'error',
            '@typescript-eslint/method-signature-style': 'error',
            '@typescript-eslint/unified-signatures': 'off',
        },
    },
]);
