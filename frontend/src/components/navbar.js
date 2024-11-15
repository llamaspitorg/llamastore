'use client';
import React, { useEffect } from 'react';
import '../styles/navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser, faSpinner } from '@fortawesome/free-solid-svg-icons';

import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Navbar = () => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true); // to handle loading state

    useEffect(() => {
        const checkAuth = async () => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    try {
                        const idToken = await user.getIdToken();
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${idToken}`,
                            },
                        });

                        if (response.ok) {
                            const userData = await response.json();
                            setUser(userData); 
                        } else {
                            setUser(null);
                        }
                    } catch (error) {
                        console.error('Error fetching user profile:', error);
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }

                setLoading(false);
            });
        };

        checkAuth();
    }, []); 

    if (loading) {
        return <div className='loading'><FontAwesomeIcon icon={faSpinner} /></div>;
    }

    return (
        <nav className="navbar">
            <img src='/images/llamalogo4.png' alt='Llama' draggable='false' />
            <div className='nav-links'>
                <a href='/'>Home</a>
                <a href='/products'>Products</a>
                <a href='/support'>Support</a>
                <a href='discord.gg'>Discord</a>
            </div>
            <div className='nav-icons'>
                <a href='/cart'><FontAwesomeIcon icon={faCartShopping} /></a>
                {user && <a href={`/clientarea/${user.username.toLowerCase()}`}><FontAwesomeIcon id="usericon" icon={faUser} /> {user.username || 'Profile'}</a>}
                {!user && <a id="login" href='/login'>Login</a>} 
            </div>
        </nav>
    );
};

export default Navbar;