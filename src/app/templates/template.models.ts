export interface PostList {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface CreatePostModel {
  title: string;
  body: string;
  userId: number;
}

export interface CommentList {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}
