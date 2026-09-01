import React, { useState } from 'react';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (signInError) {
      if (signInError.message.includes('Invalid login credentials')) {
        setError('E-mail ou senha incorretos.');
      } else {
        setError(signInError.message);
      }
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card card">
        <div className="login-header">
          <div className="login-logo">SH</div>
          <h1 className="login-title">SENAI Hub</h1>
          <p className="login-subtitle">Unidade Naviraí</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field">
            <span className="login-field-label">
              <Mail size={14} /> E-mail
            </span>
            <input
              type="email"
              className="login-input"
              placeholder="seunome@senaims.ind.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="login-field">
            <span className="login-field-label">
              <Lock size={14} /> Senha
            </span>
            <input
              type="password"
              className="login-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <div className="login-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="btn-primary login-submit" disabled={loading}>
            {loading ? (
              'Entrando...'
            ) : (
              <>
                <LogIn size={16} /> Entrar
              </>
            )}
          </button>
        </form>

        <p className="login-footer">
          Acesso restrito à equipe do SENAI Naviraí. Problemas para entrar? Fale com a coordenação de TI.
        </p>
      </div>
    </div>
  );
}
