import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Layout } from './pages/layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Employee } from './pages/employee/employee';
import { Leave } from './pages/leave/leave';
import { ExpenseClaims } from './pages/expense-claims/expense-claims';
import { LeaveTypeComponent } from './pages/leave-type/leave-type';
import { EmployeeLeaves } from './pages/leave/employee-leaves/employee-leaves';
import { AddExpenseClaim } from './pages/expense-claims/add-expense-claim/add-expense-claim';
import { EmployeeClaims } from './pages/expense-claims/employee-claims/employee-claims';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'employee',
        component: Employee,
      },
      {
        path: 'leave-type',
        component: LeaveTypeComponent,
      },
      {
        path: 'leave',
        component: Leave,
        // children: [
        //   {
        //     path: 'employee/:employeeId',
        //     component: EmployeeLeaves, // This becomes /leave/employee/:employeeId nested routes
        //   },
        // ],
      },
      {
        path: 'leave/employee/:employeeId',
        component: EmployeeLeaves,
      },
      {
        path: 'expense-claims',
        component: ExpenseClaims,
      },
      {
        path: 'expense-claims/new',
        component: AddExpenseClaim,
      },
      {
        path: 'expense-claims/employee/:employeeId',
        component: EmployeeClaims,
      },
    ],
  },
];
