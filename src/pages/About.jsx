import {
  ArrowRight,
  BriefcaseBusiness,
  Compass,
  Handshake,
  HeartHandshake,
  Lightbulb,
  MapPin,
  Target,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./information-pages.css";

const customerBenefits = [
  "Search local workers by profession and location.",
  "Compare experience, skills, services, and sample reviews.",
  "Contact a professional directly to discuss a job.",
];

const workerBenefits = [
  "Create a profile with your skills and services.",
  "Show your experience to people searching nearby.",
  "Share a direct contact option with potential customers.",
];

function About() {
  return (
    <div className="info-page about-page">
      <section className="info-hero about-hero">
        <div className="info-hero-inner">
          <span className="info-eyebrow">
            <span />
            Skills bring us together
          </span>
          <h1>Good work deserves to be found.</h1>
          <p>
            Hunarly connects people looking for local services with skilled
            professionals in their area.
          </p>
          <div className="about-hero-actions">
            <Link className="button button-primary" to="/find-workers">
              Find a worker <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link className="info-hero-text-link" to="/become-a-worker">
              Share your skills
            </Link>
          </div>
          <div className="about-hero-icon" aria-hidden="true">
            <HeartHandshake size={42} strokeWidth={1.35} />
          </div>
        </div>
      </section>

      <section className="info-content info-overview">
        <div className="info-section-heading">
          <span className="section-kicker">What is Hunarly?</span>
          <h2>A simpler way to find local skills.</h2>
        </div>
        <p className="info-lead">
          Hunarly is a local service marketplace. Customers can explore worker
          profiles for services in their area, while skilled professionals can
          introduce their experience and services to nearby customers.
        </p>
        <div className="about-story-card">
          <span className="about-story-icon">
            <Lightbulb size={22} aria-hidden="true" />
          </span>
          <div>
            <span className="section-kicker">Our story</span>
            <h3>A useful connection, made local.</h3>
            <p>
              Hunarly is built around a straightforward idea: finding help
              should be easier, and a person’s practical skills should have
              room to be seen. The platform brings those two needs together
              through local search and worker profiles.
            </p>
          </div>
        </div>
      </section>

      <section className="info-problem-section">
        <div className="info-content problem-grid">
          <div>
            <span className="section-kicker">The need</span>
            <h2>Making local work easier to discover.</h2>
            <p>
              People often rely on scattered recommendations to find a
              professional. At the same time, skilled workers may find it
              difficult to introduce their services to people nearby. Hunarly
              offers one place to browse local profiles and present those
              skills.
            </p>
          </div>
          <div className="problem-illustration" aria-hidden="true">
            <span className="problem-orbit problem-orbit-one" />
            <span className="problem-orbit problem-orbit-two" />
            <span className="problem-center">
              <Handshake size={31} />
            </span>
            <span className="problem-node problem-node-one">
              <UsersRound size={19} />
            </span>
            <span className="problem-node problem-node-two">
              <BriefcaseBusiness size={19} />
            </span>
            <span className="problem-node problem-node-three">
              <MapPin size={18} />
            </span>
          </div>
        </div>
      </section>

      <section className="info-content mission-vision-section">
        <div className="mission-vision-grid">
          <article className="mission-card">
            <span className="mission-card-icon">
              <Target size={21} aria-hidden="true" />
            </span>
            <span className="section-kicker">Our mission</span>
            <h2>Make skills easier to find and work easier to reach.</h2>
            <p>
              To make finding skilled workers easier while helping local
              professionals reach more customers and discover new work
              opportunities.
            </p>
          </article>
          <article className="mission-card mission-card-teal">
            <span className="mission-card-icon">
              <Compass size={21} aria-hidden="true" />
            </span>
            <span className="section-kicker">Our vision</span>
            <h2>A fair opportunity to show what you can do.</h2>
            <p>
              A community where every skilled person has a fair opportunity to
              showcase their abilities and grow professionally.
            </p>
          </article>
        </div>
      </section>

      <section className="info-how-section">
        <div className="info-content">
          <div className="info-section-heading info-section-heading-centered">
            <span className="section-kicker">How Hunarly works</span>
            <h2>Two sides, one local connection.</h2>
            <p>Explore a profile, find a match, and take the conversation forward.</p>
          </div>
          <div className="info-audience-grid">
            <article className="info-audience-card">
              <span className="info-audience-icon">
                <UsersRound size={21} aria-hidden="true" />
              </span>
              <h3>For customers</h3>
              <p>Discover local professionals for the work you need done.</p>
              <ul>
                <li>Search workers by name, service, and location.</li>
                <li>Review profile skills, experience, and sample feedback.</li>
                <li>Contact a worker directly to discuss your needs.</li>
              </ul>
              <Link className="info-inline-link" to="/find-workers">
                Browse workers <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </article>
            <article className="info-audience-card info-audience-worker">
              <span className="info-audience-icon">
                <BriefcaseBusiness size={21} aria-hidden="true" />
              </span>
              <h3>For skilled workers</h3>
              <p>Introduce your services to people looking for local help.</p>
              <ul>
                <li>Create a profile with your location and experience.</li>
                <li>List the skills and services you offer.</li>
                <li>Let customers find your profile and contact you.</li>
              </ul>
              <Link className="info-inline-link" to="/become-a-worker">
                Create a worker profile <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="info-content benefits-info-section">
        <div className="info-section-heading">
          <span className="section-kicker">Designed for both sides</span>
          <h2>Useful tools for local connections.</h2>
        </div>
        <div className="benefits-info-grid">
          <article className="benefits-info-card">
            <span className="section-kicker">For customers</span>
            <h3>Find a professional that fits your needs.</h3>
            <ul>
              {customerBenefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </article>
          <article className="benefits-info-card benefits-info-card-teal">
            <span className="section-kicker">For workers</span>
            <h3>Make your skills visible to nearby people.</h3>
            <ul>
              {workerBenefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="sdg-section">
        <div className="info-content sdg-content">
          <span className="sdg-number">8</span>
          <div>
            <span className="section-kicker">A connection to the UN SDGs</span>
            <h2>Decent Work and Economic Growth</h2>
            <p>
              Hunarly’s aim of helping skilled people present their services
              and reach more customers aligns with the intent of UN Sustainable
              Development Goal 8: promoting inclusive and sustainable economic
              growth, productive employment, and decent work. Hunarly is an
              independent project and does not claim UN affiliation or
              endorsement.
            </p>
          </div>
        </div>
      </section>
      <section className="info-bottom-cta">
        <h2>Ready to make a local connection?</h2>
        <p>Find a service or introduce your skills to your community.</p>
        <div>
          <Link className="button button-primary" to="/find-workers">
            Find workers
          </Link>
          <Link className="button button-secondary" to="/become-a-worker">
            Join as a worker
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;
