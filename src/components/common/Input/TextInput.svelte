<script lang="ts">
	export let id: string;
	export let label: string;
	export let value: string | number;
	export let required: boolean = false;
	export let error: boolean = false;
	export let helperText: string | undefined = undefined;
	export let onChange: (value: string) => void = () => {};

	const handleInputChange = (
		event: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		onChange(event.currentTarget.value);
	};
</script>

<div class="input-container" class:error>
	<label class="text-sm" for={id}>{label}{required ? '*' : ''}</label>
	<div class="input-box text-base">
		{#if value === 'number'}
			<input
				{required}
				type="number"
				{id}
				name={id}
				bind:value
				on:change={handleInputChange}
				inputmode="numeric"
			/>
		{:else}
			<input type="text" {id} name={id} bind:value on:change={handleInputChange} />
		{/if}
		{#if $$slots.endAction}
			<div class="input-action">
				<slot name="endAction" />
			</div>
		{/if}
	</div>
	{#if helperText?.trim()}<p class="helper-text text-sm">{helperText}</p>{/if}
</div>

<style lang="scss">
	.input-container {
		label {
			font-weight: 600;
			color: $text-secondary;
		}
	}
	.input-container.error {
		label {
			color: $error-600;
		}
		.input-box {
			border-color: $error-600;
		}
		.helper-text {
			color: $error-600;
		}
	}
	:global(.input-container.error) {
		label {
			color: $error-500;
		}
		.input-box {
			border-color: $error-500;
		}
		.helper-text {
			color: $error-500;
		}
	}
	.helper-text {
		margin-top: $space-1;
		color: $text-secondary;
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
			color: $text-primary;
			padding: $space-3 $space-4;
			flex-grow: 1;
			border: none;
			background: transparent;
			outline: none;
		}

		.input-action {
			padding-right: $space-1;
			flex-shrink: 0;
		}

		&:focus-within {
			border-color: $primary-500;
		}
	}
</style>
