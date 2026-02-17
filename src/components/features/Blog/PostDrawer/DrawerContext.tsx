"use client";

import { createContext, useContext } from "react";

interface DrawerContextValue {
    handleClose: () => void;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function DrawerProvider({
    children,
    onClose
}: {
    children: React.ReactNode;
    onClose: () => void;
}) {
    return (
        <DrawerContext.Provider value={{ handleClose: onClose }}>
            {children}
        </DrawerContext.Provider>
    );
}

const NOOP_CONTEXT: DrawerContextValue = { handleClose: () => {} };

export function useDrawer() {
    const context = useContext(DrawerContext);
    return context ?? NOOP_CONTEXT;
}
