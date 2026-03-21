import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function UpdatePassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

 
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        console.log("Ready to update password");
      }
    });
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setMessage("the Password is updated");
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4">
      <form
        onSubmit={handleUpdatePassword}
        className="bg-white/5 p-8 rounded-xl shadow-xl backdrop-blur-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          Set New Password
        </h1>

        {error && (
          <div className="text-red-400 text-sm text-center mb-4">{error}</div>
        )}
        {message && (
          <div className="text-green-400 text-sm text-center mb-4">{message}</div>
        )}

        <div className="mb-6">
          <Input
            type="password"
            placeholder="Enter your new password"
            className="bg-white/10 text-white placeholder:text-gray-300 focus-visible:ring-0 focus:border-white focus-visible:ring-offset-0 focus:outline-none border-white/20"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            required
            minLength={6}
          />
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Update Password
        </Button>
      </form>
    </div>
  );
}
