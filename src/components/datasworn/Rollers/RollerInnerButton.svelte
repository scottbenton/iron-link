<script lang="ts">
	import Button from '$components/common/Button.svelte';
	import RollIcon from 'virtual:icons/tabler/dice-5';
	import ResetIcon from 'virtual:icons/tabler/rotate-2';

	export let value: number;
	export let onClick: (() => void) | undefined = undefined;
	export let actionType: 'reset' | 'roll' | undefined = undefined;

	$: Icon = undefined as typeof ResetIcon | undefined;
	$: {
		if (actionType === 'reset') {
			Icon = ResetIcon;
		} else if (actionType === 'roll') {
			Icon = RollIcon;
		}
	}
</script>

{#if onClick}
	<div class="inner-button-container">
		<Button variant={'primary-gradient'} {onClick}>
			{#if Icon}
				<div class="roll-icon">
					<svelte:component this={Icon} font-size={'.75rem'} />
				</div>
			{/if}
			<span class="font-title text-xl">
				{value >= 0 ? '+' : '-'}{value}
			</span>
		</Button>
	</div>
{:else}
	<div class="inner-button">
		{#if Icon}
			<div class="roll-icon">
				<svelte:component this={Icon} font-size={'.75rem'} />
			</div>
		{/if}
		<span class="font-title text-xl">
			{value >= 0 ? '+' : '-'}{value}
		</span>
	</div>
{/if}

<style lang="scss">
	.inner-button {
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

		border: none;
		transition-property: background-color;
		transition-duration: 150ms;
		transition-timing-function: ease-in-out;
	}
	.roll-icon {
		position: absolute;
		top: $space-1;
		left: $space-1;
		color: $gray-300;
		margin-right: $space-1;
	}

	:global([data-theme='dark']) .inner-button {
		background-color: $gray-900;
	}

	:global([data-theme='dark']) button.inner-button:hover {
		background-color: $gray-700;
	}

	button.inner-button {
		cursor: pointer;
		&:hover {
			background-color: $gray-800;
		}
	}

	.inner-button-container {
		display: flex;
		align-items: stretch;
	}
	:global(.inner-button-container > button.button.primary-gradient) {
		padding: 0px !important;
		margin: 0px !important;
		border-radius: $border-radius !important;
		&::before {
			opacity: 0% !important;
		}
		&:hover {
			opacity: 100%;
			padding: 2px !important;
			margin: -2px !important;
			border-radius: calc($border-radius + 2px) !important;
			&::before {
				opacity: 100% !important;
			}
		}
	}
	:global(.inner-button-container > button.button.primary-gradient .content) {
		background-color: $gray-700 !important;
		width: 56px;
		height: 100%;
		padding: $space-1 $space-2 !important;

		// border-radius: 0px !important;
	}
	:global([data-theme='dark'] .inner-button-container .button.primary-gradient .content) {
		background-color: $gray-900 !important;
	}
</style>
