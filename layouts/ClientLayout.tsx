'use client'

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { authAPI } from '@/api/authAPI'; // если такой есть

export default function ClientWrapper() {
    const searchParams = useSearchParams();
    const params = searchParams.toString();

    useEffect(() => {
        const fetchUser = async () => {
            if (params) {
                const user = await authAPI.getUser(params);
                localStorage.setItem('params', params);
                console.log(await user.getSettings());
            }
        };

        fetchUser();
    }, [params]);

    return null; // не рендерит ничего
}
