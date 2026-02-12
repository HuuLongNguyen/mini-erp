import { useState, useEffect, useCallback } from 'react';

const LICENSE_STORAGE_KEY = 'miniERP_license';
const LICENSE_STATUS_KEY = 'miniERP_license_status';

// License API Configuration
// Uses the same Supabase project as the main app
const LICENSE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const LICENSE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

interface LicenseResult {
    valid: boolean;
    message: string;
    client_name?: string;
}

interface UseLicenseReturn {
    isLicensed: boolean;
    isLoading: boolean;
    licenseKey: string;
    clientName: string | null;
    error: string | null;
    validateLicense: (key: string) => Promise<boolean>;
    clearLicense: () => void;
}

export function useLicense(): UseLicenseReturn {
    const [isLicensed, setIsLicensed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [licenseKey, setLicenseKey] = useState('');
    const [clientName, setClientName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Check for saved license on mount
    useEffect(() => {
        const savedKey = localStorage.getItem(LICENSE_STORAGE_KEY);
        const savedStatus = localStorage.getItem(LICENSE_STATUS_KEY);

        if (savedKey && savedStatus === 'valid') {
            setLicenseKey(savedKey);
            setIsLicensed(true);
            // Re-validate in background
            revalidate(savedKey);
        }
        setIsLoading(false);
    }, []);

    const revalidate = async (key: string) => {
        try {
            const result = await callValidateLicense(key);
            if (!result.valid) {
                // License has been revoked or expired
                setIsLicensed(false);
                localStorage.removeItem(LICENSE_STORAGE_KEY);
                localStorage.removeItem(LICENSE_STATUS_KEY);
                setError(result.message);
            } else {
                setClientName(result.client_name || null);
            }
        } catch {
            // Network error during re-validation, keep cached status
            console.warn('License re-validation failed (network error), using cached status.');
        }
    };

    const callValidateLicense = async (key: string): Promise<LicenseResult> => {
        const url = `${LICENSE_SUPABASE_URL}/rest/v1/rpc/validate_license`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'apikey': LICENSE_SUPABASE_ANON_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input_code: key }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return response.json();
    };

    const validateLicense = useCallback(async (key: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        if (!LICENSE_SUPABASE_URL || !LICENSE_SUPABASE_ANON_KEY) {
            setError('License server is not configured.');
            setIsLoading(false);
            return false;
        }

        try {
            const result = await callValidateLicense(key);

            if (result.valid) {
                setIsLicensed(true);
                setLicenseKey(key);
                setClientName(result.client_name || null);
                localStorage.setItem(LICENSE_STORAGE_KEY, key);
                localStorage.setItem(LICENSE_STATUS_KEY, 'valid');
                setIsLoading(false);
                return true;
            } else {
                setError(result.message || 'Invalid license key.');
                setIsLicensed(false);
                setIsLoading(false);
                return false;
            }
        } catch (err) {
            setError('Could not connect to the license server. Please try again.');
            setIsLicensed(false);
            setIsLoading(false);
            return false;
        }
    }, []);

    const clearLicense = useCallback(() => {
        setIsLicensed(false);
        setLicenseKey('');
        setClientName(null);
        setError(null);
        localStorage.removeItem(LICENSE_STORAGE_KEY);
        localStorage.removeItem(LICENSE_STATUS_KEY);
    }, []);

    return {
        isLicensed,
        isLoading,
        licenseKey,
        clientName,
        error,
        validateLicense,
        clearLicense,
    };
}
