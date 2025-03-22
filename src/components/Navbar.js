import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [sessionId, setSessionId] = useState('');
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate(); // Navigation hook

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const session = Cookies.get('sessionId');
                if (!session) {
                    console.log('No session ID found!');
                    return;
                }

                setSessionId(session);
                console.log('Session ID from cookie:', session);

                const response = await fetch('http://127.0.0.1:7843/auth/user', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    console.log('Failed to fetch user data:', response.statusText);
                    return;
                }

                const data = await response.json();

                if (data.success) {
                    setUser(data.user);
                    console.log('User data:', data.user);
                } else {
                    console.log('Failed to fetch user data:', data.message || 'Unknown error');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchUserData();
    }, []);

    // Toggle modal visibility
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    // Logout and redirect
    const handleLogout = async () => {
        try {
            // Make the logout request first
            const response = await fetch('http://127.0.0.1:7843/auth/logout', {
                method: 'GET',
                credentials: 'include', // Important: Include cookies in the request
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            // Check if logout was successful
            if (response.ok) {
                console.log('Logout successful');
                // Clear client-side data after server-side logout
                localStorage.clear();
                Cookies.remove('connect.sid', { path: '/' });
                Cookies.remove('sessionId', { path: '/' });
    
                // Redirect or reload the page
                window.location.href = '/';
            } else {
                console.error('Logout failed:', await response.json());
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };
    
    return (
        <>
            {/* Navbar */}
            <div className="bg-gray-800 p-4 flex justify-between items-center text-white">
                <div className="text-2xl font-bold">Ambak</div>
                {user ? (
                    <div className="flex items-center gap-3">
                        <img
                            src={user.photo}
                            alt="Profile"
                            className="w-10 h-10 rounded-full cursor-pointer"
                            onClick={toggleModal}
                        />
                        <button
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <p></p>
                )}
            </div>

            {/* Profile Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-80 relative text-center">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                            onClick={toggleModal}
                        >
                            ✕
                        </button>
                        <img
                            src={user.photo}
                            alt="Profile"
                            className="w-20 h-20 rounded-full mx-auto mb-4"
                        />
                        <h2 className="text-xl font-semibold">{user.displayName}</h2>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
