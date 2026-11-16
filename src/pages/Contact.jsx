import { useRef, useState } from "react";
import {
  CheckCircle2,
  Mail,
  MessageSquareText,
  ShieldAlert,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./information-pages.css";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Contact() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const submissionLock = useRef(false);

  function updateField(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setStatus("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (submissionLock.current) return;

    const nextErrors = {};
    if (values.name.trim().length < 2) nextErrors.name = "Enter your full name.";
    if (!emailPattern.test(values.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (values.subject.trim().length < 3) {
      nextErrors.subject = "Add a short subject.";
    }
    if (values.message.trim().length < 10) {
      nextErrors.message = "Please enter a message of at least 10 characters.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus("Please check the highlighted fields.");
      return;
    }

    submissionLock.current = true;
    setStatus("success");
    setValues({ name: "", email: "", subject: "", message: "" });
    submissionLock.current = false;
  }

  return (
    <div className="info-page contact-page">
      <section className="info-hero contact-hero">
        <div className="info-hero-inner">
          <span className="info-eyebrow">
            <span />
            We’re here to listen
          </span>
          <h1>Let’s talk.</h1>
          <p>
            Have a question about Hunarly? Send a demo message or reach us by
            email.
          </p>
        </div>
      </section>

      <section className="info-content contact-layout">
        <div className="contact-side">
          <span className="section-kicker">Get in touch</span>
          <h2>Tell us what’s on your mind.</h2>
          <p>
            We welcome questions and feedback about the Hunarly prototype.
            Messages submitted through this form stay in this demo and are not
            delivered to a team.
          </p>
          <a className="contact-info-card" href="mailto:hello@hunarly.com">
            <span className="contact-info-icon">
              <Mail size={20} aria-hidden="true" />
            </span>
            <span>
              <small>Email</small>
              <strong>hello@hunarly.com</strong>
            </span>
          </a>
          <div className="contact-info-card contact-info-demo">
            <span className="contact-info-icon">
              <ShieldAlert size={20} aria-hidden="true" />
            </span>
            <span>
              <small>Demo form</small>
              <strong>Messages are not sent</strong>
            </span>
          </div>
          <p className="contact-faq-prompt">
            Looking for a quick answer?{" "}
            <Link to="/faq">Visit the FAQ</Link>
          </p>
        </div>

        <form className="contact-form" noValidate onSubmit={handleSubmit}>
          <div className="contact-form-title">
            <span>
              <MessageSquareText size={20} aria-hidden="true" />
            </span>
            <div>
              <h2>Send us a message</h2>
              <p>All fields are required.</p>
            </div>
          </div>
          {status === "success" && (
            <p className="contact-status contact-status-success" role="status">
              <CheckCircle2 size={17} aria-hidden="true" />
              Thanks for your message. This is demo feedback only; nothing was
              sent or saved.
            </p>
          )}
          {status && status !== "success" && (
            <p className="contact-status contact-status-error" role="alert">
              {status}
            </p>
          )}
          <label className="contact-field">
            <span>Full name</span>
            <input
              autoComplete="name"
              name="name"
              value={values.name}
              onChange={updateField}
              placeholder="Your full name"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <small>{errors.name}</small>}
          </label>
          <label className="contact-field">
            <span>Email address</span>
            <input
              autoComplete="email"
              name="email"
              type="email"
              value={values.email}
              onChange={updateField}
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <small>{errors.email}</small>}
          </label>
          <label className="contact-field">
            <span>Subject</span>
            <input
              name="subject"
              value={values.subject}
              onChange={updateField}
              placeholder="What would you like to discuss?"
              aria-invalid={Boolean(errors.subject)}
            />
            {errors.subject && <small>{errors.subject}</small>}
          </label>
          <label className="contact-field">
            <span>Message</span>
            <textarea
              name="message"
              rows="5"
              maxLength="1200"
              value={values.message}
              onChange={updateField}
              placeholder="Write your message here..."
              aria-invalid={Boolean(errors.message)}
            />
            {errors.message && <small>{errors.message}</small>}
          </label>
          <button className="button button-primary contact-submit" type="submit">
            Submit demo message
          </button>
          <span className="contact-form-footnote">
            Submitting only displays a confirmation on this page. No backend is
            connected.
          </span>
        </form>
      </section>
    </div>
  );
}

export default Contact;
