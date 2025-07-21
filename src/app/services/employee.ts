import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponseModel } from '../models/Employee.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private url = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(`${this.url}`);
  }

  saveEmployee(payload: any): Observable<APIResponseModel> {
    return this.http.post<APIResponseModel>(`${this.url}`, payload);
  }

  deleteEmployee(id: number): Observable<APIResponseModel> {
    return this.http.delete<APIResponseModel>(`${this.url}/${id}`);
  }

  // getEmployeeById(id: number) {
  //   return this.http.get(`${this.url}/${id}`);
  // }
}
