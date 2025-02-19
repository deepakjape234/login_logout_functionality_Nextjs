"use client";
import Link from "next/link";
import React, { useState }  from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const [buttonDisabled , setButtonDisabled] = useState(false);
    const [loading, setLoading] = useState(false);




    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log("Login success", response.data);
            toast.success("Login successful! Redirecting...");
            router.push("/profile");
        } catch (error: any) {
            console.log("Login failed", error.message);
            toast.error("Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    useEffect (() => {

        if(user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);

        }
        else {
            setButtonDisabled(true);
        }

    } , [user])


    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6">
                <h1 className="text-2xl font-semibold text-center text-gray-800">
                    {loading ? "Processing..." : "Log In"}
                </h1>
                <hr className="border-gray-300" />

                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            placeholder="Enter your email"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            placeholder="Enter your password"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                        />
                    </div>

                    <button
                        onClick={onLogin}
                        disabled={!user.email || !user.password || loading}
                        className={`w-full py-2 px-4 text-white font-semibold rounded-lg transition-all ${
                            !user.email || !user.password
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"
                        } ${loading && "animate-pulse"}`}
                    >
                        {loading ? "Logging in..." : "Log In"}
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-indigo-600 hover:underline">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );      
}
