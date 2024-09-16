import { connect } from "@/config/dbConfig";
import User from "@/model/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendMail } from "@/utils/mailer";

connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log(reqBody);
    const { username, email, password } = reqBody;
    const user = await User.find({ email });

    // Checking is user already in database
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hasing password
    const salt = await bcrypt.genSalt(10);
    const hashpass = bcrypt.hash(password, salt);

    //Creating new user
    const newUser = new User({
      username,
      email,
      password: hashpass,
    });

    // Saving user
    const savedUser = await newUser.save();
    console.log(savedUser);

    //send verification email
    await sendMail({
      emailTo: email,
      emailType: "VERIFY",
      userId: savedUser._id,
    });

    return NextResponse.json({
      message: "User Registered Successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
