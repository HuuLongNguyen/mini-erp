import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import type { Employee, PaymentRecord } from '../types/employee';
import type { SalaryResult } from '../types/salary';

export function useEmployeeStorage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [currentEmployeeId, setCurrentEmployeeId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Load from Supabase
    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const { data, error } = await supabase
                .from('employees')
                .select(`
                    *,
                    history:payment_history(*)
                `)
                .order('name');
            
            if (error) throw error;

            if (data) {
                // Map database columns (snake_case) to application types (camelCase)
                const mappedEmployees: Employee[] = data.map((emp: any) => ({
                    id: emp.id,
                    name: emp.name,
                    email: emp.email,
                    bankAccount: emp.bank_account,
                    bankAccountHolder: emp.bank_account_holder,
                    initialBudget: emp.initial_budget,
                    initialSalary: emp.initial_salary,
                    history: (emp.history || []).map((h: any) => ({
                        id: h.id,
                        date: h.date,
                        initialBudget: h.initial_budget,
                        currentBudget: h.current_budget,
                        initialSalary: h.initial_salary,
                        finalSalary: h.final_salary,
                        budgetRatio: h.budget_ratio
                    })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                }));
                setEmployees(mappedEmployees);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
        }
    };

    const addEmployee = async (employee: Omit<Employee, 'id' | 'history'>) => {
        try {
            const { data, error } = await supabase
                .from('employees')
                .insert([{
                    name: employee.name,
                    email: employee.email,
                    bank_account: employee.bankAccount,
                    bank_account_holder: employee.bankAccountHolder,
                    initial_budget: employee.initialBudget,
                    initial_salary: employee.initialSalary
                }])
                .select()
                .single();

            if (error) throw error;

            if (data) {
                const newEmployee: Employee = {
                    ...employee,
                    id: data.id, // Use ID from DB
                    history: [],
                };
                setEmployees(prev => [...prev, newEmployee]);
                setCurrentEmployeeId(newEmployee.id);
                return newEmployee.id;
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            return null;
        }
    };

    const updateEmployee = async (id: string, updates: Partial<Omit<Employee, 'id' | 'history'>>) => {
        try {
            const dbUpdates: any = {};
            if (updates.name) dbUpdates.name = updates.name;
            if (updates.email) dbUpdates.email = updates.email;
            if (updates.bankAccount) dbUpdates.bank_account = updates.bankAccount;
            if (updates.bankAccountHolder) dbUpdates.bank_account_holder = updates.bankAccountHolder;
            if (updates.initialBudget) dbUpdates.initial_budget = updates.initialBudget;
            if (updates.initialSalary) dbUpdates.initial_salary = updates.initialSalary;

            const { error } = await supabase
                .from('employees')
                .update(dbUpdates)
                .eq('id', id);

            if (error) throw error;

            setEmployees(employees.map(emp =>
                emp.id === id ? { ...emp, ...updates } : emp
            ));
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    const addPaymentRecord = async (employeeId: string, result: SalaryResult, input: { initialBudget: number, currentBudget: number, initialSalary: number }) => {
        try {
            const { data, error } = await supabase
                .from('payment_history')
                .insert([{
                    employee_id: employeeId,
                    date: new Date().toISOString(),
                    initial_budget: input.initialBudget,
                    current_budget: input.currentBudget,
                    initial_salary: input.initialSalary,
                    final_salary: result.currentSalary,
                    budget_ratio: result.budgetRatio
                }])
                .select()
                .single();

            if (error) throw error;

            if (data) {
                const newRecord: PaymentRecord = {
                    id: data.id,
                    date: data.date,
                    initialBudget: data.initial_budget,
                    currentBudget: data.current_budget,
                    initialSalary: data.initial_salary,
                    finalSalary: data.final_salary,
                    budgetRatio: data.budget_ratio,
                };

                setEmployees(employees.map(emp => {
                    if (emp.id === employeeId) {
                        return {
                            ...emp,
                            history: [newRecord, ...emp.history]
                        };
                    }
                    return emp;
                }));
            }
        } catch (error) {
            console.error('Error adding payment record:', error);
        }
    };

    const currentEmployee = employees.find(e => e.id === currentEmployeeId) || null;

    return {
        employees,
        currentEmployee,
        currentEmployeeId,
        setCurrentEmployeeId,
        addEmployee,
        updateEmployee,
        addPaymentRecord,
        loading
    };
}
