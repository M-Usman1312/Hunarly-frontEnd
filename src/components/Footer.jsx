import { ArrowUpRight, Instagram, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Find Workers", to: "/find-workers" },
  { label: "Become a Worker", to: "/become-a-worker" },
  { label: "About Hunarly", to: "/about" },
  { label: "Contact Us", to: "/contact" },
  { label: "FAQ", to: "/faq" },
];

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-main">
          <div className="footer-brand-column">
            <Link className="brand footer-brand" to="/">
              <span className="brand-mark" aria-hidden="true">
                h
              </span>
              <span>hunarly</span>
            </Link>
            <p>
              Connecting local talent with the people who need it. Your Hunar,
              Your Opportunity.
            </p>
          </div>

          <div className="footer-link-column">
            <h2>Explore</h2>
            {footerLinks.map(({ label, to }) => (
              <Link key={to} to={to}>
                {label}
              </Link>
            ))}
          </div>

          <div className="footer-link-column footer-contact">
            <h2>Say hello</h2>
            <a href="mailto:hello@hunarly.com">
              <Mail size={16} aria-hidden="true" />
              hello@hunarly.com
            </a>
            <div className="social-links" aria-label="Social media">
              <a href="https://www.instagram.com/" aria-label="Instagram">
                <Instagram size={17} aria-hidden="true" />
              </a>
              <a href="https://www.linkedin.com/" aria-label="LinkedIn">
                <Linkedin size={17} aria-hidden="true" />
              </a>
              <a href="mailto:hello@hunarly.com" aria-label="Email Hunarly">
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Hunarly. All rights reserved.</span>
          <span>Built for skills, community, and opportunity.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
