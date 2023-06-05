<script lang="ts">
	import ChatView from './ChatView.svelte';
	import ProfileColumn from './ProfileColumn.svelte';
	import defaultProfileUrl from '$lib/assets/images/profile-blank.png';
	import type { ProfileInfo } from './rooms.types';

	export let roomId: string;
	export let username: string;
	export let profiles: ProfileInfo[];
	export let participantsLoading: boolean;

	$: profileMap = new Map<string, ProfileInfo>(
		profiles.map((p) => [
			p.username,
			{
				username: p.username,
				displayName: p.displayName ?? p.username,
				profileUrl: p.profileUrl ?? defaultProfileUrl
			}
		])
	);

	$: leftProfiles = profiles.filter((_, i) => i % 2 === 0);
	$: rightProfiles = profiles.filter((_, i) => i % 2 !== 0);
</script>

<div class="flex flex-row w-full h-full justify-center gap-8">
	<ProfileColumn profiles={leftProfiles} {participantsLoading} />
	<ChatView {roomId} {username} {profileMap} />
	{#if rightProfiles.length === 0}
		<ProfileColumn
			profiles={[
				{
					username: 'placeholder',
					displayName: 'Ghost 👻',
					profileUrl: defaultProfileUrl
				}
			]}
			{participantsLoading}
		/>
	{:else}
		<ProfileColumn profiles={rightProfiles} {participantsLoading} />
	{/if}
</div>
