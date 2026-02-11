import type { SalaryInput, SalaryResult, CalculationError } from '../types/salary';

/**
 * Validates the salary calculation inputs.
 * Returns an array of errors (empty if valid).
 */
export function validateInputs(input: SalaryInput): CalculationError[] {
    const errors: CalculationError[] = [];

    if (isNaN(input.initialBudget) || input.initialBudget < 0) {
        errors.push({
            field: 'initialBudget',
            message: 'Initial Budget must be a non-negative number.',
        });
    }

    if (input.initialBudget === 0) {
        errors.push({
            field: 'initialBudget',
            message: 'Initial Budget cannot be zero (division by zero).',
        });
    }

    if (isNaN(input.currentBudget) || input.currentBudget < 0) {
        errors.push({
            field: 'currentBudget',
            message: 'Current Budget must be a non-negative number.',
        });
    }

    if (isNaN(input.initialSalary) || input.initialSalary < 0) {
        errors.push({
            field: 'initialSalary',
            message: 'Initial Salary must be a non-negative number.',
        });
    }

    return errors;
}

/**
 * Calculates the proportional salary based on budget fluctuation.
 *
 * Formula: Current_Salary = Initial_Salary × (Current_Budget / Initial_Budget)
 *
 * @param input - The salary calculation inputs
 * @returns The salary calculation result
 * @throws Error if Initial_Budget is 0 (division by zero)
 */
export function calculateSalary(input: SalaryInput): SalaryResult {
    const { initialBudget, currentBudget, initialSalary } = input;

    if (initialBudget === 0) {
        throw new Error('Cannot calculate: Initial Budget is zero (division by zero).');
    }

    const budgetRatio = currentBudget / initialBudget;
    const currentSalary = initialSalary * budgetRatio;
    const budgetChange = (budgetRatio - 1) * 100;
    const salaryDifference = currentSalary - initialSalary;

    let status: SalaryResult['status'] = 'unchanged';
    if (budgetRatio > 1) status = 'increase';
    else if (budgetRatio < 1) status = 'decrease';

    return {
        currentSalary: Math.round(currentSalary * 100) / 100,
        budgetRatio: Math.round(budgetRatio * 10000) / 10000,
        budgetChange: Math.round(budgetChange * 100) / 100,
        salaryDifference: Math.round(salaryDifference * 100) / 100,
        status,
    };
}

/**
 * Formats a number as Vietnamese Dong (VND) currency.
 */
export function formatVND(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Formats a number with thousand separators.
 */
export function formatNumber(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(value);
}
