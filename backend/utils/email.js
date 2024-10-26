const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

//How are we gonna call the email?
// new Email(user, url).sendWelcome();
//We will pass the user(to whom we are gonna send the email, all the detains of the user as a json object from db)
//We will pass the url(in some cases like forget/reset password)
//& finally we will call the send{%EMAIL%} method into that class(i.e. object constructor)


module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `NIT Raipur <${process.env.EMAIL_FROM}>`
    }

    constructTransporter() {
        if (process.env.NODE_ENV === 'production') {
            //Sendgrid
            // TODO
            return 1;
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async send(template, subject) { //Sends the actual email
        //1) Render Html based on pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject,
        })

        //2) Define Email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: convert(html, {})
        }

        //3) actually send the email
        await this.constructTransporter().sendMail(mailOptions);
        //sendMail method is provided by nodemailor
    };

    async sendWelcome() {
        await this.send('welcome', 'Hey folk! Welcome to the family of Rocks')
    }
}