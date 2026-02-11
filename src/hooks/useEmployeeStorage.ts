import { useState, useEffect } from 'react';
import type { Employee, PaymentRecord } from '../types/employee';
import type { SalaryResult } from '../types/salary';

const STORAGE_KEY = 'miniERP_employees';

export function useEmployeeStorage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [currentEmployeeId, setCurrentEmployeeId] = useState<string | null>(null);

    // Load from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setEmployees(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse employees', e);
            }
        }
    }, []);

    // Sync to LocalStorage
    useEffect(() => {
        if (employees.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
        }
    }, [employees]);

    const addEmployee = (employee: Omit<Employee, 'id' | 'history'>) => {
        const newEmployee: Employee = {
            ...employee,
            id: crypto.randomUUID(),
            history: [],
        };
        setEmployees([...employees, newEmployee]);
        setCurrentEmployeeId(newEmployee.id);
        return newEmployee.id;
    };

    const updateEmployee = (id: string, updates: Partial<Omit<Employee, 'id' | 'history'>>) => {
        setEmployees(employees.map(emp =>
            emp.id === id ? { ...emp, ...updates } : emp
        ));
    };

    const addPaymentRecord = (employeeId: string, result: SalaryResult, input: { initialBudget: number, currentBudget: number, initialSalary: number }) => {
        const newRecord: PaymentRecord = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            initialBudget: input.initialBudget,
            currentBudget: input.currentBudget,
            initialSalary: input.initialSalary,
            finalSalary: result.currentSalary,
            budgetRatio: result.budgetRatio,
        };

        setEmployees(employees.map(emp => {
            if (emp.id === employeeId) {
                return {
                    ...emp,
                    history: [newRecord, ...emp.history] // Newest first
                };
            }
            return emp;
        }));
    };

    const currentEmployee = employees.find(e => e.id === currentEmployeeId) || null;

    return {
        employees,
        currentEmployee,
        currentEmployeeId,
        setCurrentEmployeeId,
        addEmployee,
        updateEmployee,
        addPaymentRecord
    };
}
