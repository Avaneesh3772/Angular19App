import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { WebApiService } from '../web-api.service';
import {
  AdminTemplateItem,
  ApiComment,
  ApiTodo,
  ApiUser,
  ArtistItem,
  DoctorItem,
  EmployeeItem,
  OrderItem,
  RoleTemplateItem,
} from './rxjs-learning.models';
import { RxjsConstants } from './rxjs-learning.constants';

@Injectable({ providedIn: 'root' })
export class RxjsLearningService extends WebApiService {

  // ─── JSONPlaceholder ───────────────────────────────────────────────────────
  getUsers(httpParams?: HttpParams): Observable<ApiUser[]> {
    return this.baseHttpGetRequest<ApiUser[]>(RxjsConstants.usersApiURL, httpParams);
  }

  getTodos(httpParams?: HttpParams): Observable<ApiTodo[]> {
    return this.baseHttpGetRequest<ApiTodo[]>(RxjsConstants.todosApiURL, httpParams);
  }

  getComments(httpParams?: HttpParams): Observable<ApiComment[]> {
    return this.baseHttpGetRequest<ApiComment[]>(RxjsConstants.commentsApiURL, httpParams);
  }

  // ─── Local mock JSON assets ────────────────────────────────────────────────
  getDoctors(): Observable<DoctorItem[]> {
    return this.baseHttpGetRequest<DoctorItem[]>(RxjsConstants.doctorsDataURL);
  }

  getEmployees(): Observable<EmployeeItem[]> {
    return this.baseHttpGetRequest<EmployeeItem[]>(RxjsConstants.employeeDataURL);
  }

  getArtists(): Observable<ArtistItem[]> {
    return this.baseHttpGetRequest<ArtistItem[]>(RxjsConstants.artistDataURL);
  }

  getOrders(): Observable<OrderItem[]> {
    return this.baseHttpGetRequest<OrderItem[]>(RxjsConstants.ordersDataURL);
  }

  getUserById(id: number): Observable<ApiUser> {
    return this.baseHttpGetRequest<ApiUser>(`${RxjsConstants.usersApiURL}/${id}`);
  }

  getAdminTemplates(): Observable<AdminTemplateItem[]> {
    return this.baseHttpGetRequest<AdminTemplateItem[]>(RxjsConstants.adminMockDataURL);
  }

  getRoleTemplates(): Observable<RoleTemplateItem[]> {
    return this.baseHttpGetRequest<RoleTemplateItem[]>(RxjsConstants.roleMockDataURL);
  }

  /** Always fails — used in error-handling demos */
  getFailingRequest(): Observable<never> {
    return throwError(() => new Error('Simulated server error — HTTP 500'));
  }
}
