const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  /*
    // 0) if we are to use email for it ... we should do it like this
    const transport = nodemailer.createTransport({
        service: 'Gmail',
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
        // In my gmail i will also need to activate the 'less secure app' option 
    })
*/
  // 1) creating a email transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    logger: true, //   detailed logs
    debug: true,
  });

  // 2) Define the email option
  const emailOptions = {
    from: 'seleb solomon <seleb@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html
  };

  //3) Acctually sending the email with nodemailer
  try {
    await transporter.verify();
    console.log('✅ SMTP server is ready to take messages');

    await transporter.sendMail(emailOptions);
    console.log('📨 Email sent!');
  } catch (err) {
    console.error('❌ Email error:', err);
    throw err;
  }
};

module.exports = sendEmail;
