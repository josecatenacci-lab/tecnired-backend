export const NotificationTypeEnum = {
  info: 'info',
  chat: 'chat',
  post: 'post',
  comment: 'comment',
  reaction: 'reaction',
  system: 'system',
};

export const NotificationDTO = {
  id: '',
  userId: '',
  type: '',
  title: '',
  message: '',
  read: false,
};