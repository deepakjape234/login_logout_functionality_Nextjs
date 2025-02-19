//  In thsi also changes are made for the deploymemt

"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";

export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    const verifyUserEmail = useCallback(async () => {
        try {
            await axios.post("/api/users/verifyemail", { token });
            setVerified(true);
        } catch (error: unknown) {  // ✅ Explicitly define 'error' as 'unknown'
            setError(true);

            if (axios.isAxiosError(error)) {
                console.log(error.response?.data || "Unknown Axios error");
            } else {
                console.log("An unexpected error occurred:", error);
            }
        }
    }, [token]);  // ✅ Memoized function to avoid React warnings

    useEffect(() => {
        const urlToken = new URLSearchParams(window.location.search).get("token");
        setToken(urlToken || "");
    }, []);

    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail();
        }
    }, [token, verifyUserEmail]);  // ✅ Now 'verifyUserEmail' is included

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-gray-800">Verify Your Email</h1>

                <h2 className="mt-4 p-2 rounded-lg bg-orange-500 text-white font-mono break-words">
                    {token ? token : "No Token"}
                </h2>

                {verified && (
                    <div className="mt-6">
                        <h2 className="text-2xl text-green-600 font-semibold animate-fade-in">
                            ✅ Email Verified Successfully!
                        </h2>
                        <Link href="/login">
                            <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
                                Go to Login
                            </button>
                        </Link>
                    </div>
                )}

                {error && (
                    <div className="mt-6">
                        <h2 className="text-2xl text-red-600 font-semibold bg-red-100 p-2 rounded-md animate-shake">
                            ❌ Verification Failed
                        </h2>
                    </div>
                )}
            </div>
        </div>
    );
}
