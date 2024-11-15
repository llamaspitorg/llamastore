'use client';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../services/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const GoogleAuth = () => {
    const googleProvider = new GoogleAuthProvider();

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const createdAt = result.user.metadata.creationTime;
            const lastLogin = result.user.metadata.lastSignInTime;

            if (createdAt === lastLogin) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${await result.user.getIdToken()}`
                    },
                    body: JSON.stringify({ firebaseUid: result.user.uid, username: result.user.displayName }),
                });

                if (!response.ok) {
                    console.error('Error:', await response.text());
                }

                window.location.href = '/';
            } else {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${await result.user.getIdToken()}`,
                    },
                });

                if (!response.ok) {
                    console.error('Error:', await response.text());
                }

                window.location.href = '/';
            }
        } catch (error) {
            console.error("Error signing in with Google:", error.message);
        }
    }

    return (
        <div>
            <button id="googlebtn" onClick={signInWithGoogle}>
                <FontAwesomeIcon icon={faGoogle} />
            </button>
        </div>
    );
};

export default GoogleAuth;