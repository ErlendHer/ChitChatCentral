<script lang="ts">
	import { page } from '$app/stores';
	import IconButton from '$lib/client/components/common/IconButton.svelte';
	import IconButtonWithLoadingSpinner from '$lib/client/components/common/IconButtonWithLoadingSpinner.svelte';
	import InputWithErrorMessage from '$lib/client/components/common/InputWithErrorMessage.svelte';
	import Modal from '$lib/client/components/common/Modal.svelte';
	import type { UserInfo } from '@cccApi/rooms';
	import { faCopy, faFloppyDisk, faPlus } from '@fortawesome/free-solid-svg-icons';
	import type { RoomInfo } from '../RoomView.svelte';

	export let open: boolean;
	export let roomInfo: RoomInfo;
	export let participants: UserInfo[];

	let url = 'https://ccc.dev/';

	async function copyToClipboard() {
		await navigator.clipboard.writeText(url);
	}

	$: if (participants.length === 1) {
		// Write function that temporarily 10x all the participants from the first element
		for (let i = 0; i < 10; i++) {
			participants.push({ ...participants[0], username: `${participants[0].username}#${i}` });
		}
	}

	$: console.log($page);
	$: url = `${$page.url.origin}/rooms/${roomInfo.roomId}`;
</script>

<Modal bind:open class="!max-w-2xl">
	<div class="flex flex-col items-center justify-center gap-2 md:gap-3 xl:gap-4">
		<div class="text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-BubbleGumSans text-accent">
			Configure {roomInfo.name}
		</div>
		<div class="flex flex-col items-center text-center">
			<div class="text-base-content text-md md:text-lg lg:text-xl 2xl:text-2xl">Room Code</div>
			<div class="text-base-content font-bold text-xl md:text-2xl lg:text-3xl 2xl:text-4xl">
				{roomInfo.roomId}
			</div>
		</div>
		<div class="flex flex-row gap-2 items-center w-full flex-wrap justify-center">
			<div class="text-accent text-md md:text-lg lg:text-xl font-semibold">Invite Link</div>
			<div class="flex flex-row items-center gap-2">
				<input
					class="text-base-content bg-white p-1 border-2 border-secondary rounded-lg outline-none sm:w-[265px]"
					type="text"
					value={url}
					readonly
				/>
				<IconButton icon={faCopy} onClick={() => copyToClipboard()} />
			</div>
		</div>
		<div class="form-control">
			<label class="label cursor-pointer flex flex-row gap-2 items-center justify-center">
				<span
					class="text-accent text-md md:text-lg lg:text-xl font-semibold tooltip"
					data-tip="If enabled, everybody can join your room without invite">Open to public</span
				>
				<input type="checkbox" class="toggle toggle-primary" checked />
			</label>
		</div>

		<div class="w-full flex justify-center">
			<div class="divider w-full m-0 max-w-[80%]" />
		</div>

		<div class="flex flex-col items-center gap-2">
			<div class="text-accent text-md md:text-lg lg:text-xl 2xl:text-2xl font-semibold">
				Room Members
			</div>

			<div class="flex flex-row items-center justify-center gap-2 flex-wrap">
				{#each participants as participant (participant.username)}
					<div class="flex flex-row items-center gap-2">
						<img
							src={participant.profileUrl}
							alt={participant.displayName}
							class="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full object-cover"
						/>
						<div class="font-BubbleGumSans text-lg text-center text-accent break-words">
							{participant.displayName}
						</div>
					</div>
				{/each}
			</div>

			<div class="flex flex-row items-end -mt-2">
				<InputWithErrorMessage
					id="roomParticipantInput"
					labelText="Add Member"
					value=""
					placeholder="Bob9000"
				/>
				<IconButtonWithLoadingSpinner icon={faPlus} text="" />
			</div>
		</div>

		<div class="flex flex-row mt-2 w-full">
			<IconButtonWithLoadingSpinner
				text="Done"
				icon={faFloppyDisk}
				class="flex-1"
				onClick={() => (open = false)}
			/>
		</div>
	</div>
</Modal>
