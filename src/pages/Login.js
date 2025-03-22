import React from 'react';

const Login = () => {
    const handleGoogleLogin = () => {
        window.open('http://127.0.0.1:7843/auth/google', '_self');
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="p-8 bg-white rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Sign In</h2>
                <button
                    onClick={handleGoogleLogin}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
