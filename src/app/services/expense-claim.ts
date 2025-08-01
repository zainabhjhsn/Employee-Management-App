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

  getClaimById(claimId: number): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(`${this.url}/${claimId}`);
  }

  getExpenseTotalsByType(): Observable<TotalExpensesByType[]> {
    return this.http
      .get<{ status: string; data: TotalExpensesByType[] }>(
        'http://localhost:3001/api/expense-claims-details/totals-by-type'
      )
      .pipe(map((response) => response.data));
  }

  approveClaim(claimId: number): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(
      `${this.url}/approveClaim/${claimId}`
    );
  }

  rejectClaim(claimId: number): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(
      `${this.url}/rejectClaim/${claimId}`
    );
  }

  deleteClaim(id: number): Observable<APIResponseModel> {
    return this.http.delete<APIResponseModel>(`${this.url}/${id}`);
  }

  updateClaim(claimPayload: any): Observable<APIResponseModel> {
    return this.http.put<APIResponseModel>(
      `${this.url}/${claimPayload.id}`,
      claimPayload
    );
  }
}
