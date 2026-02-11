-- Enable the UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Employees Table
CREATE TABLE employees (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    bank_account TEXT,
    bank_account_holder TEXT,
    initial_budget NUMERIC,
    initial_salary NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Payment History Table
CREATE TABLE payment_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    initial_budget NUMERIC,
    current_budget NUMERIC,
    initial_salary NUMERIC,
    final_salary NUMERIC,
    budget_ratio NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance (optional but recommended)
CREATE INDEX idx_payment_history_employee_id ON payment_history(employee_id);
