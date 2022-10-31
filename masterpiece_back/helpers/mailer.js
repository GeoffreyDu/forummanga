import nodemailer from 'nodemailer'
import { app_mail, smtp_password } from '../config/index.js';

export const sendMail = (to, subject, template) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
        user: app_mail,
        pass: smtp_password
        }
    });
    
    const mailOptions = {
    from: app_mail,
    to,
    subject,
    html:  template
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
  }