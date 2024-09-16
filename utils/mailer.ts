import User from "@/model/userModel";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
type EmailObj = {
  emailTo: string;
  emailType: string;
  userId: string;
};

export const sendMail = async ({ emailTo, emailType, userId }: EmailObj) => {
  try {
    const hasedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hasedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgetPasswordToken: hasedToken,
        forgetPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "a45622ba4d1320",
        pass: "5827b07375b333",
      },
    });

    const emailVerify = `<p> Click <a href="${process.env.DOMAIN}/verifyemail?token=${hasedToken}">Here</a>
    to verify your email or copy and paste the link in your browser.
        <br />
      ${process.env.DOMAIN}/verifyemail?token=${hasedToken}
      </p>`;

    const resetPass = `<p> Click <a href="${process.env.DOMAIN}/resetpassword?token=${hasedToken}">Here</a> to rest your password or copy and paste the link in your browser.
        <br />
      ${process.env.DOMAIN}/resetpassword?token=${hasedToken}
      </p>`;

    const info = await transporter.sendMail({
      from: '"Haseeb" <devhaseeb4@gmail.com>',
      to: emailTo,
      subject:
        emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password",
      html: emailType === "VERIFY" ? emailVerify : resetPass,
    });

    console.log("Message sent: %s", info.messageId);
    return info.messageId;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};
