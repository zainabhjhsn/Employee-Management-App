import { Component, inject } from '@angular/core';
import { LoginModel } from '../../models/User.model';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { EmployeeService } from '../../services/employee';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { StorageService } from '../../services/storage';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  employeeService = inject(EmployeeService);
  authService = inject(AuthService);
  router = inject(Router);
  localStorage = inject(StorageService);

  Login() {
    const formValue = this.loginForm.value;
    this.authService.onLogin(formValue).subscribe({
      next: (response: any) => {
        if (response) {
          // Save token
          this.localStorage.setItem('token', response.token);

          // Save entire user object
          this.localStorage.setItem('leaveUser', JSON.stringify(response.data));

          // Redirect based on user role
          if (response.data.role === 'employee') {
            this.router.navigateByUrl('/leave');
          } else {
            this.router.navigateByUrl('/dashboard');
          }
        }
      },
      error: (error) => {
        alert('Login failed. Please check your credentials and try again.');
      },
    });
  }
}
