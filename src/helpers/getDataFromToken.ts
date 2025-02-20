// In this also made a changes for the deployment

import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Define an interface for the token payload
interface TokenPayload {
    id: string;
    iat?: number;
    exp?: number;
}

export const getDataFromToken = (request: NextRequest): string | null => {
    try {
        // Extract token from cookies
        const token = request.cookies.get("token")?.value || "";

        // Verify and decode token with correct type
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as TokenPayload;

        return decodedToken.id;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unknown error occurred");
    }
};
