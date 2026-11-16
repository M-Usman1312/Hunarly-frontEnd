import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ImagePlus,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { saveWorker } from "../utils/workerStorage.js";
import "./worker-registration.css";

const professionOptions = [
  "Electrician",
  "Plumber",
  "Mechanic",
  "Tutor",
  "Carpenter",
  "AC Technician",
  "Painter",
  "Cleaner",
  "Other",
];

function splitList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function makeDefaultAvatar(name) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase().replace(/[^A-Z0-9]/g, ""))
    .join("");
  const safeInitials = initials || "H";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><rect width="240" height="240" rx="40" fill="#e8f7f3"/><circle cx="120" cy="90" r="43" fill="#73b9a9"/><path d="M37 226c8-47 38-72 83-72s75 25 83 72" fill="#10233f"/><text x="120" y="221" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="700" fill="#fff">${safeInitials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

async function prepareProfileImage(file, name) {
  if (!file) return makeDefaultAvatar(name);

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise((resolve, reject) => {
      const loadedImage = new Image();
      loadedImage.onload = () => resolve(loadedImage);
      loadedImage.onerror = () => reject(new Error("This image could not be opened."));
      loadedImage.src = objectUrl;
    });

    const maxDimension = 640;
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image processing is unavailable in this browser.");

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.78);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function BecomeWorker() {
  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    profession: "",
    otherProfession: "",
    skills: "",
    city: "",
    area: "",
    experience: "",
    description: "",
    services: "",
  });
  const [profileFile, setProfileFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [savedWorker, setSavedWorker] = useState(null);
  const submitLock = useRef(false);

  useEffect(() => {
    if (!profileFile) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(profileFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [profileFile]);

  function updateField(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({
      ...current,
      [name]: "",
      ...(name === "otherProfession" ? { profession: "" } : {}),
    }));
    setSubmitError("");
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0] || null;
    setErrors((current) => ({ ...current, profileImage: "" }));
    setSubmitError("");
    if (!file) {
      setProfileFile(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setErrors((current) => ({
        ...current,
        profileImage: "Choose an image file such as JPG, PNG, or WebP.",
      }));
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((current) => ({
        ...current,
        profileImage: "Choose an image smaller than 5 MB.",
      }));
      event.target.value = "";
      return;
    }
    setProfileFile(file);
  }

  function validate() {
    const nextErrors = {};
    const trimmedName = values.name.trim();
    const phoneDigits = values.phone.replace(/\D/g, "");
    const experienceValue = Number(values.experience);
    const profession =
      values.profession === "Other"
        ? values.otherProfession.trim()
        : values.profession;

    if (trimmedName.length < 2) nextErrors.name = "Enter your full name.";
    if (
      !/^\+?[0-9\s()-]+$/.test(values.phone.trim()) ||
      phoneDigits.length < 10 ||
      phoneDigits.length > 15
    ) {
      nextErrors.phone = "Enter a valid phone number with 10 to 15 digits.";
    }
    if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = "Enter a valid email address or leave this field empty.";
    }
    if (!profession) {
      nextErrors.profession =
        values.profession === "Other"
          ? "Enter your profession."
          : "Choose your profession.";
    }
    if (!splitList(values.skills).length) {
      nextErrors.skills = "Add at least one skill, separated by commas.";
    }
    if (!values.city.trim()) nextErrors.city = "Enter your city.";
    if (!values.area.trim()) nextErrors.area = "Enter your area or neighborhood.";
    if (
      values.experience.trim() === "" ||
      !Number.isFinite(experienceValue) ||
      experienceValue < 0
    ) {
      nextErrors.experience = "Enter a valid non-negative number of years.";
    }
    if (values.description.trim().length < 12) {
      nextErrors.description = "Add a short introduction of at least 12 characters.";
    }
    if (!splitList(values.services).length) {
      nextErrors.services = "Add at least one service, separated by commas.";
    }

    setErrors(nextErrors);
    return { valid: Object.keys(nextErrors).length === 0, profession };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitLock.current || submitting) return;

    const result = validate();
    if (!result.valid) {
      setSubmitError("Please check the highlighted fields before submitting.");
      return;
    }

    submitLock.current = true;
    setSubmitting(true);
    setSubmitError("");

    try {
      const image = await prepareProfileImage(profileFile, values.name);
      const experienceYears = Number(values.experience);
      const generatedId =
        globalThis.crypto?.randomUUID?.() ||
        `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      const worker = {
        id: `worker-${generatedId}`,
        name: values.name.trim(),
        profession: result.profession,
        category: result.profession,
        location: `${values.area.trim()}, ${values.city.trim()}`,
        experience: `${experienceYears} ${experienceYears === 1 ? "year" : "years"} experience`,
        experienceYears,
        rating: 0,
        reviews: 0,
        image,
        phone: values.phone.trim(),
        email: values.email.trim(),
        skills: splitList(values.skills),
        services: splitList(values.services),
        about: values.description.trim(),
        portfolio: [],
        reviewsList: [],
        isRegistered: true,
      };

      saveWorker(worker);
      setSavedWorker(worker);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "The profile could not be saved. Please try again.",
      );
    } finally {
      submitLock.current = false;
      setSubmitting(false);
    }
  }

  if (savedWorker) {
    return (
      <div className="registration-page">
        <section className="registration-success">
          <span className="registration-success-icon">
            <CheckCircle2 size={30} aria-hidden="true" />
          </span>
          <span className="registration-kicker">Profile saved</span>
          <h1>You’re on Hunarly, {savedWorker.name.split(" ")[0]}.</h1>
          <p>
            Your profile is saved in this browser and is now available in the
            worker directory.
          </p>
          <div className="registration-success-actions">
            <Link
              className="button button-primary"
              to={`/workers/${encodeURIComponent(savedWorker.id)}`}
            >
              View your profile <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link className="button button-secondary" to="/">
              Return to homepage
            </Link>
          </div>
          <span className="registration-demo-note">
            This is a frontend demo. Your profile is stored only in this browser.
          </span>
        </section>
      </div>
    );
  }

  const selectedProfession = values.profession;

  return (
    <div className="registration-page">
      <div className="registration-layout">
        <aside className="registration-intro">
          <Link className="registration-back-link" to="/">
            <ArrowLeft size={15} aria-hidden="true" />
            Back to Hunarly
          </Link>
          <span className="registration-kicker">Your next opportunity starts here</span>
          <h1>Put your skills on the map.</h1>
          <p>
            Create a profile that helps people nearby discover what you do best.
            It only takes a few minutes.
          </p>
          <div className="registration-promise">
            <span>
              <UserRound size={18} aria-hidden="true" />
            </span>
            <div>
              <strong>Show the person behind the skill</strong>
              <p>Share your experience, services, and the work you’re proud of.</p>
            </div>
          </div>
          <div className="registration-promise">
            <span>
              <MapPin size={18} aria-hidden="true" />
            </span>
            <div>
              <strong>Be found close to home</strong>
              <p>Help local customers find and contact you directly.</p>
            </div>
          </div>
          <div className="registration-privacy-note">
            <ShieldCheck size={17} aria-hidden="true" />
            <span>Demo profiles are saved on this device only.</span>
          </div>
        </aside>

        <form className="registration-form" noValidate onSubmit={handleSubmit}>
          <div className="registration-form-heading">
            <span className="registration-form-icon">
              <BriefcaseBusiness size={19} aria-hidden="true" />
            </span>
            <div>
              <h2>Create your worker profile</h2>
              <p>Fields marked with * are required.</p>
            </div>
          </div>

          <section className="registration-form-section">
            <div className="registration-section-heading">
              <span>01</span>
              <div>
                <h3>About you</h3>
                <p>How customers can recognize and reach you.</p>
              </div>
            </div>
            <div className="registration-fields-grid">
              <label className="registration-field registration-field-full">
                <span>Full name <b>*</b></span>
                <input
                  autoComplete="name"
                  name="name"
                  value={values.name}
                  onChange={updateField}
                  placeholder="e.g. Ali Hassan"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "error-name" : undefined}
                />
                {errors.name && <small id="error-name">{errors.name}</small>}
              </label>
              <label className="registration-field">
                <span>Phone number <b>*</b></span>
                <input
                  autoComplete="tel"
                  name="phone"
                  type="tel"
                  value={values.phone}
                  onChange={updateField}
                  placeholder="+92 300 123 4567"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "error-phone" : undefined}
                />
                {errors.phone && <small id="error-phone">{errors.phone}</small>}
              </label>
              <label className="registration-field">
                <span>Email <em>Optional</em></span>
                <input
                  autoComplete="email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={updateField}
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "error-email" : undefined}
                />
                {errors.email && <small id="error-email">{errors.email}</small>}
              </label>
              <div className="registration-field registration-field-full">
                <label htmlFor="profession">Profession <b>*</b></label>
                <select
                  id="profession"
                  name="profession"
                  value={values.profession}
                  onChange={updateField}
                  aria-invalid={Boolean(errors.profession)}
                  aria-describedby={errors.profession ? "error-profession" : undefined}
                >
                  <option value="">Choose your main profession</option>
                  {professionOptions.map((profession) => (
                    <option key={profession} value={profession}>
                      {profession}
                    </option>
                  ))}
                </select>
                {selectedProfession === "Other" && (
                  <input
                    className="registration-other-profession"
                    name="otherProfession"
                    value={values.otherProfession}
                    onChange={updateField}
                    placeholder="Enter your profession"
                    aria-label="Other profession"
                    aria-invalid={Boolean(errors.profession)}
                  />
                )}
                {errors.profession && (
                  <small id="error-profession">{errors.profession}</small>
                )}
              </div>
              <label className="registration-field">
                <span>City <b>*</b></span>
                <input
                  autoComplete="address-level2"
                  name="city"
                  value={values.city}
                  onChange={updateField}
                  placeholder="e.g. Lahore"
                  aria-invalid={Boolean(errors.city)}
                  aria-describedby={errors.city ? "error-city" : undefined}
                />
                {errors.city && <small id="error-city">{errors.city}</small>}
              </label>
              <label className="registration-field">
                <span>Area / neighborhood <b>*</b></span>
                <input
                  autoComplete="address-line2"
                  name="area"
                  value={values.area}
                  onChange={updateField}
                  placeholder="e.g. Gulberg"
                  aria-invalid={Boolean(errors.area)}
                  aria-describedby={errors.area ? "error-area" : undefined}
                />
                {errors.area && <small id="error-area">{errors.area}</small>}
              </label>
            </div>
          </section>

          <section className="registration-form-section">
            <div className="registration-section-heading">
              <span>02</span>
              <div>
                <h3>Your work</h3>
                <p>Give customers a clear picture of what you offer.</p>
              </div>
            </div>
            <div className="registration-fields-grid">
              <label className="registration-field">
                <span>Years of experience <b>*</b></span>
                <input
                  name="experience"
                  type="number"
                  min="0"
                  step="0.5"
                  value={values.experience}
                  onChange={updateField}
                  placeholder="e.g. 5"
                  aria-invalid={Boolean(errors.experience)}
                  aria-describedby={errors.experience ? "error-experience" : undefined}
                />
                {errors.experience && (
                  <small id="error-experience">{errors.experience}</small>
                )}
              </label>
              <label className="registration-field">
                <span>Skills <b>*</b></span>
                <input
                  name="skills"
                  value={values.skills}
                  onChange={updateField}
                  placeholder="e.g. Wiring, repairs"
                  aria-invalid={Boolean(errors.skills)}
                  aria-describedby={errors.skills ? "error-skills" : undefined}
                />
                <small className={errors.skills ? "" : "registration-hint"}>
                  {errors.skills || "Separate skills with commas."}
                </small>
              </label>
              <label className="registration-field registration-field-full">
                <span>Short description <b>*</b></span>
                <textarea
                  name="description"
                  rows="4"
                  maxLength="500"
                  value={values.description}
                  onChange={updateField}
                  placeholder="Tell customers about your experience and how you approach your work."
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={
                    errors.description ? "error-description" : undefined
                  }
                />
                {errors.description && (
                  <small id="error-description">{errors.description}</small>
                )}
              </label>
              <label className="registration-field registration-field-full">
                <span>Services offered <b>*</b></span>
                <input
                  name="services"
                  value={values.services}
                  onChange={updateField}
                  placeholder="e.g. Home wiring, fault diagnosis"
                  aria-invalid={Boolean(errors.services)}
                  aria-describedby={errors.services ? "error-services" : undefined}
                />
                <small className={errors.services ? "" : "registration-hint"}>
                  {errors.services || "Separate services with commas."}
                </small>
              </label>
              <div className="registration-field registration-field-full">
                <span>Profile image <em>Optional</em></span>
                <label className="profile-image-upload" htmlFor="profileImage">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview of your profile upload" />
                  ) : (
                    <span className="profile-image-placeholder">
                      <ImagePlus size={22} aria-hidden="true" />
                    </span>
                  )}
                  <span className="profile-image-upload-copy">
                    <strong>{previewUrl ? "Change your photo" : "Add a profile photo"}</strong>
                    <small>JPG, PNG, or WebP · up to 5 MB</small>
                  </span>
                  <span className="profile-image-browse">Choose image</span>
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    aria-describedby={errors.profileImage ? "error-profileImage" : undefined}
                  />
                </label>
                {errors.profileImage && (
                  <small id="error-profileImage">{errors.profileImage}</small>
                )}
              </div>
            </div>
          </section>

          {submitError && (
            <p className="registration-error-banner" role="alert">
              <Sparkles size={16} aria-hidden="true" />
              {submitError}
            </p>
          )}

          <div className="registration-submit-row">
            <span>
              <ShieldCheck size={15} aria-hidden="true" />
              Your demo profile stays in this browser.
            </span>
            <button
              className="button button-primary registration-submit"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Saving profile..." : "Submit profile"}
              {!submitting && <ArrowRight size={17} aria-hidden="true" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BecomeWorker;
