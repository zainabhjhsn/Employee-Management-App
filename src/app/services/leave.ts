import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { APIResponseModel } from '../models/Employee.model';
import { environment } from '../../environments/environment';
import { TotalLeavesByType } from '../models/Leave.model';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  private url = `${environment.apiUrl}/leaves`;

  constructor(private http: HttpClient) {}

  onAddLeave(payload: any): Observable<APIResponseModel> {
    return this.http.post<APIResponseModel>(`${this.url}`, payload);
  }

  //with filter
  getAllLeaves(from?: string, to?: string): Observable<APIResponseModel> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);

    return this.http.get<APIResponseModel>(`${this.url}`, { params });
  }

  getAllLeavesByEmployeeId(employeeId: number): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(
      `${this.url}/employee/${employeeId}`
    );
  }

  //with filtering
  getLeavesByEmployeeId(
    employeeId: number,
    from?: string,
    to?: string
  ): Observable<any> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);

    return this.http.get(`${this.url}/employee/${employeeId}`, { params });
  }

  getLeaveTotalsByType(): Observable<TotalLeavesByType[]> {
    return this.http.get<TotalLeavesByType[]>(`${this.url}/totals-by-type`);
  }

  approveLeave(leaveId: number): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(
      `${this.url}/approveLeave/${leaveId}`
    );
  }

  rejectLeave(leaveId: number): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(
      `${this.url}/rejectLeave/${leaveId}`
    );
  }

  deleteLeave(id: number): Observable<APIResponseModel> {
    return this.http.delete<APIResponseModel>(`${this.url}/${id}`);
  }

  updateLeave(leave: any): Observable<APIResponseModel> {
    return this.http.put<APIResponseModel>(`${this.url}/${leave.id}`, leave);
  }
}
