export type GenerateMessageT = {
  username: string;
  text: string;
  createdAt: number;
};

export const generateMessage = (
  text: string,
  username: string
): GenerateMessageT => {
  return {
    username,
    text,
    createdAt: new Date().getTime(),
  };
};
