'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { auth } from '../../../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import '@/styles/clientarea.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons';

const ClientArea = ({ params }) => {
    const router = useRouter();
    const slug = React.use(params).slug;
    const [user, setUser] = useState(null);

    if (!slug) {
        router.push('/login');
        return null;
    }

    useEffect(() => {
        const checkAuth = async () => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    try {
                        const idToken = await user.getIdToken();
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${slug}`, {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${idToken}`,
                            },
                        });

                        if (response.ok) {
                            const userData = await response.json();
                            if (userData.firebaseUid !== user.uid) {
                                router.push('/');
                                setUser(null);
                            }

                            setUser(userData);
                        } else {
                            setUser(null);
                        }
                    } catch (error) {
                        console.error('Error fetching user profile:', error);
                        router.push('/login');
                        setUser(null);
                    }
                }

            });
        };

        checkAuth();
    }, [slug]);

    const changeContent = (content) => {
        return () => {
            if (content === 'downloads') {
                document.querySelector('.clientareadownloads').style.display = 'block';
                document.querySelector('.clientareapayments').style.display = 'none';
            }

            if (content === 'payments') {
                document.querySelector('.clientareadownloads').style.display = 'none';
                document.querySelector('.clientareapayments').style.display = 'block';
            }
        };
    }

    return (
        <div>
            <Navbar />
            <div className='container'>
                <h1>Hello, {user ? user.username : ''}</h1>
                <p>Use the boxes below to see your services</p>
                <div className='clientareabtns'>
                    <div className='clientareabtn' onClick={changeContent('downloads')}>
                        <p>
                            <FontAwesomeIcon icon={faDownload} />
                            <br />
                            Downloads
                        </p>
                    </div>

                    <div className='clientareabtn' onClick={changeContent('payments')}>
                        <p>
                            <FontAwesomeIcon icon={faMoneyBillTransfer} />
                            <br />
                            Payments
                        </p>
                    </div>
                </div>

                <div className='clientareacontent'>
                    <div className='clientareadownloads' style={{ 'display': 'block' }}>
                        <p>Your Downloads</p>
                        <div className='table'>
                            <div className='tableinner'>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Download</th>
                                            <th>Price</th>
                                            <th>Date Purchased</th>
                                        </tr>
                                    </thead>
                                    <tbody>
      
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className='clientareapayments' style={{ 'display': 'none' }}>
                        <p>Your Payments</p>
                        <div className='table'>
                            <div className='tableinner'>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Date Purchased</th>
                                        </tr>
                                    </thead>
                                    <tbody>
              
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ClientArea;