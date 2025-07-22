import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { StorageService } from './storage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private localStorage: StorageService) {}

  //User Login as either Admin or Employee
  onLogin(object: any) {
    return this.http.post(`${this.url}/login`, object);
  }

  getUser(): any {
    const userString = this.localStorage.getItem('leaveUser');
    if (!userString || userString === 'undefined') return null;

    try {
      return JSON.parse(userString);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }

  getRole(): string | null {
    const user = this.getUser();
    return user?.role || null;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }

  isEmployee(): boolean {
    return this.getRole() === 'employee';
  }
}
