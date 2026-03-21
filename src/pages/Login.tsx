import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate("/admin");
    }
  };
  const handleForgotPassword = async () => {
  
    if (!email) {
      setError(
        "Please enter your email address to receive the password reset link.",
      );
      return;
    }
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    if (error) {
      setError(error.message);
    } else {
      alert(
        "Password reset link has been sent! Please check your email.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white/5 p-8 rounded-xl shadow-xl backdrop-blur-md w-full max-w-sm"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          {t("login.title")}
        </h1>

        {error && (
          <div className="text-red-400 text-sm text-center mb-4">{error}</div>
        )}


        <div className="mb-4">
          <Input
            type="email"
            placeholder={t("login.email")}
            className={`bg-white/10 text-white placeholder:text-gray-200 
    focus-visible:ring-0  focus:border-white focus-visible:ring-offset-0 focus:outline-none
    ${error ? "border-red-500" : "border-white/20"}
  `}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            required
          />
        </div>
        <div dir={i18n.dir()} className="mb-6 relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder={t("login.password")}
            className={`bg-white/10 text-white placeholder:text-gray-200 
    ${i18n.dir() === "rtl" ? "pl-10" : "pr-10"}
    focus-visible:ring-0 focus:border-white focus-visible:ring-offset-0 focus:outline-none
    ${error ? "border-red-500" : "border-white/20"}
    `}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute top-1/2 -translate-y-1/2 text-gray-300 hover:text-white
      ${i18n.dir() === "rtl" ? "left-3" : "right-3"}
    `}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
   
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          {t("login.signin")}
        </Button>
        <span
          onClick={handleForgotPassword}
          className="text-blue-400 hover:text-blue-300 text-sm mt-4 block text-center cursor-pointer transition-colors"
        >
          Forgot password?
        </span>
      </form>
    </div>
  );
}
