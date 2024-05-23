// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');


const sendEmail = async options =>{
    
    // 1)Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass:process.env.EMAIL_PASSWORD
      },
    });

    //2)Define the email Options
    const mailOptions = {
      //from the source we r sending the mail
      from: 'Manu <manuknkn@gmail.com>',
      //this mail,subject,text comes to options parameter to the parent function
      to: options.email,
      subject: options.subject,
      text: options.message,
    //   html:
    };
    //3) Actually sends the email
   await transporter.sendMail(mailOptions)
}

module.exports = sendEmail