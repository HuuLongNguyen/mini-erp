import { useState, useCallback, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup, Tabs, Tab } from 'react-bootstrap';
import type { SalaryInput, SalaryResult, CalculationError } from '../types/salary';
import { validateInputs, calculateSalary } from '../utils/salaryCalculator';
import ResultCard from './ResultCard';
import BudgetGauge from './BudgetGauge';
import EmployeeProfile from './EmployeeProfile';
import PaymentHistoryTable from './PaymentHistoryTable';
import { useEmployeeStorage } from '../hooks/useEmployeeStorage';

const EXAMPLE_DATA: SalaryInput = {
    initialBudget: 40_000_000,
    currentBudget: 35_000_000,
    initialSalary: 25_000_000,
};

export default function SalaryCalculator() {
    const {
        employees,
        currentEmployee,
        setCurrentEmployeeId,
        addEmployee,
        updateEmployee,
        addPaymentRecord
    } = useEmployeeStorage();

    const [initialBudget, setInitialBudget] = useState<string>('');
    const [currentBudget, setCurrentBudget] = useState<string>('');
    const [initialSalary, setInitialSalary] = useState<string>('');
    const [result, setResult] = useState<SalaryResult | null>(null);
    const [errors, setErrors] = useState<CalculationError[]>([]);
    const [calculated, setCalculated] = useState(false);
    const [activeTab, setActiveTab] = useState('calculator');

    // Auto-fill when employee changes
    useEffect(() => {
        if (currentEmployee) {
            setInitialBudget(currentEmployee.initialBudget.toString());
            setInitialSalary(currentEmployee.initialSalary.toString());
            // Clear current budget to force user entry or keep it if they want
            setCurrentBudget('');
            setResult(null);
            setCalculated(false);
            setErrors([]);
        }
    }, [currentEmployee]);

    const parseNum = (val: string): number => {
        const cleaned = val.replace(/[^0-9.]/g, '');
        return parseFloat(cleaned) || 0;
    };

    const formatInputDisplay = (val: string): string => {
        const num = parseNum(val);
        if (isNaN(num) || val === '') return '';
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    const handleCalculate = useCallback(() => {
        const input: SalaryInput = {
            initialBudget: parseNum(initialBudget),
            currentBudget: parseNum(currentBudget),
            initialSalary: parseNum(initialSalary),
        };

        const validationErrors = validateInputs(input);
        setErrors(validationErrors);

        if (validationErrors.length > 0) {
            setResult(null);
            setCalculated(true);
            return;
        }

        try {
            const calcResult = calculateSalary(input);
            setResult(calcResult);
            setErrors([]);
        } catch (err) {
            setErrors([{ field: 'general', message: (err as Error).message }]);
            setResult(null);
        }
        setCalculated(true);
    }, [initialBudget, currentBudget, initialSalary]);

    const handleSavePayment = () => {
        if (!currentEmployee || !result) return;

        addPaymentRecord(currentEmployee.id, result, {
            initialBudget: parseNum(initialBudget),
            currentBudget: parseNum(currentBudget),
            initialSalary: parseNum(initialSalary),
        });

        // Switch to history tab to show the new record
        setActiveTab('history');
    };

    const handleReset = () => {
        setInitialBudget('');
        setCurrentBudget('');
        setInitialSalary('');
        setResult(null);
        setErrors([]);
        setCalculated(false);
    };

    const handleLoadExample = () => {
        setInitialBudget(EXAMPLE_DATA.initialBudget.toString());
        setCurrentBudget(EXAMPLE_DATA.currentBudget.toString());
        setInitialSalary(EXAMPLE_DATA.initialSalary.toString());
        setResult(null);
        setErrors([]);
        setCalculated(false);
    };

    const getFieldError = (field: string): string | undefined => {
        return errors.find((e) => e.field === field)?.message;
    };

    return (
        <div className="calculator-page">
            {/* Animated background shapes */}
            <div className="bg-shape bg-shape-1"></div>
            <div className="bg-shape bg-shape-2"></div>
            <div className="bg-shape bg-shape-3"></div>

            <Container className="py-4 py-lg-5 position-relative">
                {/* Header */}
                <div className="text-center mb-4 mb-lg-5 fade-in-up">
                    <div className="header-icon-wrapper mb-3">
                        <i className="bi bi-calculator-fill header-icon"></i>
                    </div>
                    <h1 className="app-title">
                        Salary Adjustment <span className="gradient-text">Manager</span>
                    </h1>
                    <p className="app-subtitle">
                        Manage employee salaries and calculate adjustments based on budget fluctuations
                    </p>
                </div>

                <Row className="justify-content-center mb-4 fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <Col lg={10}>
                        {/* Employee Section */}
                        <EmployeeProfile
                            currentEmployee={currentEmployee}
                            employees={employees}
                            selectEmployee={setCurrentEmployeeId}
                            createEmployee={(data) => {
                                addEmployee(data);
                                // Auto-select the new employee
                            }}
                            updateEmployee={updateEmployee}
                        />
                    </Col>
                </Row>

                <Row className="justify-content-center fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <Col lg={10}>
                        <Card className="glass-card mb-4">
                            <Card.Header className="glass-header border-0 pt-3 px-4">
                                <Tabs
                                    activeKey={activeTab}
                                    onSelect={(k) => setActiveTab(k || 'calculator')}
                                    className="glass-tabs mb-0"
                                >
                                    <Tab eventKey="calculator" title="Calculator">
                                        {/* Content below */}
                                    </Tab>
                                    <Tab eventKey="history" title={`Payment History ${currentEmployee ? `(${currentEmployee.history.length})` : ''}`} disabled={!currentEmployee}>
                                        {/* Content below */}
                                    </Tab>
                                </Tabs>
                            </Card.Header>

                            <Card.Body className="p-4">
                                {activeTab === 'calculator' && (
                                    <Row className="g-4">
                                        {/* Input Section */}
                                        <Col lg={5} md={6}>
                                            <div className="d-flex align-items-center justify-content-between mb-4">
                                                <h5 className="card-section-title mb-0">
                                                    <i className="bi bi-sliders me-2"></i>
                                                    Input Parameters
                                                </h5>
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    className="load-example-btn"
                                                    onClick={handleLoadExample}
                                                    title="Load example data"
                                                >
                                                    <i className="bi bi-lightning-fill me-1"></i>
                                                    Example
                                                </Button>
                                            </div>

                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    handleCalculate();
                                                }}
                                            >
                                                {/* Initial Budget */}
                                                <Form.Group className="mb-3" controlId="initialBudget">
                                                    <Form.Label className="input-label">
                                                        <i className="bi bi-wallet2 me-2 label-icon"></i>
                                                        Initial Budget
                                                    </Form.Label>
                                                    <InputGroup className="custom-input-group">
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="e.g. 40,000,000"
                                                            value={formatInputDisplay(initialBudget)}
                                                            onChange={(e) => {
                                                                const raw = e.target.value.replace(/[^0-9]/g, '');
                                                                setInitialBudget(raw);
                                                            }}
                                                            className={`glass-input ${getFieldError('initialBudget') ? 'is-invalid' : ''}`}
                                                            autoComplete="off"
                                                        />
                                                        <InputGroup.Text className="glass-input-addon">VND</InputGroup.Text>
                                                    </InputGroup>
                                                    {getFieldError('initialBudget') && (
                                                        <div className="custom-error-msg">
                                                            <i className="bi bi-exclamation-circle me-1"></i>
                                                            {getFieldError('initialBudget')}
                                                        </div>
                                                    )}
                                                </Form.Group>

                                                {/* Current Budget */}
                                                <Form.Group className="mb-3" controlId="currentBudget">
                                                    <Form.Label className="input-label">
                                                        <i className="bi bi-cash-stack me-2 label-icon"></i>
                                                        Current Budget
                                                    </Form.Label>
                                                    <InputGroup className="custom-input-group">
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="e.g. 35,000,000"
                                                            value={formatInputDisplay(currentBudget)}
                                                            onChange={(e) => {
                                                                const raw = e.target.value.replace(/[^0-9]/g, '');
                                                                setCurrentBudget(raw);
                                                            }}
                                                            className={`glass-input ${getFieldError('currentBudget') ? 'is-invalid' : ''}`}
                                                            autoComplete="off"
                                                        />
                                                        <InputGroup.Text className="glass-input-addon">VND</InputGroup.Text>
                                                    </InputGroup>
                                                    {getFieldError('currentBudget') && (
                                                        <div className="custom-error-msg">
                                                            <i className="bi bi-exclamation-circle me-1"></i>
                                                            {getFieldError('currentBudget')}
                                                        </div>
                                                    )}
                                                </Form.Group>

                                                {/* Initial Salary */}
                                                <Form.Group className="mb-4" controlId="initialSalary">
                                                    <Form.Label className="input-label">
                                                        <i className="bi bi-person-badge me-2 label-icon"></i>
                                                        Initial Salary Agreed
                                                    </Form.Label>
                                                    <InputGroup className="custom-input-group">
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="e.g. 25,000,000"
                                                            value={formatInputDisplay(initialSalary)}
                                                            onChange={(e) => {
                                                                const raw = e.target.value.replace(/[^0-9]/g, '');
                                                                setInitialSalary(raw);
                                                            }}
                                                            className={`glass-input ${getFieldError('initialSalary') ? 'is-invalid' : ''}`}
                                                            autoComplete="off"
                                                        />
                                                        <InputGroup.Text className="glass-input-addon">VND</InputGroup.Text>
                                                    </InputGroup>
                                                    {getFieldError('initialSalary') && (
                                                        <div className="custom-error-msg">
                                                            <i className="bi bi-exclamation-circle me-1"></i>
                                                            {getFieldError('initialSalary')}
                                                        </div>
                                                    )}
                                                </Form.Group>

                                                {/* General Errors */}
                                                {errors.filter((e) => e.field === 'general').length > 0 && (
                                                    <Alert variant="danger" className="glass-alert mb-3">
                                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                        {errors.find((e) => e.field === 'general')?.message}
                                                    </Alert>
                                                )}

                                                {/* Action Buttons */}
                                                <div className="d-grid gap-2">
                                                    <Button
                                                        type="submit"
                                                        className="btn-calculate"
                                                        size="lg"
                                                    >
                                                        <i className="bi bi-calculator me-2"></i>
                                                        Calculate Salary
                                                    </Button>
                                                    <Button
                                                        variant="outline-secondary"
                                                        className="btn-reset"
                                                        onClick={handleReset}
                                                    >
                                                        <i className="bi bi-arrow-counterclockwise me-2"></i>
                                                        Reset
                                                    </Button>
                                                </div>
                                            </Form>

                                            {/* Formula Reference */}
                                            <div className="formula-box mt-4">
                                                <div className="formula-label">
                                                    <i className="bi bi-book me-1"></i> Formula
                                                </div>
                                                <div className="formula-content">
                                                    Current Salary = Initial Salary × (Current Budget ÷ Initial Budget)
                                                </div>
                                            </div>
                                        </Col>

                                        {/* Result Section */}
                                        <Col lg={7} md={6}>
                                            {calculated && result ? (
                                                <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
                                                    <BudgetGauge ratio={result.budgetRatio} />
                                                    <ResultCard
                                                        result={result}
                                                        initialSalary={parseNum(initialSalary)}
                                                        initialBudget={parseNum(initialBudget)}
                                                        currentBudget={parseNum(currentBudget)}
                                                    />

                                                    {/* Save Payment Action */}
                                                    {currentEmployee ? (
                                                        <div className="mt-3 d-grid">
                                                            <Button
                                                                variant="success"
                                                                size="lg"
                                                                className="btn-save-payment fade-in-up"
                                                                onClick={handleSavePayment}
                                                            >
                                                                <i className="bi bi-save-fill me-2"></i>
                                                                Save to Employee History
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Alert variant="info" className="mt-3 glass-alert">
                                                            <i className="bi bi-info-circle me-2"></i>
                                                            Select or create an employee above to save this calculation.
                                                        </Alert>
                                                    )}
                                                </div>
                                            ) : (
                                                <Card className="glass-card placeholder-card fade-in-up d-flex align-items-center justify-content-center" style={{ animationDelay: '0.2s', minHeight: '400px' }}>
                                                    <Card.Body className="text-center d-flex flex-column align-items-center justify-content-center">
                                                        <div className="placeholder-icon-wrapper mb-3">
                                                            <i className="bi bi-bar-chart-line-fill placeholder-icon"></i>
                                                        </div>
                                                        <h5 className="text-muted fw-semibold">Results Will Appear Here</h5>
                                                        <p className="text-muted small mb-0">
                                                            Enter your budget and salary parameters,<br />
                                                            then click <strong>Calculate Salary</strong> to see the adjusted amount.
                                                        </p>
                                                    </Card.Body>
                                                </Card>
                                            )}
                                        </Col>
                                    </Row>
                                )}

                                {activeTab === 'history' && currentEmployee && (
                                    <div className="fade-in-up">
                                        <h5 className="card-section-title mb-4">
                                            <i className="bi bi-clock-history me-2"></i>
                                            Payment History for {currentEmployee.name}
                                        </h5>
                                        <PaymentHistoryTable history={currentEmployee.history} />
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Footer */}
                <div className="text-center mt-5 fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <p className="footer-text">
                        <i className="bi bi-shield-lock-fill me-1"></i>
                        All calculations and data are stored locally in your browser.
                    </p>
                </div>
            </Container>
        </div>
    );
}
