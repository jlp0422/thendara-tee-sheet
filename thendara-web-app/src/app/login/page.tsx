'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '@/api/auth';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e?: React.FormEvent) {
    e?.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter your username and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(username.trim(), password);
      router.push('/tee-sheet');
    } catch {
      setError('Check your username and password and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-dvh bg-forest-900 flex flex-col items-center justify-center px-8 py-16"
      style={{ paddingTop: 'max(4rem, env(safe-area-inset-top))' }}
    >
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-12">
          <div className="w-24 h-24 rounded-full bg-cream flex items-center justify-center mb-6">
            <span className="text-4xl">⛳</span>
          </div>
          <h1 className="text-white text-3xl font-bold tracking-tight">Thendara</h1>
          <p className="text-green-200 text-base mt-1">Golf Club</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input
            label="Username"
            value={username}
            onChange={setUsername}
            type="email"
            placeholder="Email or username"
            autoComplete="username"
          />

          {/* Password with eye toggle */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-white/80">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                className="w-full px-4 py-3.5 pr-12 rounded-xl bg-white text-forest-900 placeholder:text-stone-400 text-base outline-none focus:ring-2 focus:ring-forest-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 active:opacity-60"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-4 rounded-2xl bg-cream text-forest-900 font-bold text-base flex items-center justify-center gap-2 active:opacity-80 disabled:opacity-50"
          >
            {loading && <span className="w-4 h-4 border-2 border-forest-900 border-t-transparent rounded-full animate-spin" />}
            Sign In
          </button>
        </form>

        <p className="text-green-300 text-xs text-center mt-8">
          Forgot your password?{' '}
          <a
            href="https://www.thendaragolfclub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Visit thendaragolfclub.com
          </a>
        </p>
      </div>
    </div>
  );
}
