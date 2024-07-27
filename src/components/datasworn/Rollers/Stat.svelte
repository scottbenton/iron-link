<script lang="ts">
	import RollerBox from './RollerBox.svelte';
	import RollIcon from 'virtual:icons/tabler/dice-5';

	export let label: string;
	export let value: number = 0;

	export let onClick: (() => void) | undefined = undefined;
</script>

<RollerBox {label}>
	<div class="stat-content">
		{#if onClick === undefined}
			<span class="value font-title text-xl">
				<div class="roll-icon">
					<RollIcon font-size=".75rem" />
				</div>
				{value >= 0 ? '+' : '-'}{value}
			</span>
		{:else}
			<button type="button" class="value font-title text-xl" on:click={() => onClick()}>
				<div class="roll-icon">
					<RollIcon font-size=".75rem" />
				</div>
				{value >= 0 ? '+' : '-'}
				{value}
			</button>
		{/if}
	</div>
</RollerBox>

<style lang="scss">
	.stat-content {
		display: flex;
		align-items: stretch;
		padding: 0px $space-3;
		.value {
			border-radius: $border-radius;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-grow: 1;
			background-color: $gray-700;
			color: #fff;
			width: 56px;
			padding: $space-1 $space-2;
			position: relative;

			.roll-icon {
				position: absolute;
				top: $space-1;
				left: $space-1;
				color: $gray-300;
				margin-right: $space-1;
			}
		}
	}
	:global([data-theme='dark']) {
		.stat-content .value {
			background-color: $gray-900;
		}
	}
</style>
