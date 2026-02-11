import { Table, Badge } from 'react-bootstrap';
import type { PaymentRecord } from '../types/employee';
import { formatVND } from '../utils/salaryCalculator';

interface PaymentHistoryTableProps {
    history: PaymentRecord[];
}

export default function PaymentHistoryTable({ history }: PaymentHistoryTableProps) {
    if (!history || history.length === 0) {
        return (
            <div className="text-center text-white py-4">
                <i className="bi bi-clock-history fs-2 mb-2 d-block"></i>
                No payment history available. Use the calculator to add a record.
            </div>
        );
    }

    return (
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
    );
}
