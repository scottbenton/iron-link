<script lang="ts">
	export let value: number;
	export let size = 24;
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 48 48"
	stroke="currentColor"
	stroke-linecap="round"
	stroke-width="4"
>
	{#if value >= 1}
		<path d="m38.621 38.621-29.241-29.241" />
	{/if}
	{#if value >= 2}
		<path d="m9.3795 38.621 29.241-29.241" />
	{/if}
	{#if value >= 3}
		<path d="m24 4.5259v38.948" />
	{/if}
	{#if value >= 4}
		<path d="m43.474 24h-38.948" />
	{/if}
</svg>
