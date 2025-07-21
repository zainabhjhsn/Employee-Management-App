export interface ExpenseClaim {
  id: number;
  employee_id: number;
  date: Date;
  description: string;
  total: Float32Array;
  status: string;
  employee: { name: string } | null;
  details: { total: number; type: string; description: string } | null;
}
