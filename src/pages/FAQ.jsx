import { useState } from "react";
import { ArrowDown, ArrowUpRight, CircleHelp } from "lucide-react";
import { Link } from "react-router-dom";
import "./information-pages.css";

const faqGroups = [
  {
    title: "General",
    questions: [
      {
        question: "What is Hunarly?",
        answer:
          "Hunarly is a frontend marketplace prototype that helps people explore local service-worker profiles and lets skilled professionals present their skills and services.",
      },
      {
        question: "How does Hunarly work?",
        answer:
          "Customers can search the worker directory by name, profession, location, experience, and rating, then open a profile and use its demo contact options. Workers can submit a profile that is saved in the current browser.",
      },
      {
        question: "Is Hunarly free to use?",
        answer:
          "This prototype has no payment flow or paid features. It is a demonstration of the marketplace experience, not a live commercial service.",
      },
    ],
  },
  {
    title: "For Customers",
    questions: [
      {
        question: "How can I find a worker?",
        answer:
          "Open Find Workers, then search by a worker’s name, profession, skill, or service. You can combine that search with location, profession, experience, and rating filters.",
      },
      {
        question: "How can I contact a worker?",
        answer:
          "Open a worker’s profile and choose Contact Worker. The prototype displays sample phone details and a WhatsApp link. Contact information is demo data and may not reach a real person.",
      },
      {
        question: "How can I choose a suitable professional?",
        answer:
          "Compare the profile’s profession, location, experience, skills, services, and sample reviews. Profiles and reviews are demonstration content; Hunarly does not verify workers or guarantee service quality.",
      },
    ],
  },
  {
    title: "For Workers",
    questions: [
      {
        question: "How can I register as a worker?",
        answer:
          "Choose Become a Worker and complete the profile form. The profile is saved in LocalStorage in this browser and appears in its worker directory.",
      },
      {
        question: "Can I update my profile?",
        answer:
          "The current prototype supports profile creation, but does not yet include editing or profile-management controls. Worker profiles are stored locally in the browser.",
      },
      {
        question: "How can I get more customers?",
        answer:
          "A complete profile with clear skills, services, experience, and location can help customers understand what you offer in the prototype. Hunarly does not promise leads, bookings, or work.",
      },
    ],
  },
];

function FAQ() {
  const [openQuestion, setOpenQuestion] = useState("General-0");

  return (
    <div className="info-page faq-page">
      <section className="info-hero faq-hero">
        <div className="info-hero-inner">
          <span className="info-eyebrow">
            <span />
            Answers, made clear
          </span>
          <h1>Frequently Asked Questions</h1>
          <p>
            Learn how the Hunarly prototype works for customers and skilled
            workers.
          </p>
          <CircleHelp className="faq-hero-icon" size={76} strokeWidth={1.2} aria-hidden="true" />
        </div>
      </section>

      <section className="info-content faq-content">
        <div className="faq-intro">
          <span className="section-kicker">Good to know</span>
          <h2>Common questions about Hunarly.</h2>
          <p>
            These answers describe features currently available in this
            frontend demo.
          </p>
        </div>
        <div className="faq-groups">
          {faqGroups.map((group) => (
            <section className="faq-group" key={group.title}>
              <h3>{group.title}</h3>
              <div className="faq-list">
                {group.questions.map(({ question, answer }, index) => {
                  const key = `${group.title}-${index}`;
                  const isOpen = openQuestion === key;
                  const answerId = `faq-answer-${group.title
                    .toLocaleLowerCase()
                    .replace(/\s+/g, "-")}-${index}`;

                  return (
                    <article
                      className={`faq-item${isOpen ? " faq-item-open" : ""}`}
                      key={question}
                    >
                      <h4>
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={answerId}
                          onClick={() =>
                            setOpenQuestion((current) => (current === key ? "" : key))
                          }
                        >
                          <span>{question}</span>
                          <ArrowDown size={17} aria-hidden="true" />
                        </button>
                      </h4>
                      <div
                        className="faq-answer-wrap"
                        id={answerId}
                        aria-hidden={!isOpen}
                      >
                        <div>
                          <p>{answer}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
        <div className="faq-contact-cta">
          <div>
            <h3>Still have a question?</h3>
            <p>Send us a note. The contact form provides demo-only feedback.</p>
          </div>
          <Link className="button button-primary" to="/contact">
            Contact us <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default FAQ;
