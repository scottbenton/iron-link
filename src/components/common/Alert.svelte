<script lang="ts">
	import InfoIcon from 'virtual:icons/tabler/info-circle';
	import WarningIcon from 'virtual:icons/tabler/alert-triangle';
	import ErrorIcon from 'virtual:icons/tabler/alert-circle';
	import SuccessIcon from 'virtual:icons/tabler/circle-check';

	export let type: 'info' | 'warning' | 'error' | 'success' = 'info';
</script>

<div class={`alert ${type}`}>
	<div class="alert-icon">
		{#if type === 'info'}
			<InfoIcon />
		{:else if type === 'warning'}
			<WarningIcon />
		{:else if type === 'error'}
			<ErrorIcon />
		{:else if type === 'success'}
			<SuccessIcon />
		{/if}
	</div>
	<div>
		{#if $$slots['alert-title']}
			<h2 class="alert-title"><slot name="alert-title" /></h2>
		{/if}
		<p class="alert-message text-sm">
			<slot />
		</p>
	</div>
</div>

<style lang="scss">
	.alert {
		display: flex;
		align-items: flex-start;
		&.info {
			background-color: $info-100;
			color: $info-900;
			.alert-title {
				color: $info-900;
			}
			.alert-icon {
				color: $info-500;
			}
		}
		&.error {
			background-color: $error-100;
			color: $error-900;
			.alert-title {
				color: $error-900;
			}
			.alert-icon {
				color: $error-500;
			}
		}
		&.warning {
			background-color: $warning-100;
			color: $warning-900;
			.alert-title {
				color: $warning-900;
			}
			.alert-icon {
				color: $warning-500;
			}
		}
		&.success {
			background-color: $success-100;
			color: $success-900;
			.alert-title {
				color: $success-900;
			}
			.alert-icon {
				color: $success-500;
			}
		}
		padding: $space-4;
		border-radius: $border-radius;
		.alert-title {
			font-weight: 600;
		}
		.alert-icon {
			font-size: 1.25rem;
			margin-right: $space-4;
			flex-shrink: 0;
		}
	}
</style>
