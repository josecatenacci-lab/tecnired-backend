export const PostTypeEnum = {
  corte: 'corte',
  comando: 'comando',
  libre: 'libre',
};

export const CreatePostDTO = {
  title: '',
  content: '',
  type: 'libre',
  metadata: {},
};

export const PostDTO = {
  id: '',
  title: '',
  content: '',
  type: '',
  userId: '',
  createdAt: '',
};