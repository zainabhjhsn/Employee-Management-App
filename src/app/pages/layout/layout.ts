import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  router = inject(Router);
  isSidebarOpen = false;
  currentYear: number = new Date().getFullYear();
  // userRole: string | null = null;

  constructor(private authService: AuthService, private localStorage: StorageService) {}

  onLogOut() {
    this.localStorage.removeItem('token');
    this.localStorage.removeItem('leaveUser');
    alert('You have been logged out successfully.');
    this.router.navigate(['/login']);
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get isEmployee(): boolean {
    return this.authService.isEmployee();
  }
}
