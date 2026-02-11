
export default function AppVersion() {
    const version = import.meta.env.PACKAGE_VERSION || 'unknown';

    return (
        <div className="text-center text-muted small py-2" style={{ position: 'absolute', top: 0, width: '100%', zIndex: 1000, pointerEvents: 'none' }}>
            v{version}
        </div>
    );
}
