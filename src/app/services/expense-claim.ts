import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { APIResponseModel } from '../models/Employee.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseClaimService {
  private url = `${environment.apiUrl}/expense-claims`;

  constructor(private http: HttpClient) {}

  onAddExpenseClaim(payload: any): Observable<APIResponseModel> {
    return this.http.post<APIResponseModel>(`${this.url}`, payload);
  }

  getAllClaims(): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(`${this.url}`);
  }

  getAllClaimsByEmployeeId(employeeId: number): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(
      `${this.url}/employee/${employeeId}`
    );
  }

  approveClaim(leaveId: number): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(
      `${this.url}/approveClaim/${leaveId}`
    );
  }

  rejectClaim(leaveId: number): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(
      `${this.url}/rejectClaim/${leaveId}`
    );
  }

  deleteClaim(id: number): Observable<APIResponseModel> {
    return this.http.delete<APIResponseModel>(`${this.url}/${id}`);
  }

  updateClaim(leave: any): Observable<APIResponseModel> {
    return this.http.put<APIResponseModel>(`${this.url}/${leave.id}`, leave);
  }
}
