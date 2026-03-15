import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/AuthContext';
import './globals.css';

export const metadata = {
  title: 'FinanceApp — Gestão Financeira',
  description: 'Sistema de gestão financeira familiar',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#1a1a2e',
                  color: '#e2e8f0',
                  border: '1px solid #2d2d4e',
                  borderRadius: '12px',
                  fontFamily: 'var(--font-body)',
                },
                success: { iconTheme: { primary: '#6c63ff', secondary: '#fff' } },
                error: { iconTheme: { primary: '#f87171', secondary: '#fff' } },
              }}
            />
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
