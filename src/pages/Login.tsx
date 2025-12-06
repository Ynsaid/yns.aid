import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white/5 p-8 rounded-xl shadow-xl backdrop-blur-md w-full max-w-sm"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Login
        </h1>

        {error && (
          <div className="text-red-400 text-sm text-center mb-4">{error}</div>
        )}

        {/* field for email */}
        <div className="mb-4">
          <Input
            type="email"
            placeholder="Email"
            className={`bg-white/10 text-white placeholder:text-gray-200 
    ${error ? "border-red-500 focus-visible:ring-red-500" : "border-white/20"}
  `}
            value={email}
            onChange={(e) =>{ 
              setEmail(e.target.value);
               setError("");
            }}
            required
          />
        </div>
        {/* field for password with toggle */}
        <div className="mb-6 relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`bg-white/10 text-white placeholder:text-gray-200 pr-10
    ${error ? "border-red-500 focus-visible:ring-red-500" : "border-white/20"}
  `}
            value={password}
            onChange={(e) => { 
              setPassword(e.target.value)
              setError("");
            }}
            required
          />

          {/* Toggle Icon */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {/* submit button */}
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Sign In
        </Button>
      </form>
    </div>
  );
}
