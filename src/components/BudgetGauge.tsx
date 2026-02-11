import { Card } from 'react-bootstrap';

interface BudgetGaugeProps {
    ratio: number;
}

export default function BudgetGauge({ ratio }: BudgetGaugeProps) {
    const percentage = Math.min(Math.max(ratio * 100, 0), 200);
    const displayPercentage = (ratio * 100).toFixed(1);
    const barWidth = Math.min(percentage, 100);

    let barColor = '#6366f1';
    let glowColor = 'rgba(99, 102, 241, 0.4)';
    if (ratio < 0.5) {
        barColor = '#ef4444';
        glowColor = 'rgba(239, 68, 68, 0.4)';
    } else if (ratio < 0.8) {
        barColor = '#f59e0b';
        glowColor = 'rgba(245, 158, 11, 0.4)';
    } else if (ratio < 1) {
        barColor = '#3b82f6';
        glowColor = 'rgba(59, 130, 246, 0.4)';
    } else if (ratio > 1) {
        barColor = '#22c55e';
        glowColor = 'rgba(34, 197, 94, 0.4)';
    }

    return (
        <Card className="glass-card gauge-card">
            <Card.Body className="p-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                    <h6 className="card-section-title mb-0">
                        <i className="bi bi-speedometer2 me-2"></i>
                        Budget Health
                    </h6>
                    <span className="gauge-percentage" style={{ color: barColor }}>
                        {displayPercentage}%
                    </span>
                </div>
                <div className="gauge-bar-track">
                    <div
                        className="gauge-bar-fill"
                        style={{
                            width: `${barWidth}%`,
                            background: `linear-gradient(90deg, ${barColor}, ${barColor}dd)`,
                            boxShadow: `0 0 20px ${glowColor}`,
                            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    />
                    {/* Marker at 100% */}
                    <div className="gauge-marker" style={{ left: '100%' }}>
                        <div className="gauge-marker-line"></div>
                        <span className="gauge-marker-label">100%</span>
                    </div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                    <small className="text-muted">0%</small>
                    <small className="text-muted">
                        {ratio > 1
                            ? 'Over budget — salary increases proportionally'
                            : ratio < 1
                                ? 'Under budget — salary decreases proportionally'
                                : 'Budget on target'}
                    </small>
                </div>
            </Card.Body>
        </Card>
    );
}
