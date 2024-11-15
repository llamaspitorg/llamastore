'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../services/firebase";

const SignUpForm = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [checkUsername, setCheckUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (password !== confirmPassword) {
            setError("Passwords do not match");
        } else {
            setError(null);
        }
    }, [password, confirmPassword]);

    useEffect(() => {
        const checkUsernameAvailability = async () => {
            if (username === checkUsername) return;

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/check-username`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username: username }),
                });

                const data = await response.json();
                if (data.available) {
                    setError(null);
                } else {
                    setError("Username is already taken");
                }
            } catch (error) {
                setError("Error checking username availability");
            }
            setCheckUsername(username);
        };

        checkUsernameAvailability();
    }, [username, checkUsername]);

    const handleSignUp = async (event) => {
        event.preventDefault();
        setLoading(true);
        if (error) {
            setLoading(false);
            return;
        } else {
            setError(null);
        }

        if (password !== confirmPassword) {
            setLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${await user.getIdToken()}`,  // Include the Bearer token
                },
                body: JSON.stringify({ username: username, firebaseUid: user.uid }),
            });
            
            if (!response.ok) {
                console.error('Error:', await response.text());  // Log any response errors
            } else {
                await sendEmailVerification(user);
            }
            router.push("/clientarea");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {error && <div className='error'>{error}</div>}
            <form onSubmit={handleSignUp}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username} 
                        onChange={(event) => setUsername(event.target.value)}                       
                        required
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        minLength={6}
                    />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        required
                        minLength={6}
                    />
                </div>
                <button type="submit" disabled={loading}>Sign Up</button>
            </form>
        </div>
    );
};

export default SignUpForm;