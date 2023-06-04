<script lang="ts">
	import { onEnter } from '../../global/utils/eventUtils';

	export let contentExpanded = false;
	export let title: string;

	const toggleContent = () => {
		contentExpanded = !contentExpanded;
	};
</script>

<div
	class="collapse-arrow rounded-box collapse collapse-{contentExpanded
		? 'open'
		: 'close'} border border-base-300 bg-base-100"
>
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div
		tabindex="0"
		class="collapse-title cursor-pointer text-xl font-medium"
		on:click={toggleContent}
		on:keydown={onEnter(toggleContent)}
	>
		{title}
	</div>
	<div class="collapse-content">
		<slot />
	</div>
</div>
