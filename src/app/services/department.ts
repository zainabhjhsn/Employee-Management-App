import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { APIResponseModel } from '../models/Employee.model';
import { environment } from '../../environments/environment';
import { Department } from '../models/Department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private url = `${environment.apiUrl}/departments`;

  constructor(private http: HttpClient) {}
    getDepartments(): Observable<Department[]> {
      return this.http
        .get<{ status: string; data: Department[] }>(`${this.url}`)
        .pipe(map((response: APIResponseModel) => response.data));
    }
}
