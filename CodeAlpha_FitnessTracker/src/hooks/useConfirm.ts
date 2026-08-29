import { useCallback, useState } from "react";

interface ConfirmConfig {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    onConfirm: () => void | Promise<void>;
}

// Centralizes confirmation-dialog state so callers avoid repeating visible/onConfirm/onCancel wiring.
export function useConfirm() {
    const [config, setConfig] = useState<ConfirmConfig | null>(null);

    const confirm = useCallback((cfg: ConfirmConfig) => setConfig(cfg), []);
    const close = useCallback(() => setConfig(null), []);

    const handleConfirm = useCallback(async () => {
        if (!config) return;
        await config.onConfirm();
        setConfig(null);
    }, [config]);

    return {
        confirm,
        modalProps: {
            visible: config !== null,
            title: config?.title ?? "",
            message: config?.message ?? "",
            confirmLabel: config?.confirmLabel,
            cancelLabel: config?.cancelLabel,
            destructive: config?.destructive ?? false,
            onConfirm: handleConfirm,
            onCancel: close,
        }
    };
}