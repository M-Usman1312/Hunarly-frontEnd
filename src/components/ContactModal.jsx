import { useEffect, useRef } from "react";
import { MessageCircle, Phone, ShieldCheck, X } from "lucide-react";

function ContactModal({ worker, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [onClose]);

  const phoneDigits = worker.phone.replace(/\D/g, "");
  const whatsappNumber =
    phoneDigits.startsWith("0") && phoneDigits.length === 11
      ? `92${phoneDigits.slice(1)}`
      : phoneDigits;

  return (
    <div
      className="contact-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="contact-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        <button
          ref={closeButtonRef}
          className="contact-modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close contact details"
        >
          <X size={19} aria-hidden="true" />
        </button>
        <span className="contact-modal-icon">
          <MessageCircle size={23} aria-hidden="true" />
        </span>
        <span className="section-kicker">Connect directly</span>
        <h2 id="contact-modal-title">Contact {worker.name}</h2>
        <p>Reach out to discuss the service, timing, and details.</p>
        <a className="contact-detail-link" href={`tel:${worker.phone.replace(/\s/g, "")}`}>
          <span className="contact-detail-icon">
            <Phone size={18} aria-hidden="true" />
          </span>
          <span>
            <small>Phone number</small>
            <strong>{worker.phone}</strong>
          </span>
        </a>
        <a
          className="button button-primary whatsapp-link"
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={18} aria-hidden="true" />
          Continue on WhatsApp
        </a>
        <div className="demo-contact-note">
          <ShieldCheck size={16} aria-hidden="true" />
          Demo contact information for this prototype
        </div>
      </section>
    </div>
  );
}

export default ContactModal;
