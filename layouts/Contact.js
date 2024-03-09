import React, { useEffect, useCallback } from 'react';
import config from "@config/config.json";
import { markdownify } from "@lib/utils/textConverter";

const Contact = ({ data }) => {
  const { frontmatter } = data;
  const { title, info } = frontmatter;
  const { contact_form_action, recaptcha_site_key } = config.params; // Assume you've added recaptcha_site_key in your config


  useEffect(() => {
    // Dynamically insert the Google reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptcha_site_key}`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Remove the script when the component unmounts
      document.body.removeChild(script);
    };
  }, [recaptcha_site_key]);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(recaptcha_site_key, { action: 'submit' }).then(token => {
        // Add reCAPTCHA token to form data
        const formData = new FormData(event.target);
        formData.append('g-recaptcha-response', token);
        
        // Post form data with fetch API or your method of choice
        fetch(contact_form_action, {
          method: 'POST',
          body: formData,
        })
        .then(response => {
          // Handle response
          console.log('Form submitted', response);
        })
        .catch(error => {
          console.error('Error submitting form:', error);
        });
      });
    });
  }, [contact_form_action, recaptcha_site_key]);

  return (
    <section className="section">
      <div className="container">
        {markdownify(title, "h1", "text-center font-normal")}
        <div className="section row pb-0">
          <div className="col-12 md:col-6 lg:col-7">
            <form
              className="contact-form"
              method="POST"
              action="#"
              onSubmit={handleSubmit}
            >
              <div className="mb-3">
                <input
                  className="form-input w-full rounded"
                  name="name"
                  type="text"
                  placeholder="Name"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  className="form-input w-full rounded"
                  name="email"
                  type="email"
                  placeholder="Your email"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  className="form-input w-full rounded"
                  name="subject"
                  type="text"
                  placeholder="Subject"
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  name="message"
                  className="form-textarea w-full rounded-md"
                  rows="7"
                  placeholder="Your message"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Send Now
              </button>
            </form>
          </div>
          <div className="content col-12 md:col-6 lg:col-5">
            {markdownify(info.title, "h4")}
            {markdownify(info.description, "p", "mt-4")}
            <ul className="contact-list mt-5">
              {info.contacts.map((contact, index) => (
                <li key={index}>
                  {markdownify(contact, "strong", "text-dark")}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
