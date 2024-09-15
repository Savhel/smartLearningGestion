import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import EnvCompatible from 'vite-plugin-env-compatible';

export default defineConfig({
	plugins: [sveltekit(), EnvCompatible],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
