<script lang="ts">
	import { Circle3 } from 'svelte-loading-spinners';

	export let size: 'small' | 'medium' | 'large';

	$: sizeNumber = size === 'small' ? 20 : size === 'medium' ? 40 : 60;
</script>

<Circle3 size={sizeNumber} />
