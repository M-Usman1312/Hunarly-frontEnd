import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Star,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ContactModal from "../components/ContactModal.jsx";
import WorkerImage from "../components/WorkerImage.jsx";
import { getWorkerById } from "../utils/workerStorage.js";
import "./workers.css";

function WorkerProfile() {
  const { workerId } = useParams();
  const [contactOpen, setContactOpen] = useState(false);
  const [worker, setWorker] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [profileError, setProfileError] = useState("");
  const closeContact = useCallback(() => setContactOpen(false), []);

  useEffect(() => {
    setProfileLoaded(false);
    try {
      setWorker(getWorkerById(workerId));
      setProfileError("");
    } catch (error) {
      setWorker(null);
      setProfileError(
        error instanceof Error
          ? error.message
          : "This worker profile could not be loaded from this browser.",
      );
    } finally {
      setProfileLoaded(true);
    }
  }, [workerId]);

  if (!profileLoaded) {
    return <div className="profile-loading" role="status">Loading worker profile…</div>;
  }

  if (!worker) {
    return (
      <div className="profile-not-found">
        <span className="section-kicker">
          {profileError ? "Profile data unavailable" : "Profile unavailable"}
        </span>
        <h1>{profileError ? "We couldn’t load worker profiles." : "We couldn’t find that worker."}</h1>
        <p>{profileError || "The profile may have moved or the link may be incorrect."}</p>
        <Link className="button button-primary" to="/find-workers">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to workers
        </Link>
      </div>
    );
  }

  return (
    <div className="worker-profile-page">
      <div className="profile-page-inner">
        <Link className="profile-back-link" to="/find-workers">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to all workers
        </Link>

        <section className="profile-hero-card">
          <div className="profile-identity">
            <WorkerImage
              className="profile-avatar"
              name={worker.name}
              src={worker.image}
              alt={worker.name}
            />
            <div className="profile-title">
              <span className="profile-verified">
                <BriefcaseBusiness size={15} aria-hidden="true" />
                Hunarly worker profile
              </span>
              <h1>{worker.name}</h1>
              <p>{worker.profession}</p>
              <div className="profile-meta">
                <span>
                  <MapPin size={16} aria-hidden="true" />
                  {worker.location}
                </span>
                <span>
                  <BriefcaseBusiness size={16} aria-hidden="true" />
                  {worker.experience}
                </span>
                <span className="profile-rating">
                  <Star size={15} fill="currentColor" aria-hidden="true" />
                  {worker.reviews
                    ? `${worker.rating.toFixed(1)} (${worker.reviews} reviews)`
                    : "No reviews yet"}
                </span>
              </div>
            </div>
          </div>
          <div className="profile-hero-action">
            <span>Contact to discuss availability</span>
            <button
              className="button button-primary"
              type="button"
              onClick={() => setContactOpen(true)}
            >
              <MessageCircle size={17} aria-hidden="true" />
              Contact worker
            </button>
          </div>
        </section>

        <div className="profile-content-grid">
          <div className="profile-main-column">
            <section className="profile-section profile-about">
              <span className="section-kicker">A little introduction</span>
              <h2>About {worker.name.split(" ")[0]}</h2>
              <p>{worker.about}</p>
            </section>

            <section className="profile-section">
              <span className="section-kicker">Proof of good work</span>
              <h2>Portfolio</h2>
              <div className="portfolio-grid">
                {worker.portfolio.map((image, index) => (
                  <figure key={image}>
                    <WorkerImage
                      name={`${worker.profession} example ${index + 1}`}
                      src={image}
                      alt={`${worker.profession} example ${index + 1}`}
                      loading="lazy"
                    />
                    <figcaption>Recent {worker.category.toLowerCase()} work</figcaption>
                  </figure>
                ))}
              </div>
            </section>

            <section className="profile-section">
              <div className="review-section-heading">
                <div>
                  <span className="section-kicker">Community feedback</span>
                  <h2>Customer reviews</h2>
                </div>
                <span className="review-average">
                  <Star size={16} fill="currentColor" aria-hidden="true" />
                  {worker.reviews ? worker.rating.toFixed(1) : "New"}
                </span>
              </div>
              {worker.reviewsList?.length ? (
                <div className="reviews-list">
                  {worker.reviewsList.map((review) => (
                  <article className="review-card" key={`${review.name}-${review.date}`}>
                    <div className="review-card-heading">
                      <span className="review-customer-avatar" aria-hidden="true">
                        {review.name.charAt(0)}
                      </span>
                      <span>
                        <strong>{review.name}</strong>
                        <small>{review.date}</small>
                      </span>
                      <span className="review-stars" aria-label={`${review.rating} out of 5 stars`}>
                        {Array.from({ length: review.rating }, (_, index) => (
                          <Star key={index} size={13} fill="currentColor" aria-hidden="true" />
                        ))}
                      </span>
                    </div>
                    <p>{review.text}</p>
                  </article>
                  ))}
                </div>
              ) : (
                <p className="profile-no-reviews">
                  No reviews yet. Be the first to contact this worker.
                </p>
              )}
              {worker.reviews > 0 && (
                <p className="demo-data-note">
                  Ratings and reviews are sample demo content.
                </p>
              )}
            </section>
          </div>

          <aside className="profile-sidebar">
            <section className="profile-section profile-detail-card">
              <span className="section-kicker">What I can help with</span>
              <h2>Skills & services</h2>
              <div className="profile-skill-list">
                {worker.skills.map((skill) => (
                  <span className="profile-skill" key={skill}>
                    <CheckCircle2 size={14} aria-hidden="true" />
                    {skill}
                  </span>
                ))}
              </div>
              <div className="profile-services">
                <h3>Services offered</h3>
                {worker.services.map((service) => (
                  <span key={service}>
                    <span className="service-bullet" />
                    {service}
                  </span>
                ))}
              </div>
            </section>
            <section className="profile-contact-card">
              <span className="contact-card-icon">
                <MessageCircle size={20} aria-hidden="true" />
              </span>
              <h2>Have a job in mind?</h2>
              <p>Reach out to {worker.name.split(" ")[0]} to talk through the details.</p>
              <button
                className="button button-primary"
                type="button"
                onClick={() => setContactOpen(true)}
              >
                Contact worker <ArrowUpRight size={16} aria-hidden="true" />
              </button>
              <small>
                <CheckCircle2 size={13} aria-hidden="true" />
                Contact details are demo information
              </small>
            </section>
          </aside>
        </div>
      </div>
      {contactOpen && (
        <ContactModal worker={worker} onClose={closeContact} />
      )}
    </div>
  );
}

export default WorkerProfile;
