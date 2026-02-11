// import { initialize } from "@microsoft/power-apps/app";
import { useEffect, type ReactNode } from "react";

interface PowerProviderProps {
    children: ReactNode;
}

export default function PowerProvider({ children }: PowerProviderProps) {
    useEffect(() => {
        const initApp = async () => {
            try {
                // await initialize(); // 'initialize' is not exported by @microsoft/power-apps/app in v1.0.3
                console.log('Power Platform SDK initialized (mock)');
            } catch (error) {
                console.error('Failed to initialize Power Platform SDK:', error);
            }
        };

        initApp();
    }, []);

    return <>{children}</>;
}
