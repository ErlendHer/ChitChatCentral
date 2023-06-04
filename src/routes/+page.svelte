<script lang="ts">
	import WrapWithAuth from '$lib/client/components/common/WrapWithAuth.svelte';
	import HomeView from '$lib/client/components/views/home/HomeView.svelte';
</script>

<WrapWithAuth let:user let:userInfo>
	<HomeView />
</WrapWithAuth>
