<script lang="ts">
	import { faWarning } from '@fortawesome/free-solid-svg-icons';

	import IconFa from '../../common/IconFa.svelte';

	export let message: string;
	export let error: string;
	export let icon = faWarning;
</script>

<div class="flex flex-col gap-2 items-center">
	<IconFa {icon} class="w-16 h-16 text-warning" />
	<h2 class="text text-4xl text-base-content text-center">{message}</h2>
	<div class="text-error font-bold text-lg text-center mb-2">{error}</div>
</div>
