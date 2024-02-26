const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.contactFormHandler = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // Parse the form data
  const { name, email, subject, message } = req.body;

  // Simple validation
  if (!name || !email || !subject || !message) {
    res.status(400).send('Missing fields');
    return;
  }
  const successUrl = 'https://www.walz.tech/thank-you/';
  // Implement your email sending logic here.
  // This is a placeholder function that you'd replace with your actual email sending logic,
  // possibly using nodemailer or a third-party email service like SendGrid.
  sgMail.send({
    to: 'philipp@walz.tech',
    from: `${name} <hello@walz.tech>`,
    replyTo: email,
    subject: subject,
    text: `You have received a new message from ${name} (${email}):\n\n${message}`,
  })
    .then(() => res.redirect(successUrl))
    .catch((error) => {
      console.error('Failed to send message', error);
      res.status(500).send('Internal Server Error');
    });
};
