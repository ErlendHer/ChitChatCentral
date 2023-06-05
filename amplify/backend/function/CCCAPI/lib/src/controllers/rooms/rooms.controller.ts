import type { Handler } from 'express';
import type { VerifiedReq } from 'lib/src/middleware/authentication.middleware';
import * as Nanoid from 'nanoid';
import { executeGQLRequest } from '../../core/graphqlRequest';
import { err } from '../../error/error';
import { CreateRoomVariables, createRoomMutation } from './rooms.queries';

const nanoid = Nanoid.customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 5);

const rooms: Handler = (req, res) => {
  res.json({ success: 'Yes', url: req.url });
}

// const createRoomBodySchema = Joi.object({
//   username: Joi.string().required(),
// })

const createRoom: Handler = async (req, res, next) => {

  // if (!validateSchema(req, createRoomBodySchema, next)) return;

  const id = nanoid(5);
  const username = (req as VerifiedReq).user.username;

  const gqlResult = await executeGQLRequest<CreateRoomVariables>(createRoomMutation, {
    input: {
      creator: req.body.username,
      id,
      name: `${username}'s room`,
      participants: [username],
      requireInvite: true
    }
  })


  if (!gqlResult.success) {
    return next(err(new Error(gqlResult.error), 500));
  }

  res.json({ roomId: id, });
}

export {
  rooms,
  createRoom
};

