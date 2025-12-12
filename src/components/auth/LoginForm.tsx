'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Lock } from 'lucide-react';

interface LoginFormProps {
    onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const params = useParams();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                if (onSuccess) {
                    onSuccess();
                } else {
                    // Default fallback if used standalone
                    const lang = params?.lang || 'de';
                    router.push(`/${lang}/news`);
                    router.refresh();
                }
            } else {
                setError('Falsches Passwort');
            }
        } catch (err) {
            setError('Ein Fehler ist aufgetreten');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gmrt-blue/10 text-gmrt-blue mb-3">
                    <Lock size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Admin Login</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                    {/* Hidden username field to help password managers */}
                    <input
                        type="text"
                        name="username"
                        autoComplete="username"
                        value="admin"
                        readOnly
                        className="hidden"
                    />
                    <input
                        type="password"
                        name="password"
                        id="modal-password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Passwort eingeben"
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 focus:border-gmrt-blue focus:ring-2 focus:ring-gmrt-blue/20 outline-none transition-all"
                        autoFocus
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || !password}
                    className="w-full bg-gmrt-blue text-white py-3 rounded-lg font-semibold hover:bg-gmrt-logo transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? 'Prüfe...' : 'Anmelden'}
                </button>
            </form>
        </div>
    );
}
