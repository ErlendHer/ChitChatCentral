<script>
	import WrapWithAuth from '$lib/client/components/common/WrapWithAuth.svelte';
	import ProfileView from '$lib/client/components/views/profile/ProfileView.svelte';
</script>

<WrapWithAuth let:user let:userInfo>
	<ProfileView {user} {userInfo} />
</WrapWithAuth>
