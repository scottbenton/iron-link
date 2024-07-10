<style>
	:global(body) {
		--gray-50: #f9fafb;
		--gray-100: #f3f4f6;
		--gray-200: #e5e7eb;
		--gray-300: #d1d5db;
		--gray-400: #9ca3af;
		--gray-500: #6b7280;
		--gray-600: #4b5563;
		--gray-700: #374151;
		--gray-800: #1f2937;
		--gray-900: #111827;
		--gray-950: #030712;

		--primary-50: #f9fafb;
		--primary-100: #f3f4f6;
		--primary-200: #e5e7eb;
		--primary-300: #d1d5db;
		--primary-400: #9ca3af;
		--primary-500: #6b7280;
		--primary-600: #4b5563;
		--primary-700: #374151;
		--primary-800: #1f2937;
		--primary-900: #111827;
		--primary-950: #030712;

		/* --primary-50: #f5f3ff;
		--primary-100: #ede9fe;
		--primary-200: #ddd6fe;
		--primary-300: #c4b5fd;
		--primary-400: #a78bfa;
		--primary-500: #8b5cf6;
		--primary-600: #7c3aed;
		--primary-700: #6d28d9;
		--primary-800: #5b21b6;
		--primary-900: #4c1d95;
		--primary-950: #2e1065; */

		--error-50: #fef2f2;
		--error-100: #fee2e2;
		--error-200: #fecaca;
		--error-300: #fca5a5;
		--error-400: #f87171;
		--error-500: #ef4444;
		--error-600: #dc2626;
		--error-700: #b91c1c;
		--error-800: #991b1b;
		--error-900: #7f1d1d;
		--error-950: #450a0a;

		--space-0: 0px;
		--space-px: 1px;
		--space-0_5: 0.125rem;
		--space-1: 0.25rem;
		--space-1_5: 0.375rem;
		--space-2: 0.5rem;
		--space-2_5: 0.625rem;
		--space-3: 0.75rem;
		--space-3_5: 0.875rem;
		--space-4: 1rem;
		--space-5: 1.25rem;
		--space-6: 1.5rem;
		--space-7: 1.75rem;
		--space-8: 2rem;

		--background-default: var(--gray-100);
		--background-default-text: var(--gray-800);
		--background-surface: #fff;
		--background-surface-default-text: var(--gray-800);

		--divider-color: var(--gray-400);

		min-height: 100vh;
		background-color: var(--background-surface);
		color: var(--background-default-text);

		--border-radius: var(--space-3);

		--gradient-bg: radial-gradient(142% 91% at 111% 84%, #14b8a6 20%, #ff6584 80%);
		/* --gradient-bg: linear-gradient(90deg, #1cb5e0 0%, #000851 100%); */
		/* --gradient-bg: linear-gradient(90deg, #fc466b 0%, #3f5efb 100%); */
	}

	:global(.text-xs) {
		font-size: 0.75rem;
		line-height: 1rem;
	}
	:global(.text-sm) {
		font-size: 0.875rem; /* 14px */
		line-height: 1.25rem; /* 20px */
	}
	:global(.text-base) {
		font-size: 1rem;
		line-height: 1.5rem;
	}
	:global(.text-lg) {
		font-size: 1.125rem;
		line-height: 1.75rem;
	}
	:global(.text-xl) {
		font-size: 1.25rem;
		line-height: 1.75rem;
	}
	:global(.text-2xl) {
		font-size: 1.5rem;
		line-height: 2rem;
	}
	:global(.text-3xl) {
		font-size: 1.875rem;
		line-height: 2.25rem;
	}
	:global(.text-4xl) {
		font-size: 2.25rem;
		line-height: 2.5rem;
	}
	:global(.text-5xl) {
		font-size: 3rem;
		line-height: 1;
	}

	:global(.font-title) {
		font-family: 'Barlow Condensed', sans-serif;
		text-transform: uppercase;
		font-weight: 600;
	}

	:global(body) {
		font-family: 'Inter Variable', sans-serif;
		font-size: 16px;
		color: var(--gray-800);
	}

	/* main {
		max-width: 1280px;
		margin: 0px auto;
		padding: 0px var(--space-3);
		min-height: 100lvh;
	} */
</style>
