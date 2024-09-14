import nodemailer from "nodemailer";

type EmailObj = {
  emailTo: string;
  emailType: string;
  userId: string;
};

export const sendMail = async ({ emailTo, emailType, userId }: EmailObj) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 465,
      secure: true,
      auth: {
        user: "maddison53@ethereal.email",
        pass: "jn7jnAPss4f63QBp6D",
      },
    });
    const info = await transporter.sendMail({
      from: '"Haseeb" <devhaseeb4@gmail.com>',
      to: emailTo,
      subject:
        emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password",
      html: "<b>Hello world?</b>",
    });
    console.log("Message sent: %s", info.messageId);
    return info.messageId;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};
