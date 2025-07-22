import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LeaveType } from '../models/LeaveType.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LeaveTypeService {
  private url = `${environment.apiUrl}/leave-types`;

  constructor(private http: HttpClient) {}

  getLeaveTypes(): Observable<LeaveType[]> {
    return this.http
      .get<{ status: string; data: LeaveType[] }>(this.url)
      .pipe(map((res) => res.data));
  }

  createLeaveType(payload: { name: string }): Observable<any> {
    return this.http.post(this.url, payload);
  }

  deleteLeaveType(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  editLeaveType(id: number, payload: { name: string }): Observable<any> {
    return this.http.put(`${this.url}/${id}`, payload);
  }
}
