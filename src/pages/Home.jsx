import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Compass,
  Handshake,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CategoryCard from "../components/CategoryCard.jsx";
import WorkerCard from "../components/WorkerCard.jsx";
import WorkerImage from "../components/WorkerImage.jsx";
import { categories, featuredWorkers } from "../data/homeData.js";

const customerSteps = [
  {
    number: "01",
    title: "Search for a service",
    description: "Tell us what you need and where you need it.",
    icon: Search,
  },
  {
    number: "02",
    title: "Explore worker profiles",
    description: "Compare local skills, experience, and reviews.",
    icon: UserRound,
  },
  {
    number: "03",
    title: "Contact a worker",
    description: "Choose your match and discuss the job directly.",
    icon: Handshake,
  },
];

const workerSteps = [
  {
    number: "01",
    title: "Register on Hunarly",
    description: "Create a profile that tells your story.",
    icon: UserRound,
  },
  {
    number: "02",
    title: "Showcase your skills",
    description: "Add your services, experience, and work.",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "Reach new customers",
    description: "Help nearby people find the right talent.",
    icon: TrendingUp,
  },
];

const benefits = [
  {
    title: "Easy worker discovery",
    description: "Find the right skill for the job without the endless search.",
    icon: Compass,
  },
  {
    title: "Local connections",
    description: "Meet skilled people who already know your neighborhood.",
    icon: MapPin,
  },
  {
    title: "More opportunities",
    description: "Give local talent a better way to reach new customers.",
    icon: TrendingUp,
  },
  {
    title: "Direct communication",
    description: "Connect with your chosen worker and talk through the details.",
    icon: Handshake,
  },
];

function StepsPanel({ audience, title, description, steps, tone }) {
  return (
    <article className={`steps-panel steps-panel-${tone}`}>
      <span className="steps-audience">{audience}</span>
      <h3>{title}</h3>
      <p className="steps-intro">{description}</p>
      <div className="steps-list">
        {steps.map(({ number, title: stepTitle, description: stepDescription, icon: Icon }) => (
          <div className="step-item" key={number}>
            <span className="step-icon">
              <Icon size={19} aria-hidden="true" />
            </span>
            <div className="step-copy">
              <span className="step-number">{number}</span>
              <h4>{stepTitle}</h4>
              <p>{stepDescription}</p>
            </div>
            <Check className="step-check" size={17} aria-hidden="true" />
          </div>
        ))}
      </div>
      <Link
        className="text-link"
        to={tone === "teal" ? "/become-a-worker" : "/find-workers"}
      >
        {tone === "teal" ? "Get started as a worker" : "Find a worker"}
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}

function Home() {
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  function handleSearch(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (service.trim()) params.set("q", service.trim());
    if (location.trim()) params.set("location", location.trim());
    navigate(`/find-workers${params.size ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="hero-eyebrow">
              <span className="eyebrow-dot" />
              Local talent, right around you
            </span>
            <h1>
              Find the Right Skill,
              <span> Right Around You.</span>
            </h1>
            <p className="hero-description">
              Connect with skilled local workers and get the help you need. Or
              showcase your skills and reach more customers with Hunarly.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary hero-primary" to="/find-workers">
                Find a worker <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link className="button button-secondary" to="/become-a-worker">
                Become a worker <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="hero-proof">
              <div className="proof-avatars" aria-hidden="true">
                {featuredWorkers.slice(0, 4).map((worker) => (
                  <WorkerImage
                    key={worker.id}
                    name={worker.name}
                    src={worker.image}
                    alt=""
                  />
                ))}
              </div>
              <div className="proof-copy">
                <span className="proof-stars">
                  <Star size={14} fill="currentColor" aria-hidden="true" />
                  <strong>4.9/5</strong>
                </span>
                <span>Trusted local talent, growing every day</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Local service professional at work">
            <div className="hero-photo">
              <WorkerImage
                name="Local service professional"
                src="https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1000&q=88"
                alt="Electrician working carefully on a home repair"
              />
              <div className="photo-shade" />
              <div className="hero-photo-caption">
                <span className="caption-icon">
                  <ShieldCheck size={18} aria-hidden="true" />
                </span>
                <span>
                  <strong>Skilled hands, close to home</strong>
                  <small>Find trusted help in your area</small>
                </span>
              </div>
            </div>
            <div className="floating-card floating-rating">
              <span className="floating-icon floating-icon-gold">
                <Star size={18} fill="currentColor" aria-hidden="true" />
              </span>
              <span>
                <strong>Top-rated talent</strong>
                <small>Community reviewed</small>
              </span>
            </div>
            <div className="floating-card floating-local">
              <span className="floating-icon floating-icon-teal">
                <MapPin size={18} aria-hidden="true" />
              </span>
              <span>
                <strong>Right around you</strong>
                <small>Local, ready to help</small>
              </span>
            </div>
            <span className="hero-visual-note">
              <ArrowDown size={14} aria-hidden="true" /> Good work starts nearby
            </span>
          </div>

          <form className="hero-search" onSubmit={handleSearch}>
            <label className="search-field">
              <Search size={19} aria-hidden="true" />
              <span>
                <span className="search-label">What do you need?</span>
                <input
                  type="search"
                  name="service"
                  placeholder="Try “plumber” or “math tutor”"
                  value={service}
                  onChange={(event) => setService(event.target.value)}
                />
              </span>
            </label>
            <span className="search-divider" aria-hidden="true" />
            <label className="search-field search-location">
              <MapPin size={19} aria-hidden="true" />
              <span>
                <span className="search-label">Your location</span>
                <input
                  type="text"
                  name="location"
                  placeholder="City or neighborhood"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                />
              </span>
            </label>
            <button className="button button-primary search-submit" type="submit">
              Search workers <Search size={16} aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>

      <section className="section-block categories-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Find your person</span>
            <h2>Popular services</h2>
            <p>Whatever the task, there’s a local skill for it.</p>
          </div>
          <Link className="section-link" to="/find-workers">
            Explore all services <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard category={category} key={category.name} />
          ))}
        </div>
      </section>

      <section className="section-block how-section">
        <div className="section-heading section-heading-centered">
          <div>
            <span className="section-kicker">Simple by design</span>
            <h2>Good work starts with a connection.</h2>
            <p>Whether you need a hand or have a skill to share, Hunarly makes it easy.</p>
          </div>
        </div>
        <div className="steps-grid">
          <StepsPanel
            audience="For customers"
            title="Get the help you need."
            description="A few simple steps to the right local professional."
            steps={customerSteps}
            tone="navy"
          />
          <StepsPanel
            audience="For skilled workers"
            title="Grow your work."
            description="Turn your experience into new local opportunities."
            steps={workerSteps}
            tone="teal"
          />
        </div>
      </section>

      <section className="section-block featured-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Meet the community</span>
            <h2>Skilled people. Real neighbors.</h2>
            <p>Get to know some of the talented workers on Hunarly.</p>
          </div>
          <Link className="section-link" to="/find-workers">
            Meet our workers <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="worker-grid">
          {featuredWorkers.map((worker) => (
            <WorkerCard worker={worker} key={worker.id} />
          ))}
        </div>
      </section>

      <section className="benefits-section">
        <div className="benefits-inner">
          <div className="benefits-heading">
            <span className="section-kicker section-kicker-light">
              A better way to get things done
            </span>
            <h2>Good for your home. Great for your community.</h2>
            <p>
              Hunarly makes local service simple while opening more doors for
              skilled people.
            </p>
            <Link className="benefits-link" to="/about">
              Get to know Hunarly <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="benefit-grid">
            {benefits.map(({ title, description, icon: Icon }, index) => (
              <article className="benefit-card" key={title}>
                <span className="benefit-icon">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="benefit-index">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta-section">
        <div className="final-cta-card">
          <span className="cta-sparkle">
            <Sparkles size={20} aria-hidden="true" />
          </span>
          <span className="section-kicker">Make your next move</span>
          <h2>Your Skills Deserve More Opportunities.</h2>
          <p>
            Find the help you need or let more people discover what you do best.
          </p>
          <div className="final-cta-actions">
            <Link className="button button-primary" to="/find-workers">
              I need a service <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link className="button button-secondary" to="/become-a-worker">
              I’m a skilled worker <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
