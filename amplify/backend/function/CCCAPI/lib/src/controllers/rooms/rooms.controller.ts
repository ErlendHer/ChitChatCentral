import type { Handler } from 'express';
import type { VerifiedReq } from 'lib/src/middleware/authentication.middleware';
import * as Nanoid from 'nanoid';
import { executeGQLRequest } from '../../core/graphqlRequest';
import { err } from '../../error/error';
import { CreateRoomVariables, GQL_RESPONSE_getRoom, GetRoomVariables, createRoomMutation, getRoomQuery } from './rooms.queries';
import { build } from '../controller.types';
import { Response_CreateRoom, Response_GetRoom } from 'lib/shared/rooms';

const nanoid = Nanoid.customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 5);

const rooms: Handler = (req, res) => {
  res.json({ success: 'Yes', url: req.url });
}

// const createRoomBodySchema = Joi.object({
//   username: Joi.string().required(),
// })

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
      requireInvite: true
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
  const user = (req as VerifiedReq).user;
  const roomId = req.params.roomId;

  if (!roomId) {
    return err(new Error("No room id provided"), 400);
  }

  // Fetch room info using GQL
  const gqlResult = await executeGQLRequest<GetRoomVariables, GQL_RESPONSE_getRoom>(getRoomQuery, {
    id: roomId
  });

  console.log(gqlResult);

  if (!gqlResult.success) {
    return err(new Error(gqlResult.error), 500);
  }

  const gqlData = gqlResult.data.data.getRoom;

  if (!gqlData) {
    return err(new Error("Room not found"), 404);
  }

  if (gqlData.participants.includes(user.sub)) {
    return err(new Error("You are not a participant of this room"), 403);
  };

  return {
    data: {
      creator: gqlData.creator,
      name: gqlData.name,
      participants: gqlData.participants,
      requireInvite: gqlData.requireInvite,
      createdAt: gqlData.createdAt
    }
  }
});


export {
  rooms,
  createRoom,
  getRoomInfo,
};

