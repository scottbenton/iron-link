<script lang="ts">
	export let id: string;
	export let label: string;
	export let value: string;
	export let onChange: (value: string) => void = () => {};

	const handleInputChange = (
		event: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		onChange(event.currentTarget.value);
	};
</script>

<div class="input-container">
	<label class="text-sm" for={id}>{label}</label>
	<div class="input-box text-base">
		<input type="text" {id} name={id} bind:value on:change={handleInputChange} />
		{#if $$slots.endAction}
			<div class="input-action">
				<slot name="endAction" />
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.input-container {
		label {
			font-weight: 600;
			color: $text-secondary;
		}
	}
	.input-box {
		display: flex;
		align-items: center;
		border: 1px solid $divider;
		border-radius: $border-radius;

		transition-property: border-color;
		transition-duration: 150ms;
		transition-timing-function: ease-in-out;

		input {
			padding: $space-3 $space-4;
			flex-grow: 1;
			border: none;
			background: transparent;
			outline: none;
		}

		.input-action {
			padding-right: $space-1;
		}

		&:focus-within {
			border-color: $primary-500;
		}
	}
</style>
