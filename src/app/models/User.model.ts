export class LoginModel {
  email: string;
  password: string;

  constructor() {
    this.email = '';
    this.password = '';
  }
}

export interface UserAccount {
  id: number;
  email: string;
  role: 'admin' | 'employee';
  employee_id: number | null;
}

export class UserModel {
  id: number;
  email: string;
  role: 'admin' | 'employee';
  employee_id: number | null;

  constructor() {
    this.id = 0;
    this.email = '';
    this.role = 'employee';
    this.employee_id = null;
  }
}
