import { useState } from 'react';
import { Table, Badge, Button, Form, InputGroup, Alert, Spinner } from 'react-bootstrap';
import type { PaymentRecord } from '../types/employee';
import { formatVND } from '../utils/salaryCalculator';
import { useLicense } from '../hooks/useLicense';

interface PaymentHistoryTableProps {
    history: PaymentRecord[];
}

export default function PaymentHistoryTable({ history }: PaymentHistoryTableProps) {
    const { isLicensed, clientName, error, validateLicense, clearLicense } = useLicense();
    const [inputKey, setInputKey] = useState('');
    const [validating, setValidating] = useState(false);

    const handleActivate = async () => {
        if (!inputKey.trim()) return;
        setValidating(true);
        await validateLicense(inputKey.trim());
        setValidating(false);
    };

    if (!history || history.length === 0) {
        return (
            <div className="text-center text-white py-4">
                <i className="bi bi-clock-history fs-2 mb-2 d-block"></i>
                No payment history available. Use the calculator to add a record.
            </div>
        );
    }

    // Premium gate: show activation prompt if not licensed
    if (!isLicensed) {
        return (
            <div className="text-center py-5">
                <div className="premium-gate-container p-4 rounded-4" style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                    <i className="bi bi-shield-lock-fill fs-1 text-warning d-block mb-3"></i>
                    <h5 className="text-white fw-bold mb-2">Premium Feature</h5>
                    <p className="text-secondary mb-4">
                        Payment History is a premium feature.<br />
                        Enter your license key below to unlock full access.
                    </p>

                    {error && (
                        <Alert variant="danger" className="glass-alert mb-3 text-start">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            {error}
                        </Alert>
                    )}

                    <InputGroup className="mb-3" style={{ maxWidth: '450px', margin: '0 auto' }}>
                        <Form.Control
                            type="text"
                            placeholder="Enter license key (e.g. LIC-XXXX)"
                            value={inputKey}
                            onChange={(e) => setInputKey(e.target.value)}
                            className="glass-input"
                            onKeyDown={(e) => e.key === 'Enter' && handleActivate()}
                            disabled={validating}
                        />
                        <Button
                            variant="primary"
                            onClick={handleActivate}
                            disabled={validating || !inputKey.trim()}
                            className="btn-calculate"
                        >
                            {validating ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                <><i className="bi bi-key-fill me-1"></i> Activate</>
                            )}
                        </Button>
                    </InputGroup>

                    {/* Preview: show blurred table */}
                    <div style={{ filter: 'blur(6px)', pointerEvents: 'none', opacity: 0.4, marginTop: '1rem' }}>
                        <Table hover className="glass-table mb-0">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Budget Ratio</th>
                                    <th className="text-end">Initial Salary</th>
                                    <th className="text-end">Paid Amount</th>
                                    <th className="text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.slice(0, 3).map((record) => (
                                    <tr key={record.id}>
                                        <td>{new Date(record.date).toLocaleDateString()}</td>
                                        <td>{(record.budgetRatio * 100).toFixed(2)}%</td>
                                        <td className="text-end">{formatVND(record.initialSalary)}</td>
                                        <td className="text-end fw-bold">{formatVND(record.finalSalary)}</td>
                                        <td className="text-center">
                                            <Badge bg="secondary" pill className="status-badge-small">•••</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* License status bar */}
            <div className="d-flex justify-content-between align-items-center mb-3 px-2">
                <small className="text-success">
                    <i className="bi bi-patch-check-fill me-1"></i>
                    Licensed{clientName ? ` to ${clientName}` : ''}
                </small>
                <Button variant="link" size="sm" className="text-secondary p-0" onClick={clearLicense}>
                    <i className="bi bi-x-circle me-1"></i> Deactivate
                </Button>
            </div>

            <div className="table-responsive glass-table-container">
                <Table hover className="glass-table mb-0">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Budget Ratio</th>
                            <th className="text-end">Initial Salary</th>
                            <th className="text-end">Paid Amount</th>
                            <th className="text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((record) => {
                            const isIncrease = record.budgetRatio > 1;
                            const isDecrease = record.budgetRatio < 1;
                            const statusColor = isIncrease ? 'success' : isDecrease ? 'danger' : 'secondary';
                            const statusLabel = isIncrease ? 'Up' : isDecrease ? 'Down' : '-';

                            return (
                                <tr key={record.id}>
                                    <td>{new Date(record.date).toLocaleDateString()}</td>
                                    <td>{(record.budgetRatio * 100).toFixed(2)}%</td>
                                    <td className="text-end">{formatVND(record.initialSalary)}</td>
                                    <td className="text-end fw-bold">{formatVND(record.finalSalary)}</td>
                                    <td className="text-center">
                                        <Badge bg={statusColor} pill className="status-badge-small">
                                            {statusLabel}
                                        </Badge>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}
