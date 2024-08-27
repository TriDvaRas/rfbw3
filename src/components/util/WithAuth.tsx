import React, { useEffect, ComponentType, FC, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const WithAuth: FC<{ children: ReactNode }> = ({ children }) => {
    const router = useRouter();
    const { data: session, status } = useSession();

    // Hardcoded whitelist of pages that do not require authentication

    useEffect(() => {
        const whitelist = ['/login', '/maintenance/dashboard'];
        if (session === null && !whitelist.includes(router.pathname)) {
            router.push('/login');
        }
    }, [session, router.pathname, router]);
    
    if (status === 'loading') return null;
    return <>{children}</>;
};

export default WithAuth;