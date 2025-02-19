import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    await connect(); // ✅ Ensure DB connection

    const reqBody = await request.json();
    const { email, password } = reqBody;

    console.log("🔍 Checking user:", email);

    // ✅ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }

    // ✅ Check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // ✅ Create token payload
    const tokenData = { id: user._id, username: user.username, email: user.email };

    // ✅ Create token (No `await` needed)
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" });

    // ✅ Set cookie correctly
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24}; Secure; SameSite=Strict`
    );

    console.log("✅ Login successful!");
    return response;
  } catch (error: any) {
    console.error("❌ Server Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
