"use client";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = useState("nothing");

    const logout = async () => {
        try {
            await axios.get("/api/users/logout");
            toast.success("Logout successful");
            router.push('/login');
        } catch (error: any) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

    const getUserDetails = async () => {
        try {
            const res = await axios.get('/api/users/me');
            console.log(res.data);
            setData(res.data.data._id);
        } catch (error: any) {
            toast.error("Failed to fetch user details");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
                <FaUserCircle className="text-6xl text-gray-400 mx-auto mb-4" />
                <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
                <p className="text-gray-600 mb-4">Welcome to your profile page</p>

                <h2 className="text-lg font-medium text-gray-700 bg-green-100 px-4 py-2 rounded-lg">
                    {data === "nothing" ? "No Data Available" : (
                        <Link href={`/profile/${data}`} className="text-blue-600 hover:underline">
                            {data}
                        </Link>
                    )}
                </h2>

                <div className="mt-6 space-y-3">
                    <button
                        onClick={getUserDetails}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                    >
                        Get User Details
                    </button>

                    <button
                        onClick={logout}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
