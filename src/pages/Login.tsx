import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase'; // Make sure this is correctly set up
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Login() {
  const navigate = useNavigate(); // ✅ React Router DOM navigation
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/admin'); // ✅ Redirect to /admin on success
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white/5 p-8 rounded-xl shadow-xl backdrop-blur-md w-full max-w-sm"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-6">Login</h1>

        {error && (
          <div className="text-red-400 text-sm text-center mb-4">{error}</div>
        )}

        <div className="mb-4">
          <Input
            type="email"
            placeholder="Email"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <Input
            type="password"
            placeholder="Password"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Sign In
        </Button>
      </form>
    </div>
  );
}
