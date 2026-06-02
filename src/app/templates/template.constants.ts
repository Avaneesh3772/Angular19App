export class TemplateConstants {
  public static displayedColumns: string[] = ["id", "title", "userId", "message", "actions"];
  public static displayedColumnsComments: string[] = ["id", "name", "email", "message"];
  public static get getTemplateURL():string { return 'https://jsonplaceholder.typicode.com/posts'}
  public static get postTemplateURL():string { return 'https://jsonplaceholder.typicode.com/posts'}
  public static updateTemplateURL(id:number):string { return 'https://jsonplaceholder.typicode.com/posts/'+id}
  public static deleteTemplateURL(id:number):string { return 'https://jsonplaceholder.typicode.com/posts/'+id}
  public static commentsApiURL(id:number):string { return 'https://jsonplaceholder.typicode.com/posts/'+id+'/comments'}
}
