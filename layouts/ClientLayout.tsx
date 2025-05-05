'use client'

import {useEffect} from 'react';
import {useSearchParams} from 'next/navigation';
import {authAPI} from '@/lib/api/authAPI'; // если такой есть

export default function ClientWrapper() {
    const searchParams = useSearchParams();
    const params = searchParams.toString();

    useEffect(() => {
        const fetchUser = async () => {
            if (params) {
                await authAPI.getUser(params);
            }
        };

        fetchUser();
    }, [params]);

    return null; // не рендерит ничего
}
