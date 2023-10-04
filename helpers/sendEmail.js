import nodemailer from "nodemailer";
import "dotenv/config";

const {UKR_NET_EMAIL, UKR_NET_API_PASS} = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465, // 25, 465, 2525
  secure: true,
  auth: {
    user: UKR_NET_FROM,
    pass: UKR_NET_API_KEY,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const email = {
  from: UKR_NET_EMAIL,
  to: 'riwiy94211@gronasu.com',
  subject: 'test',
  html: "<strong>Testing</strong>"
}

transport.sendEmail(email)
.then(() => console.log('email send success'))
.catch(error => console.log(error.message))

const sendEmail = (data) => {
  const email = { ...data, from: UKR_NET_FROM };
  return transport.sendMail(email);
};

export default sendEmail;