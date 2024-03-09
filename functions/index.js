const corsOptions = {
  origin: 'https://walz.tech', // Replace with your actual domain
  optionsSuccessStatus: 200,
};
const cors = require('cors')(corsOptions);
const axios = require('axios');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.contactFormHandler = async (req, res) => {
  cors(req, res, async () => { // Wrap your existing handler with cors

    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    // Parse the form data
    const { name, email, subject, message, token } = req.body; // Include 'token' from reCAPTCHA

    // Simple validation
    if (!name || !email || !subject || !message || !token) {
      res.status(400).send('Missing fields');
      return;
    }

    // reCAPTCHA verification
    const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY; // Ensure this is set in your environment variables
    const RECAPTCHA_VERIFY_URL = `https://www.google.com/recaptcha/api/siteverify`;

    try {
      const recaptchaResponse = await axios.post(RECAPTCHA_VERIFY_URL, null, {
        params: {
          secret: RECAPTCHA_SECRET_KEY,
          response: token,
        },
      });

      const { success, score } = recaptchaResponse.data;
      // Adjust the score threshold as needed
      if (!success || score < 0.5) {
        res.status(400).send('reCAPTCHA verification failed');
        return;
      }
    } catch (error) {
      console.error('Error verifying reCAPTCHA:', error);
      res.status(500).send('Server error during reCAPTCHA verification');
      return;
    }

    const successUrl = 'https://www.walz.tech/thank-you/';
    // Proceed with email sending logic
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
  });
};
