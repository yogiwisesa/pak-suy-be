// eslint-disable-next-line import/prefer-default-export
export const getReplyInline = (messageId: number) => {
  return {
    reply_to_message_id: messageId
  };
};
