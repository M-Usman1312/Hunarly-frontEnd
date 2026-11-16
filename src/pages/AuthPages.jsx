import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  loginDemoUser,
  getDemoSession,
  registerDemoUser,
  saveDemoSession,
} from "../utils/demoAuth.js";
import "./auth.css";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9\s()-]+$/;

function isValidPhone(value) {
  const digits = value.replace(/\D/g, "");
  return phonePattern.test(value.trim()) && digits.length >= 10 && digits.length <= 15;
}

function AuthShell({ children, mode }) {
  return (
    <div className="auth-page">
      <section className="auth-card">
        <div className="auth-brand-block">
          <span className="auth-brand-mark" aria-hidden="true">h</span>
          <span>hunarly</span>
        </div>
        <div className="auth-heading">
          <span className="section-kicker">
            {mode === "login" ? "Welcome back" : "Find your place"}
          </span>
          <h1>
            {mode === "login" ? "Good to see you." : "Create your account."}
          </h1>
          <p>
            {mode === "login"
              ? "Log in to continue to your Hunarly community."
              : "Join a community built around local skills and opportunity."}
          </p>
        </div>
        {children}
        <div className="auth-demo-note">
          <ShieldCheck size={15} aria-hidden="true" />
          <span>
            Demo authentication only. Account details stay in this browser; this
            is not production security.
          </span>
        </div>
      </section>
      <aside className="auth-side-panel">
        <div className="auth-side-content">
          <span className="auth-side-kicker">
            <span />
            Your Hunar, Your Opportunity.
          </span>
          <h2>Local skills can open big doors.</h2>
          <p>
            Find trusted help in your neighborhood, or let more people discover
            the work you do best.
          </p>
          <div className="auth-side-stat">
            <span className="auth-side-stat-icon">
              <BriefcaseBusiness size={19} aria-hidden="true" />
            </span>
            <span>
              <strong>Opportunity starts nearby</strong>
              <small>Connect with the Hunarly community</small>
            </span>
          </div>
        </div>
        <span className="auth-side-orbit auth-side-orbit-one" />
        <span className="auth-side-orbit auth-side-orbit-two" />
      </aside>
    </div>
  );
}

function AuthMessage({ children, tone = "error" }) {
  if (!children) return null;
  return (
    <p className={`auth-message auth-message-${tone}`} role={tone === "error" ? "alert" : "status"}>
      {tone === "success" ? (
        <CheckCircle2 size={16} aria-hidden="true" />
      ) : (
        <LockKeyhole size={16} aria-hidden="true" />
      )}
      {children}
    </p>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const submissionLock = useRef(false);
  const [identifier, setIdentifier] = useState(
    () => location.state?.registeredEmail || "",
  );
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotMessage, setForgotMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (submissionLock.current || loading) return;

    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier || !password) {
      setError("Enter your email or phone number and password.");
      return;
    }
    if (
      (trimmedIdentifier.includes("@") && !emailPattern.test(trimmedIdentifier)) ||
      (!trimmedIdentifier.includes("@") && !isValidPhone(trimmedIdentifier))
    ) {
      setError("Enter a valid email address or phone number.");
      return;
    }
    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    submissionLock.current = true;
    setLoading(true);
    setError("");
    try {
      const user = await loginDemoUser(trimmedIdentifier, password);
      saveDemoSession(user, rememberMe);
      if (user.role === "worker") {
        navigate("/worker-dashboard", {
          replace: true,
          state: { loginSuccess: true },
        });
      } else {
        navigate("/", {
          replace: true,
          state: { loginSuccess: true, userName: user.name },
        });
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Demo login failed. Please try again.",
      );
    } finally {
      submissionLock.current = false;
      setLoading(false);
    }
  }

  function handleForgotPassword(event) {
    event.preventDefault();
    setForgotMessage(
      "Password reset is a demo-only message. No reset email has been sent.",
    );
    setError("");
  }

  return (
    <AuthShell mode="login">
      <form className="auth-form" noValidate onSubmit={handleSubmit}>
        {location.state?.registeredEmail && (
          <AuthMessage tone="success">
            Account created. Log in with your new details.
          </AuthMessage>
        )}
        <label className="auth-field">
          <span>Email or phone number</span>
          <span className="auth-input-wrap">
            <Mail size={17} aria-hidden="true" />
            <input
              autoComplete="username"
              value={identifier}
              onChange={(event) => {
                setIdentifier(event.target.value);
                setError("");
              }}
              placeholder="you@example.com or +92 300..."
              aria-invalid={Boolean(error)}
            />
          </span>
        </label>
        <label className="auth-field">
          <span>Password</span>
          <span className="auth-input-wrap">
            <LockKeyhole size={17} aria-hidden="true" />
            <input
              autoComplete="current-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              placeholder="Enter your password"
              aria-invalid={Boolean(error)}
            />
            <button
              className="auth-password-toggle"
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={17} aria-hidden="true" />
              ) : (
                <Eye size={17} aria-hidden="true" />
              )}
            </button>
          </span>
        </label>
        <div className="auth-options-row">
          <label className="auth-check-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            <span>Remember me</span>
          </label>
          <button
            className="auth-text-button"
            type="button"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </button>
        </div>
        {forgotMessage && <AuthMessage tone="info">{forgotMessage}</AuthMessage>}
        {error && <AuthMessage>{error}</AuthMessage>}
        <button className="button button-primary auth-submit" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
          {!loading && <ArrowRight size={17} aria-hidden="true" />}
        </button>
        <p className="auth-switch">
          New to Hunarly? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const submissionLock = useRef(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setFormError("");
    setSuccess("");
  }

  function validate() {
    const nextErrors = {};
    if (values.name.trim().length < 2) nextErrors.name = "Enter your full name.";
    if (!emailPattern.test(values.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!isValidPhone(values.phone)) {
      nextErrors.phone = "Enter a valid phone number with 10 to 15 digits.";
    }
    if (values.password.length < 8) {
      nextErrors.password = "Use at least 8 characters for your password.";
    }
    if (values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = "Your passwords do not match.";
    }
    if (!["customer", "worker"].includes(values.role)) {
      nextErrors.role = "Choose Customer or Worker.";
    }
    if (!termsAccepted) nextErrors.terms = "Please accept the demo terms to continue.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submissionLock.current || loading) return;
    setSuccess("");
    setFormError("");
    if (!validate()) {
      setFormError("Please check the highlighted fields before continuing.");
      return;
    }

    submissionLock.current = true;
    setLoading(true);
    try {
      await registerDemoUser(values);
      setSuccess("Your demo account is ready. Log in to continue.");
      window.setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { registeredEmail: values.email.trim() },
        });
      }, 650);
    } catch (submitError) {
      setFormError(
        submitError instanceof Error
          ? submitError.message
          : "Your account could not be created. Please try again.",
      );
    } finally {
      submissionLock.current = false;
      setLoading(false);
    }
  }

  return (
    <AuthShell mode="signup">
      <form className="auth-form auth-signup-form" noValidate onSubmit={handleSubmit}>
        <label className="auth-field">
          <span>Full name</span>
          <span className="auth-input-wrap">
            <UserRound size={17} aria-hidden="true" />
            <input
              autoComplete="name"
              name="name"
              value={values.name}
              onChange={updateField}
              placeholder="Your full name"
              aria-invalid={Boolean(errors.name)}
            />
          </span>
          {errors.name && <small>{errors.name}</small>}
        </label>
        <div className="auth-field-grid">
          <label className="auth-field">
            <span>Email address</span>
            <span className="auth-input-wrap">
              <Mail size={17} aria-hidden="true" />
              <input
                autoComplete="email"
                name="email"
                type="email"
                value={values.email}
                onChange={updateField}
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
              />
            </span>
            {errors.email && <small>{errors.email}</small>}
          </label>
          <label className="auth-field">
            <span>Phone number</span>
            <span className="auth-input-wrap">
              <span className="auth-phone-prefix">+ </span>
              <input
                autoComplete="tel"
                name="phone"
                type="tel"
                value={values.phone}
                onChange={updateField}
                placeholder="92 300 123 4567"
                aria-invalid={Boolean(errors.phone)}
              />
            </span>
            {errors.phone && <small>{errors.phone}</small>}
          </label>
        </div>
        <div className="auth-field-grid">
          <label className="auth-field">
            <span>Password</span>
            <span className="auth-input-wrap">
              <LockKeyhole size={17} aria-hidden="true" />
              <input
                autoComplete="new-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={updateField}
                placeholder="At least 8 characters"
                aria-invalid={Boolean(errors.password)}
              />
              <button
                className="auth-password-toggle"
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={17} aria-hidden="true" />
                ) : (
                  <Eye size={17} aria-hidden="true" />
                )}
              </button>
            </span>
            {errors.password && <small>{errors.password}</small>}
          </label>
          <label className="auth-field">
            <span>Confirm password</span>
            <span className="auth-input-wrap">
              <LockKeyhole size={17} aria-hidden="true" />
              <input
                autoComplete="new-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={values.confirmPassword}
                onChange={updateField}
                placeholder="Re-enter your password"
                aria-invalid={Boolean(errors.confirmPassword)}
              />
              <button
                className="auth-password-toggle"
                type="button"
                onClick={() => setShowConfirmPassword((visible) => !visible)}
                aria-label={
                  showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={17} aria-hidden="true" />
                ) : (
                  <Eye size={17} aria-hidden="true" />
                )}
              </button>
            </span>
            {errors.confirmPassword && <small>{errors.confirmPassword}</small>}
          </label>
        </div>
        <fieldset className="auth-role-field">
          <legend>I’m joining as a</legend>
          <div className="auth-role-options">
            {[
              { value: "customer", label: "Customer", description: "I’m looking for a service" },
              { value: "worker", label: "Worker", description: "I want to offer my skills" },
            ].map((role) => (
              <label
                className={`auth-role-option${values.role === role.value ? " auth-role-selected" : ""}`}
                key={role.value}
              >
                <input
                  type="radio"
                  name="role"
                  value={role.value}
                  checked={values.role === role.value}
                  onChange={updateField}
                />
                <span className="auth-role-icon">
                  {role.value === "customer" ? (
                    <UserRound size={18} aria-hidden="true" />
                  ) : (
                    <BriefcaseBusiness size={18} aria-hidden="true" />
                  )}
                </span>
                <span>
                  <strong>{role.label}</strong>
                  <small>{role.description}</small>
                </span>
              </label>
            ))}
          </div>
          {errors.role && <small>{errors.role}</small>}
        </fieldset>
        <label className="auth-check-label auth-terms">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(event) => {
              setTermsAccepted(event.target.checked);
              setErrors((current) => ({ ...current, terms: "" }));
              setFormError("");
            }}
          />
          <span>
            I agree to the demo terms and understand this is not a real account
            service.
          </span>
        </label>
        {errors.terms && <small className="auth-field-error">{errors.terms}</small>}
        {success && <AuthMessage tone="success">{success}</AuthMessage>}
        {formError && <AuthMessage>{formError}</AuthMessage>}
        <button className="button button-primary auth-submit" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
          {!loading && <ArrowRight size={17} aria-hidden="true" />}
        </button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function WorkerDashboard() {
  const [session, setSession] = useState(null);
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    try {
      const currentSession = getDemoSession();
      setSession(currentSession?.role === "worker" ? currentSession : null);
      setSessionError("");
    } catch (error) {
      setSessionError(
        error instanceof Error
          ? error.message
          : "The demo login session could not be loaded.",
      );
    }
  }, []);

  return (
    <div className="worker-dashboard-page">
      <section className="worker-dashboard-card">
        <span className="worker-dashboard-icon">
          <BriefcaseBusiness size={25} aria-hidden="true" />
        </span>
        <span className="section-kicker">Worker demo dashboard</span>
        <h1>
          {session
            ? `Welcome, ${session.name}.`
            : sessionError
              ? "We couldn’t load your demo session."
              : "Worker account area"}
        </h1>
        <p>
          {sessionError ||
            (session
            ? "Your demo worker account is active. Create or update your public worker profile so nearby customers can find your skills."
            : "Log in with a worker demo account to see this dashboard.")}
        </p>
        <div className="worker-dashboard-actions">
          {session || sessionError ? (
            <Link className="button button-primary" to="/become-a-worker">
              Create a worker profile <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ) : (
            <Link className="button button-primary" to="/login">
              Log in <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
          <Link className="button button-secondary" to="/find-workers">
            Browse workers
          </Link>
        </div>
        <span className="worker-dashboard-note">
          This is a demo dashboard, not a production account or authentication system.
        </span>
      </section>
    </div>
  );
}
