<script lang="ts">
	import { page } from '$app/stores';
	import IconButton from '$lib/client/components/common/IconButton.svelte';
	import IconButtonWithLoadingSpinner from '$lib/client/components/common/IconButtonWithLoadingSpinner.svelte';
	import InputWithErrorMessage from '$lib/client/components/common/InputWithErrorMessage.svelte';
	import defaultProfileUrl from '$lib/assets/images/profile-blank.png';
	import Modal from '$lib/client/components/common/Modal.svelte';
	import type {
		Request_AddParticipant,
		Request_ToggleOpenToPublic,
		RoomsResponses,
		UserInfo
	} from '@cccApi/rooms';
	import { faCopy, faFloppyDisk, faPlus } from '@fortawesome/free-solid-svg-icons';
	import type { RoomInfo } from '../RoomView.svelte';
	import { cccApiPOST } from '$lib/client/utils/apiUtils';
	import { openErrorToast, openSuccessToast } from '$lib/client/toast';
	import SimpleLoadingSpinner from '$lib/client/components/common/SimpleLoadingSpinner.svelte';
	import { validateNotEmpty } from '$lib/client/utils/validator.util';
	import { triggerUpdate } from '../messages/roomMessages.store';

	export let open: boolean;
	export let roomInfo: RoomInfo;
	export let participants: UserInfo[];

	let url = 'https://ccc.dev/';

	let publicToggleLoading = false;
	let updateMemberLoading = false;
	let addMemberValid = true;

	let userToAdd = '';

	async function copyToClipboard() {
		await navigator.clipboard.writeText(url);
	}

	$: url = `${$page.url.origin}/rooms/${roomInfo.roomId}`;
	let openToPublic = !roomInfo.requireInvite;

	type CheckboxEvent = MouseEvent & {
		target: EventTarget & HTMLInputElement;
	};

	const handlePublicToggleClick = async (event: Event) => {
		const e = event as CheckboxEvent;
		try {
			openToPublic = !openToPublic;
			setTimeout(() => (e.target.checked = openToPublic), 0);

			publicToggleLoading = true;
			const toggleResult = await cccApiPOST<
				RoomsResponses['[id]/toggleOpenToPublic'],
				Request_ToggleOpenToPublic
			>(`/rooms/${roomInfo.roomId}/toggleOpenToPublic`, {
				openToPublic
			});

			if (!toggleResult.success) {
				openToPublic = !openToPublic; // Revert the toggle as the request failed
				setTimeout(() => (e.target.checked = openToPublic), 0);
				openErrorToast("Failed to change room's public status, are you the owner?");
			} else {
				openSuccessToast(`Room is now ${openToPublic ? 'open to everyone' : 'invite only'}`);
			}
		} catch (err) {
			console.error(err);
			openErrorToast("Failed to change room's public status, are you the owner?");
		} finally {
			publicToggleLoading = false;
		}
	};

	const updateMember = async (status: 'add' | 'remove', username: string) => {
		try {
			updateMemberLoading = true;
			const addMemberResult = await cccApiPOST<
				RoomsResponses['[id]/participants/add'],
				Request_AddParticipant
			>(`/rooms/${roomInfo.roomId}/participants/${status}`, {
				username: username
			});

			if (!addMemberResult.success) {
				if (status === 'add' && addMemberResult.error.statusCode === 404) {
					openErrorToast('Failed to add member: User not found');
				} else {
					openErrorToast(`Failed to ${status} member`);
				}
			} else {
				if (status === 'add') {
					userToAdd = '';
					openSuccessToast(`Member added to room!`);
				} else {
					openSuccessToast(`Member removed from room!`);
				}

				triggerUpdate(roomInfo.secret, roomInfo.roomId);
			}
		} catch (err) {
			console.error(err);
			openErrorToast('Failed to add member, are you the owner?');
		} finally {
			updateMemberLoading = false;
		}
	};
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
					class="text-base-content bg-white p-1 border-2 border-secondary rounded-lg outline-none sm:w-[280px]"
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
				<input
					type="checkbox"
					class="toggle toggle-primary"
					checked={openToPublic}
					on:click|preventDefault={(e) => handlePublicToggleClick(e)}
				/>

				{#if publicToggleLoading}
					<SimpleLoadingSpinner size="small" />
				{/if}
			</label>
		</div>

		<div class="w-full flex justify-center">
			<div class="divider w-full m-0 max-w-[80%]" />
		</div>

		<div class="flex flex-col items-center gap-2">
			<div class="text-accent text-md md:text-lg lg:text-xl 2xl:text-2xl font-semibold">
				Room Members
			</div>

			<div class="flex flex-row items-center justify-center gap-4 flex-wrap">
				{#each participants as participant (participant.username)}
					<div class="flex flex-row items-center gap-2">
						<img
							src={participant.profileUrl ?? defaultProfileUrl}
							alt={participant.displayName}
							class="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full object-cover"
						/>
						<div class="flex flex-col items-center justify-center">
							<div class="font-BubbleGumSans text-lg text-center text-accent break-words">
								{participant.displayName}
							</div>
							{#if participant.username !== roomInfo.creator}
								<button
									class="text text-error font-semibold text-xs"
									on:click={() => updateMember('remove', participant.username)}>Remove</button
								>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			<div class="flex flex-row items-end -mt-2">
				<InputWithErrorMessage
					id="roomParticipantInput"
					labelText="Add Member"
					bind:value={userToAdd}
					placeholder="Bob9000"
					bind:isValid={addMemberValid}
					validator={validateNotEmpty}
					showErrorMessage={false}
				/>
				<IconButtonWithLoadingSpinner
					icon={faPlus}
					text=""
					disabled={updateMemberLoading || !addMemberValid}
					onClick={() => updateMember('add', userToAdd)}
				/>
			</div>

			{#if updateMemberLoading}
				<SimpleLoadingSpinner size="small" />
			{/if}
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
