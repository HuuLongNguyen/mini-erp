import { Form, Button, Row, Col, Card, InputGroup } from 'react-bootstrap';
import type { Employee } from '../types/employee';
import { formatVND } from '../utils/salaryCalculator';

interface EmployeeProfileProps {
    currentEmployee: Employee | null;
    employees: Employee[];
    selectEmployee: (id: string | null) => void;
    createEmployee: (data: Omit<Employee, 'id' | 'history'>) => void;
    updateEmployee: (id: string, updates: Partial<Employee>) => void;
}

export default function EmployeeProfile({
    currentEmployee,
    employees,
    selectEmployee,
    createEmployee,
    // updateEmployee 
}: EmployeeProfileProps) {

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        selectEmployee(val === 'new' ? null : val);
    };

    const isNew = !currentEmployee;

    return (
        <Card className="glass-card mb-4">
            <Card.Body className="p-4">
                <h5 className="card-section-title mb-4">
                    <i className="bi bi-person-circle me-2"></i> Employee Details
                </h5>

                <Row className="g-3 align-items-end mb-4">
                    <Col md={12}>
                        <Form.Group controlId="employeeSelect">
                            <Form.Label className="input-label">Select Employee</Form.Label>
                            <Form.Select
                                className="glass-input"
                                value={currentEmployee?.id || 'new'}
                                onChange={handleSelect}
                            >
                                <option value="new">+ Create New Employee</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                {isNew ? (
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        createEmployee({
                            name: formData.get('name') as string,
                            email: formData.get('email') as string,
                            bankAccount: formData.get('bankAccount') as string,
                            bankAccountHolder: formData.get('bankAccountHolder') as string,
                            initialBudget: Number(formData.get('initialBudget')),
                            initialSalary: Number(formData.get('initialSalary')),
                        });
                    }}>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="input-label">Full Name</Form.Label>
                                    <Form.Control required name="name" type="text" placeholder="John Doe" className="glass-input" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="input-label">Email</Form.Label>
                                    <Form.Control name="email" type="email" placeholder="john@company.com" className="glass-input" />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="input-label">Bank Account Number</Form.Label>
                                    <Form.Control name="bankAccount" type="text" placeholder="1234-5678-9012" className="glass-input" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="input-label">Bank Account Holder Name</Form.Label>
                                    <Form.Control name="bankAccountHolder" type="text" placeholder="NGUYEN VAN A" className="glass-input" />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="input-label">Agreed Initial Project Budget</Form.Label>
                                    <InputGroup className="custom-input-group">
                                        <Form.Control required name="initialBudget" type="number" placeholder="50000000" className="glass-input" />
                                        <InputGroup.Text className="glass-input-addon">VND</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="input-label">Agreed Initial Salary</Form.Label>
                                    <InputGroup className="custom-input-group">
                                        <Form.Control required name="initialSalary" type="number" placeholder="25000000" className="glass-input" />
                                        <InputGroup.Text className="glass-input-addon">VND</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </Col>

                            <Col xs={12} className="text-end mt-4">
                                <Button type="submit" variant="primary" className="btn-calculate px-4">
                                    <i className="bi bi-person-plus-fill me-2"></i> Create Employee Profile
                                </Button>
                            </Col>
                        </Row>
                    </form>
                ) : (
                    <div className="employee-details-view p-3 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <Row className="g-4">
                            <Col md={6}>
                                <div className="detail-item-view">
                                    <label className="text-secondary small text-uppercase fw-bold mb-1">Full Name</label>
                                    <div className="fs-5 text-white fw-semibold">{currentEmployee.name}</div>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="detail-item-view">
                                    <label className="text-secondary small text-uppercase fw-bold mb-1">Email</label>
                                    <div className="fs-5 text-white">{currentEmployee.email || '-'}</div>
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className="detail-item-view">
                                    <label className="text-secondary small text-uppercase fw-bold mb-1">Bank Account</label>
                                    <div className="fs-5 text-white font-monospace">{currentEmployee.bankAccount || '-'}</div>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="detail-item-view">
                                    <label className="text-secondary small text-uppercase fw-bold mb-1">Account Holder</label>
                                    <div className="fs-5 text-white text-uppercase">{currentEmployee.bankAccountHolder || '-'}</div>
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className="detail-item-view">
                                    <label className="text-secondary small text-uppercase fw-bold mb-1">Initial Budget Agreement</label>
                                    <div className="fs-5 text-info font-monospace">{formatVND(currentEmployee.initialBudget)}</div>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="detail-item-view">
                                    <label className="text-secondary small text-uppercase fw-bold mb-1">Initial Salary Agreement</label>
                                    <div className="fs-5 text-success font-monospace">{formatVND(currentEmployee.initialSalary)}</div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}
