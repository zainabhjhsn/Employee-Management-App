// export interface ExpenseClaim {
//   id: number;
//   employee_id: number;
//   date: Date;
//   description: string;
//   total: Float32Array;
//   status: string;
//   employee: { name: string } | null;
//   details: { total: number; type: string; description: string } | null;
// }

interface ExpenseClaimDetail {
  date: string;
  type: string;
  description: string;
  total: number;
}

interface ExpenseClaim {
  id: number;
  employee_id: number;
  date: string;
  total: number;
  description: string;
  status: string;
  details: ExpenseClaimDetail[];
}
