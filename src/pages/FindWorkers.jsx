import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  FilterX,
  MapPin,
  Search,
  SlidersHorizontal,
  UsersRound,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import WorkerCard from "../components/WorkerCard.jsx";
import { workers } from "../data/workers.js";
import { getAllWorkers } from "../utils/workerStorage.js";
import "./workers.css";

function FindWorkers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [workerList, setWorkerList] = useState(workers);
  const [directoryError, setDirectoryError] = useState("");
  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  const [location, setLocation] = useState(
    () => searchParams.get("location") || "",
  );
  const [category, setCategory] = useState(() => searchParams.get("category") || "");
  const [experience, setExperience] = useState("");
  const [minimumRating, setMinimumRating] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const categories = useMemo(
    () => [...new Set(workerList.map((worker) => worker.category))].sort(),
    [workerList],
  );

  useEffect(() => {
    const canonicalCategory = categories.find(
      (item) => item.toLocaleLowerCase() === category.toLocaleLowerCase(),
    );
    if (canonicalCategory && canonicalCategory !== category) {
      setCategory(canonicalCategory);
    }
  }, [categories, category]);

  useEffect(() => {
    function refreshWorkers() {
      try {
        setWorkerList(getAllWorkers());
        setDirectoryError("");
      } catch (error) {
        setDirectoryError(
          error instanceof Error
            ? error.message
            : "Worker profiles could not be loaded from this browser.",
        );
      }
    }

    refreshWorkers();
    window.addEventListener("storage", refreshWorkers);
    window.addEventListener("hunarly:workers-updated", refreshWorkers);
    return () => {
      window.removeEventListener("storage", refreshWorkers);
      window.removeEventListener("hunarly:workers-updated", refreshWorkers);
    };
  }, []);

  useEffect(() => {
    const legacyWorkerId = searchParams.get("worker");
    if (legacyWorkerId && workerList.some((worker) => worker.id === legacyWorkerId)) {
      navigate(`/workers/${encodeURIComponent(legacyWorkerId)}`, { replace: true });
    }
  }, [navigate, searchParams, workerList]);

  const matchingWorkers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const normalizedLocation = location.trim().toLocaleLowerCase();

    return workerList
      .filter((worker) => {
        const searchableText = [
          worker.name,
          worker.profession,
          worker.category,
          ...worker.skills,
          ...worker.services,
        ]
          .join(" ")
          .toLocaleLowerCase();

        if (normalizedQuery && !searchableText.includes(normalizedQuery)) {
          return false;
        }
        if (
          normalizedLocation &&
          !worker.location.toLocaleLowerCase().includes(normalizedLocation)
        ) {
          return false;
        }
        if (
          category &&
          worker.category.toLocaleLowerCase() !== category.toLocaleLowerCase()
        ) {
          return false;
        }
        if (experience === "0-2" && worker.experienceYears > 2) return false;
        if (experience === "3-5" && (worker.experienceYears < 3 || worker.experienceYears > 5)) {
          return false;
        }
        if (experience === "6-10" && (worker.experienceYears < 6 || worker.experienceYears > 10)) {
          return false;
        }
        if (experience === "11+" && worker.experienceYears < 11) return false;
        if (minimumRating && worker.rating < Number(minimumRating)) return false;
        return true;
      })
      .sort((first, second) =>
        sortBy === "experience"
          ? second.experienceYears - first.experienceYears ||
            second.rating - first.rating
          : second.rating - first.rating ||
            second.experienceYears - first.experienceYears,
      );
  }, [category, experience, location, minimumRating, query, sortBy, workerList]);

  const activeFilters = [
    query.trim() && `Search: ${query.trim()}`,
    location.trim() && `Location: ${location.trim()}`,
    category && `Profession: ${category}`,
    experience && `Experience: ${experience} years`,
    minimumRating && `Rating: ${minimumRating}+ stars`,
  ].filter(Boolean);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
    setLocation(searchParams.get("location") || "");
    setCategory(searchParams.get("category") || "");
  }, [searchParams]);

  function clearFilters() {
    setSearchParams({}, { replace: true });
    setQuery("");
    setLocation("");
    setCategory("");
    setExperience("");
    setMinimumRating("");
    setSortBy("rating");
  }

  return (
    <div className="discovery-page">
      <section className="discovery-hero">
        <div className="discovery-hero-inner">
          <div className="discovery-hero-copy">
            <span className="section-kicker">A good match is close by</span>
            <h1>Find Skilled Workers Near You</h1>
            <p>
              Explore local professionals, compare their experience, and find
              the right person for your next job.
            </p>
            <div className="discovery-trust">
              <span>
                <UsersRound size={16} aria-hidden="true" />
                {workerList.length} skilled local profiles
              </span>
              <span>
                <BriefcaseBusiness size={16} aria-hidden="true" />
                Across {categories.length} service categories
              </span>
            </div>
          </div>
          <div className="discovery-hero-art" aria-hidden="true">
            <span className="discovery-art-icon">
              <Search size={33} />
            </span>
            <span className="discovery-art-pin discovery-art-pin-one">
              <MapPin size={18} />
            </span>
            <span className="discovery-art-pin discovery-art-pin-two">
              <MapPin size={15} />
            </span>
            <span className="discovery-art-pin discovery-art-pin-three">
              <MapPin size={17} />
            </span>
          </div>
        </div>
      </section>

      <section className="discovery-content">
        <div className="discovery-toolbar">
          <div>
            <span className="section-kicker">Your neighborhood network</span>
            <h2>Browse local talent</h2>
          </div>
          <span className="results-count" aria-live="polite">
            {matchingWorkers.length}{" "}
            {matchingWorkers.length === 1 ? "worker" : "workers"} found
          </span>
        </div>

        {directoryError && (
          <p className="directory-error" role="alert">
            {directoryError} Demo profiles are still available below.
          </p>
        )}

        <div className="filter-panel">
          <label className="filter-control filter-search">
            <span className="filter-label">Name or profession</span>
            <span className="filter-input-wrap">
              <Search size={17} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try “Ahmed” or “electrician”"
              />
            </span>
          </label>
          <label className="filter-control filter-location">
            <span className="filter-label">Location</span>
            <span className="filter-input-wrap">
              <MapPin size={17} aria-hidden="true" />
              <input
                type="search"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="City or neighborhood"
              />
            </span>
          </label>
          <label className="filter-control">
            <span className="filter-label">Profession</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">All professions</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="filter-control">
            <span className="filter-label">Experience</span>
            <select
              value={experience}
              onChange={(event) => setExperience(event.target.value)}
            >
              <option value="">Any experience</option>
              <option value="0-2">0–2 years</option>
              <option value="3-5">3–5 years</option>
              <option value="6-10">6–10 years</option>
              <option value="11+">11+ years</option>
            </select>
          </label>
          <label className="filter-control">
            <span className="filter-label">Minimum rating</span>
            <select
              value={minimumRating}
              onChange={(event) => setMinimumRating(event.target.value)}
            >
              <option value="">Any rating</option>
              <option value="4">4.0+ stars</option>
              <option value="4.5">4.5+ stars</option>
              <option value="4.8">4.8+ stars</option>
            </select>
          </label>
          <label className="filter-control">
            <span className="filter-label">Sort by</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="rating">Highest rated</option>
              <option value="experience">Most experienced</option>
            </select>
          </label>
          <button className="clear-filters-button" type="button" onClick={clearFilters}>
            <FilterX size={16} aria-hidden="true" />
            Clear filters
          </button>
        </div>

        {activeFilters.length > 0 && (
          <div className="active-filter-list" aria-label="Active filters">
            <span className="active-filter-label">Active filters</span>
            {activeFilters.map((filter) => (
              <span className="active-filter-chip" key={filter}>
                {filter}
              </span>
            ))}
          </div>
        )}

        <div className="discovery-results-heading">
          <span>
            <SlidersHorizontal size={16} aria-hidden="true" />
            {matchingWorkers.length === workerList.length
              ? "All local professionals"
              : "Matching professionals"}
          </span>
          <span>Profiles are demo data for this prototype</span>
        </div>

        {matchingWorkers.length > 0 ? (
          <div className="discovery-worker-grid">
            {matchingWorkers.map((worker) => (
              <WorkerCard worker={worker} key={worker.id} />
            ))}
          </div>
        ) : (
          <div className="empty-results">
            <span className="empty-results-icon">
              <Search size={25} aria-hidden="true" />
            </span>
            <h3>No workers match those filters</h3>
            <p>Try a different search or clear some filters to see more people.</p>
            <button className="button button-primary" type="button" onClick={clearFilters}>
              Clear all filters
            </button>
          </div>
        )}
        <p className="discovery-bottom-note">
          Looking to offer your skills?{" "}
          <Link to="/become-a-worker">Join Hunarly as a worker</Link>
        </p>
      </section>
    </div>
  );
}

export default FindWorkers;
