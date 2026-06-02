export interface  PostList {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export class CreatePostModelAnotherWay {
  constructor(
    public title: string,
    public body: string,
    public userId: number,
  ) { }
}


export class CreatePostModel {
  public title;
  public body;
  public userId;
  
  constructor(titleValue: string, bodyValue: string, userIdValue: number ) {
      this.title = titleValue;
      this.body = bodyValue;
      this.userId = userIdValue;
   }
}

export interface CommentList {
    postId: number;
    id: number;
    name: string;
    email: string;
    body: string;
}
