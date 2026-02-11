export interface PaymentRecord {
    id: string;
    date: string;
    initialBudget: number;
    currentBudget: number;
    initialSalary: number;
    finalSalary: number;
    budgetRatio: number;
}

export interface Employee {
    id: string;
    name: string;
    email: string;
    bankAccount: string;
    bankAccountHolder: string; // Renamed from department
    initialBudget: number;     // New field
    initialSalary: number;     // New field
    history: PaymentRecord[];
}
