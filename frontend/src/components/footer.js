import React from 'react';
import '../styles/footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="footer">
            <div>
                <img src='/images/llamalogo4.png' alt='Llama' draggable='false' />
                <p>© 2024 Llamaspit</p>
                <div className='footerSocials'>
                    <a href='https://discord.gg/llamaspit' target='_blank' rel='noreferrer'>
                        <FontAwesomeIcon icon={faDiscord} />
                    </a>
                </div>
            </div>
            <div>
                <span>Pages</span>
                <a href='/'>Home</a>
                <a href='/products'>Products</a>
                <a href='/support'>Support</a>
                <br />
                <span>Legal</span>
                <a href='/terms'>Terms of Service</a>
                <a href='/privacy'>Privacy Policy</a>
            </div>
            <div>
                <span>Partners</span>
                <a href='/partners'>Become a Partner</a>
                <br />
                <span>Resources</span>
                <a href='/status'>Status</a>
                <a href="/support">Support</a>
            </div>
        </footer>
    );
};

export default Footer;