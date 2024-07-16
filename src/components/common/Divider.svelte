<div class="divider">
	<span class="font-title">
		<slot />
	</span>
</div>

<style lang="scss">
	.divider {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 1rem 0;
		align-self: stretch;

		&::before,
		&::after {
			content: '';
			flex: 1;
			border-bottom: 1px solid $divider;
		}

		span {
			background-color: $gray-700;
			color: #fff;
			border-radius: 9999px;
			min-width: $space-8;
			min-height: $space-8;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0 $space-4;
		}
	}
</style>
