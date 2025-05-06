'use client';
import {redirect, useParams, useSearchParams} from "next/navigation";
import {useEffect} from "react";

export default function App() {
    const params = useParams();

    const searchParams = useSearchParams();

    useEffect(() => {
        if(!params.token) {
            redirect(`/rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof?${searchParams.toString()}`)
        }
    }, [params.toString()])


    return <div>
        Token not found
    </div>
}