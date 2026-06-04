import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebApiService } from '../web-api.service';
import { CommentList, CreatePostModel, PostList } from './template.models';

@Injectable({ providedIn: 'root' })
export class TemplatesService extends WebApiService {

  getAllTemplateData(apiURL: string, httpParams?: HttpParams): Observable<PostList[]> {
    return this.baseHttpGetRequest<PostList[]>(apiURL, httpParams);
  }

  postNewTemplateData(apiURL: string, postBody: CreatePostModel, httpParams?: HttpParams): Observable<PostList> {
    return this.baseHttpPostRequest<PostList>(apiURL, postBody, httpParams);
  }

  updateNewTemplateData(apiURL: string, updateBody: PostList, httpParams?: HttpParams): Observable<PostList> {
    return this.baseHttpPutRequest<PostList>(apiURL, updateBody, httpParams);
  }

  deleteTemplateData(apiURL: string, httpParams?: HttpParams): Observable<unknown> {
    return this.baseHttpDeleteRequest<unknown>(apiURL, httpParams);
  }

  getAllCommentsData(apiURL: string, httpParams?: HttpParams): Observable<CommentList[]> {
    return this.baseHttpGetRequest<CommentList[]>(apiURL, httpParams);
  }
}
