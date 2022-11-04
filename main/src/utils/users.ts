export type UserT = {
  id: string;
  username: string;
  room: string;
};

export type RoomDataT = {
  room: UserT['room'];
  users: UserT[];
};

export const users: UserT[] = [];

export function addUser({ id, username, room }: UserT): {
  error?: string;
  user?: UserT;
} {
  // Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate the data
  if (!username || !room) {
    return {
      error: 'Username and room are required!',
    };
  }

  // Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  // Validate username
  if (existingUser) {
    return {
      error: 'Username is in use!',
    };
  }

  // Store user
  const user = { id, username, room };
  users.push(user);
  return { user };
}

export const removeUser = (id: string): UserT | void => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

export const getUser = (id: string): UserT => {
  return users.find((user) => user.id === id)!;
};

export const getUsersInRoom = (room: string): UserT[] => {
  room = room.trim().toLowerCase();
  return users.filter((user) => user.room === room);
};
