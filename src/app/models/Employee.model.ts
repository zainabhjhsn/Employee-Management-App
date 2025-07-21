export interface APIResponseModel {
  status: string;
  data: any;
}

export interface EmployeeList {
  "id": number;
  "name": string;
  "email": string;
  "password": string;
  "address": string;
  "department_id": number;
  "department": { "id": number; "name": string } | null;
}

export class EmployeeModel {
  id: number;
  name: string;
  email: string;
  password?: string;
  address: string;
  department_id: number;

  constructor() {
    this.id = 0;
    this.name = '';
    this.email = '';
    this.password = '';
    this.address = '';
    this.department_id = 0;
  }
}