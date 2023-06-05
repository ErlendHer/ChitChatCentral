/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRoom = /* GraphQL */ `
  query GetRoom($id: ID!) {
    getRoom(id: $id) {
      id
      name
      participants
      requireInvite
      creator
      creatorSub
      messages {
        items {
          id
          content
          time
          roomId
          username
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listRooms = /* GraphQL */ `
  query ListRooms(
    $id: ID
    $filter: ModelRoomFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listRooms(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        name
        participants
        requireInvite
        creator
        creatorSub
        messages {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const roomsByUsername = /* GraphQL */ `
  query RoomsByUsername(
    $creator: String!
    $sortDirection: ModelSortDirection
    $filter: ModelRoomFilterInput
    $limit: Int
    $nextToken: String
  ) {
    roomsByUsername(
      creator: $creator
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        participants
        requireInvite
        creator
        creatorSub
        messages {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
      id
      content
      time
      room {
        id
        name
        participants
        requireInvite
        creator
        creatorSub
        messages {
          nextToken
        }
        createdAt
        updatedAt
      }
      roomId
      username
      createdAt
      updatedAt
    }
  }
`;
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        content
        time
        room {
          id
          name
          participants
          requireInvite
          creator
          creatorSub
          createdAt
          updatedAt
        }
        roomId
        username
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const messagesByRoomId = /* GraphQL */ `
  query MessagesByRoomId(
    $roomId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messagesByRoomId(
      roomId: $roomId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        content
        time
        room {
          id
          name
          participants
          requireInvite
          creator
          creatorSub
          createdAt
          updatedAt
        }
        roomId
        username
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
