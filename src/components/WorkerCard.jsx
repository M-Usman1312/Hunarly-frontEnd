import { ArrowUpRight, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import WorkerImage from "./WorkerImage.jsx";

function WorkerCard({ worker }) {
  return (
    <article className="worker-card">
      <div className="worker-card-top">
        <WorkerImage
          className="worker-avatar"
          name={worker.name}
          src={worker.image}
          alt={`Portrait of ${worker.name}`}
          loading="lazy"
        />
        <span className="worker-rating">
          <Star size={14} fill="currentColor" aria-hidden="true" />
          {worker.reviews ? worker.rating.toFixed(1) : "New"}
        </span>
      </div>
      <div className="worker-card-name">
        <div>
          <h3>{worker.name}</h3>
          <p>{worker.profession}</p>
        </div>
        <span className="worker-reviews">{worker.reviews} reviews</span>
      </div>
      <div className="worker-meta">
        <span>
          <MapPin size={15} aria-hidden="true" />
          {worker.location}
        </span>
        <span>{worker.experience}</span>
      </div>
      <Link
        className="worker-profile-link"
        to={`/workers/${encodeURIComponent(worker.id)}`}
        aria-label={`View ${worker.name}'s profile`}
      >
        View profile <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}

export default WorkerCard;
