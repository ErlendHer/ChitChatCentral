<script lang="ts" context="module">
	import { openErrorToast } from '$lib/client/toast';
	import { cccApiGET } from '$lib/client/utils/apiUtils';
	import type { CognitoUser } from '@aws-amplify/auth';
	import type { Response_GetRoom, Response_Participants, RoomsResponses } from '@cccApi/rooms';
	import { onMount } from 'svelte';
	import ChatViewWithProfiles from './ChatViewWithProfiles.svelte';

	export type RoomInfo = Response_GetRoom;
	export type ParticipantInfo = Response_Participants;
</script>

<script lang="ts">
	export let roomInfo: RoomInfo;
	export let user: CognitoUser;

	let participantInfo: ParticipantInfo | undefined = undefined;
	let participantsLoading = false;

	async function fetchRoomInfo() {
		try {
			participantsLoading = true;
			const roomInfoResult = await cccApiGET<RoomsResponses['[id]/participants']>(
				`/rooms/${roomInfo.roomId}/participants`
			);

			if (!roomInfoResult.success) throw new Error(roomInfoResult.error.messageWithCode);

			participantInfo = roomInfoResult.data.data;
		} catch (err) {
			console.error(err);
			openErrorToast(`${(err as Error).message}`);
		} finally {
			participantsLoading = false;
		}
	}

	onMount(async () => {
		await fetchRoomInfo();
	});
</script>

<div class="flex flex-col items-center w-full h-full">
	<h2 class="font-BubbleGumSans text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl text-secondary">
		{roomInfo.name}
	</h2>
	<ChatViewWithProfiles
		profiles={participantInfo?.participants ?? []}
		{participantsLoading}
		roomId={roomInfo.roomId}
		username={user.getUsername()}
	/>
</div>
