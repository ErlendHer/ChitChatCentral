<script lang="ts">
	import ChatView from './ChatView.svelte';
	import ProfileColumn from './ProfileColumn.svelte';
	import defaultProfileUrl from '$lib/assets/images/profile-blank.png';
	import type { ProfileInfo } from './rooms.types';
	import type { UserInfo as Profile } from '@cccApi/rooms';

	export let roomId: string;
	export let username: string;
	export let profiles: Profile[];
	export let participantsLoading: boolean;
	export let roomSecret: string;

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
	<ChatView {roomId} {username} {profileMap} {roomSecret} />
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
		>
			<button class="btn btn-outline btn-primary">Invite living being 🔥</button>
		</ProfileColumn>
	{:else}
		<ProfileColumn profiles={rightProfiles} {participantsLoading} />
	{/if}
</div>
