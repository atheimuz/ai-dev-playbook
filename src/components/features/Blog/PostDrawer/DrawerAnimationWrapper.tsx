"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DrawerProvider } from "./DrawerContext";

export function DrawerAnimationWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const isDrawerRoute = pathname.startsWith("/posts/");
    const [isClosing, setIsClosing] = useState<boolean>(false);
    const prevWasOpenRef = useRef(false);
    const prevPathnameRef = useRef(pathname);
    const drawerDepthRef = useRef(0);
    const isHardNavigation = useRef(true);

    // 첫 렌더 이후는 모두 soft navigation (클라이언트 내부 탐색)
    useEffect(() => {
        isHardNavigation.current = false;
    }, []);

    // 직접 URL 접근(hard navigation) 시에는 drawer를 열지 않음
    const isDrawerOpen = isDrawerRoute && !isHardNavigation.current;

    // Drawer 진입 깊이 추적 (A→B→C 전환 시 depth 누적)
    if (isDrawerOpen && pathname !== prevPathnameRef.current) {
        if (prevWasOpenRef.current) {
            drawerDepthRef.current++;
        } else {
            drawerDepthRef.current = 1;
        }
    } else if (!isDrawerOpen) {
        drawerDepthRef.current = 0;
    }
    prevPathnameRef.current = pathname;

    // 애니메이션 클래스 결정
    let animationClass = "";
    if (isDrawerOpen) {
        if (isClosing) {
            animationClass = "animate-drawer-close";
        } else if (!prevWasOpenRef.current) {
            animationClass = "animate-drawer-open";
        }
    }

    // pathname 변경 후 ref 업데이트
    useEffect(() => {
        prevWasOpenRef.current = isDrawerOpen;
        if (!isDrawerOpen) {
            setIsClosing(false);
        }
    }, [isDrawerOpen]);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        const depth = drawerDepthRef.current;
        setTimeout(() => {
            window.history.go(-depth);
        }, 300);
    }, []);

    if (!isDrawerOpen && !isClosing) {
        return null;
    }

    return (
        <aside
            className={`fixed inset-0 z-50 flex flex-col border-l border-graphite-200 bg-white dark:border-graphite-800 dark:bg-graphite-900 lg:relative lg:inset-auto lg:z-auto lg:w-[480px] xl:w-[45%] ${animationClass}`}
        >
            <DrawerProvider onClose={handleClose}>{children}</DrawerProvider>
        </aside>
    );
}
