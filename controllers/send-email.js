const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const { EMAIL, PASSWORD } = require('./env');

const sendEmail = (req, res) => {
    let config = {
        service: "gmail",
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    };

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Mailgen',
            link: 'https://mailgen.js/'
        }
    });

    let response = {
        body: {
            name: 'Testing nodemailer',
            intro: 'Your bill has arrived',
            table: {
                data: [
                    {
                        item: 'Nodemailer Stack Book',
                        description: 'A Backend application',
                        price: '$10.99'
                    }
                ]
            },
            outro: 'Looking forward to do more business'
        }
    };

    // let mail = MailGenerator.generate(response);

    let mail = `
        <h1>Hello Mr. Long</h1>
        <p>This is a testing email in html format</p>
    `

    let message = {
        from: EMAIL,
        to: req.body.email,
        subject: req.body.subj,
        // text: req.body.message
        html: mail
    }

    transporter.sendMail(message).then(() => {
        return res.status(201).json({
            message: 'You should receive an email'
        })
    }).catch((error) => {return res.status(500).json({error})})
};

module.exports = sendEmail;