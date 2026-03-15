'use client';

import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/lib/AuthContext';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import styles from './login.module.css';

export default function LoginPage() {
  const { login, googleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Bem-vindo de volta!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  };

  // Google One Tap / popup flow
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        // Troca o access token pelo ID token via userinfo
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoRes.json();

        // Envia para nosso backend que cria/autentica o usuário
        const { data } = await api.post('/auth/google-access', {
          access_token: tokenResponse.access_token,
          userInfo,
        });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = data.user.role === 'admin' ? '/admin' : '/dashboard';
        toast.success('Login com Google realizado!');
      } catch (err) {
        toast.error('Erro ao autenticar com Google.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => toast.error('Login com Google cancelado.'),
  });

  return (
    <div className={styles.page}>
      {/* Background decorativo */}
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />

      <div className={styles.container}>
        {/* Coluna esquerda — branding */}
        <div className={styles.branding}>
          <div className={styles.logo}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="var(--violet)" />
              <path d="M10 22l6-8 4 5 3-4 5 7H10z" fill="white" opacity="0.9"/>
              <circle cx="26" cy="12" r="3" fill="var(--gold)" />
            </svg>
            <span className={styles.logoText}>FinanceApp</span>
          </div>

          <div className={styles.headline}>
            <h1>Controle suas<br /><em>finanças</em> com<br />clareza.</h1>
            <p>Gestão financeira familiar simples, segura e elegante.</p>
          </div>

          <div className={styles.features}>
            {[
              { icon: '💳', label: 'Controle de receitas e despesas' },
              { icon: '👨‍👩‍👧', label: 'Gestão de membros da família' },
              { icon: '🔐', label: 'Dados criptografados e seguros' },
              { icon: '📊', label: 'Relatórios e resumos mensais' },
            ].map((f) => (
              <div key={f.label} className={styles.featureItem}>
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna direita — formulário */}
        <div className={styles.formWrap}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h2>Entrar na conta</h2>
              <p>Bem-vindo de volta</p>
            </div>

            {/* Google Sign-In */}
            <button
              className={styles.googleBtn}
              onClick={() => handleGoogleLogin()}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <div className={styles.spinner} />
              ) : (
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              )}
              {googleLoading ? 'Autenticando...' : 'Continuar com Google'}
            </button>

            <div className={styles.divider}>
              <span>ou entre com e-mail</span>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className={styles.form}>
              <div className={styles.field}>
                <label>E-mail</label>
                <div className={styles.inputWrap}>
                  <svg className={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    className={`input ${styles.paddedInput}`}
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label>Senha</label>
                <div className={styles.inputWrap}>
                  <svg className={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    className={`input ${styles.paddedInput}`}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '14px' }}>
                {loading ? <div className={styles.spinner} /> : null}
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <p className={styles.hint}>
              Acesso restrito a membros cadastrados.<br />
              Solicite ao administrador da conta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
