'use client';
import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import '@/styles/home.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

const HomePage = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div>
            <Navbar />
            <div className='container'>
                <section className='first'>
                    <h1>Websites ready to go</h1>
                    <p>Get your business on the web fast</p>
                    {isVisible && (
                        <div className='arrow'>
                            <FontAwesomeIcon icon={faChevronDown} />
                        </div>
                    )}
                </section>
                <section className='second'>

                </section>
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;