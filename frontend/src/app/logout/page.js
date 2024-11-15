'use client';

import { useEffect } from 'react';
import { auth } from "@/services/firebase";
import { signOut } from "firebase/auth";


const LogoutPage = () => {
    useEffect(() => {
        signOut(auth).then(() => {
            window.location.href = '/';
        });
    }, []);

    return (
        <div>
            <p>Logging out...</p>
        </div>
    );
};

export default LogoutPage;