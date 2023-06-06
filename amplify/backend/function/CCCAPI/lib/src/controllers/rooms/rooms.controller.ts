import type { Handler, Request } from 'express';
import Joi from 'joi';
import { Request_AddParticipant, Request_SendMessage, Request_ToggleOpenToPublic, Response_AddParticipant, Response_CreateRoom, Response_GetMessages, Response_GetRoom, Response_Participants, Response_SendMessage, Response_ToggleOpenToPublic } from 'lib/shared/rooms';
import * as Nanoid from 'nanoid';
import { executeGQLRequest } from '../../core/graphqlRequest';
import { ExpressError, err } from '../../error/error';
import type { VerifiedReq } from '../../middleware/authentication.middleware';
import { build } from '../controller.types';
import { fetchUsersInfo, getUserSub } from './fetchUserInformation';
import { CreateMessageVariables, CreateRoomVariables, GQL_RESPONSE_UpdateRoom, GQL_RESPONSE_createMessage, GQL_RESPONSE_getMessages, GQL_RESPONSE_getRoom, GetAllMessagesAfterVariables, GetAllMessagesVariables, GetRoomData, GetRoomVariables, ToggleOpenToPublicVariables, UpdateParticipantsVariables, createMessageQuery, createRoomMutation, getAllMessagesQuery, getMessagesAfterDateQuery, getRoomQuery, updateRoomQuery } from './rooms.queries';

const nanoid = Nanoid.customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 5);

const rooms: Handler = (req, res) => {
  res.json({ success: 'Yes', url: req.url });
}


const createRoom = build<Response_CreateRoom>(async (req) => {
  const id = nanoid(5);
  const user = (req as VerifiedReq).user;

  const gqlResult = await executeGQLRequest<CreateRoomVariables>(createRoomMutation, {
    input: {
      creator: user.username,
      creatorSub: user.sub,
      id,
      name: `${user.displayName ?? user.username}'s room`,
      participants: [user.sub],
      requireInvite: true,
      secret: nanoid(32),
    }
  })


  if (!gqlResult.success) {
    return err(new Error(gqlResult.error), 500);
  }

  return {
    data: {
      roomId: id
    }
  }
});

const getRoomInfo = build<Response_GetRoom>(async (req) => {
  const gqlRoomInfoResult = await getGQLRoomData(req);

  if (!gqlRoomInfoResult.success) {
    return gqlRoomInfoResult.error;
  }

  const { roomData } = gqlRoomInfoResult.data;

  const userSub = (req as VerifiedReq).user.sub;

  // If the user enters a public room but is not listed as a member yet, update the database
  if (!roomData.participants.includes(userSub)) {
    const gqlResult = await executeGQLRequest<UpdateParticipantsVariables, GQL_RESPONSE_UpdateRoom>(updateRoomQuery, {
      input: {
        id: roomData.id,
        participants: [...roomData.participants, userSub]
      }
    });

    if (!gqlResult.success) {
      return err(new Error(gqlResult.error), 500);
    }
  };

  return {
    data: {
      creator: roomData.creator,
      name: roomData.name,
      requireInvite: roomData.requireInvite,
      createdAt: roomData.createdAt,
      roomId: roomData.id,
      secret: roomData.secret,
    }
  }
});

const getParticipants = build<Response_Participants>(async (req) => {
  const gqlRoomInfoResult = await getGQLRoomData(req);

  if (!gqlRoomInfoResult.success) {
    return gqlRoomInfoResult.error;
  }

  const { participants } = gqlRoomInfoResult.data;

  const participantsToFetch = participants
  // .filter((p) => p !== roomData.creator)
  // Uncomment the above line to remove the creator from the list of participants

  const result = await fetchUsersInfo(participantsToFetch);

  if (!result.success) {
    return err(new Error(result.error), 500);
  }

  return {
    data: {
      participants: result.data
    }
  };
});

const sendMessageSchema = Joi.object({
  timestamp: Joi.string().required(),
  message: Joi.string().required(),
})

const sendMessage = build<Response_SendMessage>(async (req) => {
  // Validate request body
  const { error } = sendMessageSchema.validate(req.body);

  if (error) {
    return err(new Error(error.message), 400);
  }

  const { timestamp, message } = req.body as Request_SendMessage;

  const gqlRoomInfoResult = await getGQLRoomData(req);

  if (!gqlRoomInfoResult.success) {
    return gqlRoomInfoResult.error;
  }

  const user = (req as VerifiedReq).user;
  const { roomData } = gqlRoomInfoResult.data;

  const gqlResult = await executeGQLRequest<CreateMessageVariables, GQL_RESPONSE_createMessage>(createMessageQuery, {
    input: {
      username: user.username,
      time: timestamp,
      content: message,
      roomId: roomData.id,
    }
  })

  if (!gqlResult.success) {
    return err(new Error(gqlResult.error), 500);
  }

  const data = gqlResult.data.data.createMessage;

  if (!data) {
    return err(new Error("Failed to create message: empty GQl response"), 500);
  }

  return {
    data: {
      messageId: data.id,
      content: data.content,
      roomId: data.roomId,
      time: data.time,
      username: data.username,
    }
  }
});

const listMessages = build<Response_GetMessages>(async (req) => {
  const gqlRoomInfoResult = await getGQLRoomData(req);

  if (!gqlRoomInfoResult.success) {
    return gqlRoomInfoResult.error;
  }

  const { roomData } = gqlRoomInfoResult.data;

  const messagesVariables = {
    roomId: roomData.id,
    limit: req.query.limit ? Number(req.query.limit) : 100,
  }

  const after = req.query.after;

  if (typeof after === "string" && !isNaN(Date.parse(after))) {
    return err(new Error("Invalid after date"), 400);
  }

  const gqlResult = await (after ?
    executeGQLRequest<GetAllMessagesAfterVariables, GQL_RESPONSE_getMessages>(getMessagesAfterDateQuery, {
      ...messagesVariables,
      after: after as string,
    })
    :
    executeGQLRequest<GetAllMessagesVariables, GQL_RESPONSE_getMessages>(getAllMessagesQuery, messagesVariables)
  )

  if (!gqlResult.success) {
    return err(new Error(gqlResult.error), 500);
  }

  return {
    data: {
      messages: gqlResult.data.data.messagesByRoomIdAndTime.items
    }
  }
});

const toggleOpenSchema = Joi.object({
  openToPublic: Joi.boolean().required(),
})

const toggleOpenToPublic = build<Response_ToggleOpenToPublic>(async (req) => {
  const { error } = toggleOpenSchema.validate(req.body);

  if (error) {
    return err(new Error(error.message), 400);
  }

  const gqlRoomInfoResult = await getGQLRoomData(req);

  if (!gqlRoomInfoResult.success) {
    return gqlRoomInfoResult.error;
  }

  const { openToPublic } = req.body as Request_ToggleOpenToPublic

  const { roomData } = gqlRoomInfoResult.data;

  const gqlResult = await executeGQLRequest<ToggleOpenToPublicVariables, GQL_RESPONSE_UpdateRoom>(updateRoomQuery, {
    input: {
      id: roomData.id,
      requireInvite: !openToPublic
    }
  });

  if (!gqlResult.success) {
    return err(new Error(gqlResult.error), 500);
  }

  const data = gqlResult.data.data.updateRoom;

  if (!data) {
    return err(new Error("Failed to update room: empty GQl response"), 500);
  }

  return {
    data: {
      roomId: data.id,
      requireInvite: data.requireInvite,
      createdAt: data.createdAt,
      name: data.name,
      secret: data.secret,
      creator: data.creator,
    }
  }
});

const participantSchema = Joi.object({
  username: Joi.string().required(),
})


const updateParticipant = (update: "add" | "remove") => {
  return build<Response_GetRoom>(async (req) => {
    const { error } = participantSchema.validate(req.body);

    if (error) {
      return err(new Error(error.message), 400);
    }
    const { username } = req.body as Request_AddParticipant;

    const gqlRoomInfoResult = await getGQLRoomData(req);

    if (!gqlRoomInfoResult.success) {
      return gqlRoomInfoResult.error;
    }

    const { roomData } = gqlRoomInfoResult.data;


    const userSub = await getUserSub(username);

    if (!userSub.success) {
      console.error(userSub.error);
      return err(new Error("User not found"), 404);
    }

    const oldParticipants = roomData.participants;
    const newParticipants = update === "add"
      ? [...oldParticipants, userSub.data]
      : oldParticipants.filter((p) => p !== userSub.data);



    const gqlResult = await executeGQLRequest<UpdateParticipantsVariables, GQL_RESPONSE_UpdateRoom>(updateRoomQuery, {
      input: {
        id: roomData.id,
        participants: newParticipants
      }
    });

    if (!gqlResult.success) {
      return err(new Error(gqlResult.error), 500);
    }

    const data = gqlResult.data.data.updateRoom;

    if (!data) {
      return err(new Error("Failed to update room: empty GQl response"), 500);
    }

    return {
      data: {
        roomId: data.id,
        requireInvite: data.requireInvite,
        createdAt: data.createdAt,
        name: data.name,
        secret: data.secret,
        creator: data.creator,
      }
    }

  });
}



export type getGqlRoomDataResult = {
  success: true,
  data: { roomData: GetRoomData, participants: string[] }
} |
{
  success: false,
  error: ExpressError,
}

async function getGQLRoomData(req: Request): Promise<getGqlRoomDataResult> {
  const user = (req as VerifiedReq).user;
  const roomId = req.params.roomId;

  if (!roomId) {
    return { success: false, error: err(new Error("No room id provided"), 400) };
  }

  // Fetch room info using GQL
  const gqlResult = await executeGQLRequest<GetRoomVariables, GQL_RESPONSE_getRoom>(getRoomQuery, {
    id: roomId
  });

  if (!gqlResult.success) {
    return { success: false, error: err(new Error(gqlResult.error), 500) };
  }

  const gqlData = gqlResult.data.data.getRoom;

  if (!gqlData) {
    return { success: false, error: err(new Error("Room not found"), 404) };
  }

  const participantSubs = gqlData.participants

  if (gqlData.requireInvite && !participantSubs.includes(user.sub)) {
    return { success: false, error: err(new Error("You are not a participant of this room"), 403) };
  };

  return {
    success: true,
    data: {
      roomData: gqlData,
      participants: participantSubs
    }
  }
}



export {
  rooms,
  createRoom,
  getRoomInfo,
  getParticipants,
  listMessages,
  sendMessage,
  toggleOpenToPublic,
  updateParticipant,
};

