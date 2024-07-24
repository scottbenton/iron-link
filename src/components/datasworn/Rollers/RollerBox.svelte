<script lang="ts">
	export let label: string;
</script>

<div class="roller-box">
	<span class="text-base font-title">{label}</span>
	<slot />
</div>

<style lang="scss">
	.roller-box {
		background-color: $background-inset-alt;
		color: $text-secondary;
		border-radius: $border-radius;
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		padding: $space-1 0;
		min-width: 70px;
	}
</style>
