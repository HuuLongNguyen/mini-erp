export interface SalaryInput {
    initialBudget: number;
    currentBudget: number;
    initialSalary: number;
}

export interface SalaryResult {
    currentSalary: number;
    budgetRatio: number;
    budgetChange: number;
    salaryDifference: number;
    status: 'increase' | 'decrease' | 'unchanged';
}

export interface CalculationError {
    field: string;
    message: string;
}
