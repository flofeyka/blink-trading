'use client'

import {useEffect} from 'react';
import {useSearchParams} from 'next/navigation';
import {userAPI} from '@/lib/api/userAPI'; // если такой есть

export default function ClientWrapper() {
    const searchParams = useSearchParams();
    const params = searchParams.toString();

    useEffect(() => {
        const fetchUser = async () => {
            if (params) {
                await userAPI.getUser(params);
            }
        };

        fetchUser();
    }, [params]);

    return null; // не рендерит ничего
}
