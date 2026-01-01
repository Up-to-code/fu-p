import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        alias: {
            '@': path.resolve(__dirname, './'),
        },
        env: {
            DATABASE_URL: 'postgres://localhost:5432/dummy',
        },
        include: ['tests/**/*.test.ts'],
        exclude: ['**/node_modules/**', '**/dist/**', '**/tests/**/*.spec.ts'],
    },
});
