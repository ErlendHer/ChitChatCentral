<script>
	import { goto } from '$app/navigation';
	import IconButtonWithLoadingSpinner from '$lib/client/components/common/IconButtonWithLoadingSpinner.svelte';
</script>

<div class="flex flex-col items-center gap-2">
	<div class="text text-warning text-3xl text-center">Not Found</div>
	<p class="text text-lg text-base-content">We could not find the page you're looking for 😔</p>
	<IconButtonWithLoadingSpinner text="Go Home" onClick={() => goto('/')} />
</div>
