import { Card, Row, Col } from 'react-bootstrap';
import type { SalaryResult } from '../types/salary';
import { formatVND } from '../utils/salaryCalculator';

interface ResultCardProps {
    result: SalaryResult;
    initialSalary: number;
    initialBudget: number;
    currentBudget: number;
}

export default function ResultCard({ result, initialSalary, initialBudget, currentBudget }: ResultCardProps) {
    const statusConfig = {
        increase: {
            icon: 'bi-arrow-up-circle-fill',
            color: '#00c897',
            bgClass: 'status-increase',
            label: 'Budget Increased',
            emoji: '📈',
        },
        decrease: {
            icon: 'bi-arrow-down-circle-fill',
            color: '#ff6b6b',
            bgClass: 'status-decrease',
            label: 'Budget Decreased',
            emoji: '📉',
        },
        unchanged: {
            icon: 'bi-dash-circle-fill',
            color: '#7c8db5',
            bgClass: 'status-unchanged',
            label: 'Budget Unchanged',
            emoji: '➖',
        },
    };

    const config = statusConfig[result.status];

    return (
        <Card className="glass-card result-card mt-4">
            <Card.Body className="p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h5 className="card-section-title mb-0">
                        <i className="bi bi-clipboard-data me-2"></i>
                        Calculation Results
                    </h5>
                    <span className={`status-badge ${config.bgClass}`}>
                        <i className={`bi ${config.icon} me-1`}></i>
                        {config.label}
                    </span>
                </div>

                {/* Main Result */}
                <div className="main-result-box mb-4">
                    <div className="main-result-label">Current Salary Payable</div>
                    <div className="main-result-value" style={{ color: config.color }}>
                        {formatVND(result.currentSalary)}
                    </div>
                    <div className="main-result-sub">
                        {result.status === 'decrease' ? (
                            <span className="text-danger">
                                <i className="bi bi-caret-down-fill me-1"></i>
                                {formatVND(Math.abs(result.salaryDifference))} less than original
                            </span>
                        ) : result.status === 'increase' ? (
                            <span className="text-success">
                                <i className="bi bi-caret-up-fill me-1"></i>
                                {formatVND(Math.abs(result.salaryDifference))} more than original
                            </span>
                        ) : (
                            <span className="text-muted">No change from original salary</span>
                        )}
                    </div>
                </div>

                {/* Detail Grid */}
                <Row className="g-3">
                    <Col sm={6}>
                        <div className="detail-card">
                            <div className="detail-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
                                <i className="bi bi-wallet2" style={{ color: '#6366f1' }}></i>
                            </div>
                            <div>
                                <div className="detail-label">Initial Budget</div>
                                <div className="detail-value">{formatVND(initialBudget)}</div>
                            </div>
                        </div>
                    </Col>
                    <Col sm={6}>
                        <div className="detail-card">
                            <div className="detail-icon-wrap" style={{ background: 'rgba(236, 72, 153, 0.15)' }}>
                                <i className="bi bi-cash-stack" style={{ color: '#ec4899' }}></i>
                            </div>
                            <div>
                                <div className="detail-label">Current Budget</div>
                                <div className="detail-value">{formatVND(currentBudget)}</div>
                            </div>
                        </div>
                    </Col>
                    <Col sm={6}>
                        <div className="detail-card">
                            <div className="detail-icon-wrap" style={{ background: 'rgba(34, 197, 94, 0.15)' }}>
                                <i className="bi bi-person-badge" style={{ color: '#22c55e' }}></i>
                            </div>
                            <div>
                                <div className="detail-label">Original Salary</div>
                                <div className="detail-value">{formatVND(initialSalary)}</div>
                            </div>
                        </div>
                    </Col>
                    <Col sm={6}>
                        <div className="detail-card">
                            <div className="detail-icon-wrap" style={{ background: 'rgba(251, 191, 36, 0.15)' }}>
                                <i className="bi bi-percent" style={{ color: '#fbbf24' }}></i>
                            </div>
                            <div>
                                <div className="detail-label">Budget Ratio</div>
                                <div className="detail-value">{(result.budgetRatio * 100).toFixed(2)}%</div>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Calculation Breakdown */}
                <div className="breakdown-box mt-4">
                    <div className="breakdown-title">
                        <i className="bi bi-diagram-3 me-2"></i>
                        Calculation Breakdown
                    </div>
                    <div className="breakdown-steps">
                        <div className="breakdown-step">
                            <span className="step-num">1</span>
                            <span className="step-text">
                                Budget Ratio = {formatVND(currentBudget)} ÷ {formatVND(initialBudget)} = <strong>{(result.budgetRatio * 100).toFixed(2)}%</strong>
                            </span>
                        </div>
                        <div className="breakdown-step">
                            <span className="step-num">2</span>
                            <span className="step-text">
                                Current Salary = {formatVND(initialSalary)} × {(result.budgetRatio * 100).toFixed(2)}% = <strong>{formatVND(result.currentSalary)}</strong>
                            </span>
                        </div>
                        <div className="breakdown-step">
                            <span className="step-num">3</span>
                            <span className="step-text">
                                Difference = {formatVND(result.currentSalary)} − {formatVND(initialSalary)} ={' '}
                                <strong style={{ color: config.color }}>{formatVND(result.salaryDifference)}</strong>
                            </span>
                        </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}
