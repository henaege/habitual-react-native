/* eslint no-console: 0 */
'use strict';
const bunyan = require('bunyan');
const nodemailer = require('nodemailer');
const config = require('./config/config');
// Message object
function sendEmail(userInfo){
    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: config.gmail,
            pass:  config.gmailPassword
        },
        logger: bunyan.createLogger({
            name: 'nodemailer'
        }),
        debug: true // include SMTP traffic in the logs
    }, {
        // default message fields
        // sender info
        from: `Hello <${config.gmail}>`
    });
    console.log('SMTP Configured');
    let message = {
        // Comma separated list of recipients
        to: `<${userInfo.email}>`,
        // Subject of the message
        subject: 'Notification from Habitual', //
        // plaintext body in case an old email client
        text: `Hey, you haven't checked in with your ${userInfo.name} for one week.`,
        // HTML body
        html: "<p><b>We haven't seen you for a week</b></p>" +
            `<p>Hey, you haven't checked in with your ${userInfo.name} for one week.</p>`,
        // Apple Watch specific HTML body
        watchHtml: '<b>Keep Up</b> to your habit',
        // An array of attachments
        attachments: [
        ]
    };
    console.log('Sending Mail');
    transporter.sendMail(message, (error, info) => {
        if (error) {
            console.log('Error occurred');
            console.log(error.message);
            return;
        }
        console.log('Message sent successfully!');
        console.log('Server responded with "%s"', info.response);
        transporter.close();
    });
}

module.exports = sendEmail;