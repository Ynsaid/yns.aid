import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

const APP_BASE_URL = "https://yns-aid-9a62.vercel.app";

export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const requestInProgress = useRef(false);

  const isRTL = i18n.dir() === "rtl";

  const handleSwitchMode = () => {
    if (requestInProgress.current) return;

    setIsForgotPassword((previous) => !previous);
    setPassword("");
    setShowPassword(false);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (requestInProgress.current) return;

    setError("");
    setMessage("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    requestInProgress.current = true;
    setLoading(true);

    try {
      if (isForgotPassword) {
        const { error: resetError } =
          await supabase.auth.resetPasswordForEmail(trimmedEmail, {
            redirectTo: `${APP_BASE_URL}/update-password`,
          });

        if (resetError) {
          setError(
            resetError.status === 429
              ? "Too many requests. Please wait a few minutes and try again."
              : "Unable to send the reset link. Please try again later."
          );

          return;
        }

        setMessage(
          "If this email is eligible, you will receive a password reset link. Please check your inbox."
        );

        return;
      }

      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

      if (loginError) {
        setError(
          loginError.status === 429
            ? "Too many login requests. Please wait a few minutes and try again."
            : "Unable to sign in. Please check your email and password."
        );

        return;
      }

      navigate("/admin", { replace: true });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      requestInProgress.current = false;
      setLoading(false);
    }
  };

  const inputClass = `
    bg-white/10
    text-white
    placeholder:text-gray-200
    focus-visible:ring-0
    focus:border-white
    focus-visible:ring-offset-0
    focus:outline-none
    ${error ? "border-red-500" : "border-white/20"}
  `;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        dir={i18n.dir()}
        aria-busy={loading}
        className="bg-white/5 p-8 rounded-xl shadow-xl backdrop-blur-md w-full max-w-sm"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          {isForgotPassword ? "Forgot Password?" : t("login.title")}
        </h1>

        {isForgotPassword && (
          <p className="text-gray-300 text-sm text-center mb-6">
            Enter your email address to receive a password reset link.
          </p>
        )}

        {error && (
          <div
            role="alert"
            className="text-red-400 text-sm text-center mb-4"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="text-green-400 text-sm text-center mb-4"
          >
            {message}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="email" className="sr-only">
            {t("login.email")}
          </label>

          <Input
            id="email"
            name="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            placeholder={t("login.email")}
            className={inputClass}
            value={email}
            disabled={loading}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
              setMessage("");
            }}
            required
          />
        </div>

        {!isForgotPassword && (
          <div className="mb-6 relative">
            <label htmlFor="password" className="sr-only">
              {t("login.password")}
            </label>

            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder={t("login.password")}
              className={`
                ${inputClass}
                ${isRTL ? "pl-10" : "pr-10"}
              `}
              value={password}
              disabled={loading}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
            />

            <button
              type="button"
              disabled={loading}
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
              aria-pressed={showPassword}
              onClick={() => {
                setShowPassword((previous) => !previous);
              }}
              className={`
                absolute top-1/2 -translate-y-1/2
                text-gray-300 hover:text-white
                disabled:opacity-50
                ${isRTL ? "left-3" : "right-3"}
              `}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {loading
            ? "Please wait..."
            : isForgotPassword
              ? "Send Reset Link"
              : t("login.signin")}
        </Button>

        <button
          type="button"
          onClick={handleSwitchMode}
          disabled={loading}
          className="
            text-blue-400 hover:text-blue-300
            text-sm mt-4 block w-full text-center
            transition-colors
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {isForgotPassword ? "Back to login" : "Forgot password?"}
        </button>
      </form>
    </div>
  );
}
