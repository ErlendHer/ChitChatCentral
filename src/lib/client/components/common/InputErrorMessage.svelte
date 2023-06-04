<script lang="ts">
	export let errorMessage: string;
	export let reserveSpaceForErrorMessage = false;
</script>

<p class="{!reserveSpaceForErrorMessage ? 'absolute' : ''} mt-1 text-sm font-medium text-red-600">
	{errorMessage}
</p>
