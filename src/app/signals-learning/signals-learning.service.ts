import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebApiService } from '../web-api.service';
import { DoctorItem, EmployeeItem } from './signals-learning.models';
import { SignalsConstants } from './signals-learning.constants';

@Injectable({ providedIn: 'root' })
export class SignalsLearningService extends WebApiService {

  // Used for toSignal() demo — returns Observable<DoctorItem[]>
  getDoctors(httpParams?: HttpParams): Observable<DoctorItem[]> {
    return this.baseHttpGetRequest<DoctorItem[]>(SignalsConstants.doctorsDataURL, httpParams);
  }

  // Used for toObservable() and linkedSignal() demos
  getEmployees(httpParams?: HttpParams): Observable<EmployeeItem[]> {
    return this.baseHttpGetRequest<EmployeeItem[]>(SignalsConstants.employeeDataURL, httpParams);
  }
}
