'use client';

import { useAuth } from '@/lib/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const links =
    user?.role === 'admin'
      ? [
          { href: '/admin', label: 'Painel Admin' },
          { href: '/dashboard', label: 'Dashboard' },
        ]
      : [{ href: '/dashboard', label: 'Dashboard' }];

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href={user?.role === 'admin' ? '/admin' : '/dashboard'} className={styles.logo}>
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="var(--violet)" />
            <path d="M10 22l6-8 4 5 3-4 5 7H10z" fill="white" opacity="0.9" />
            <circle cx="26" cy="12" r="3" fill="var(--gold)" />
          </svg>
          <span>FinanceApp</span>
        </Link>

        {/* Nav Links */}
        <nav className={styles.nav}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${styles.link} ${pathname === l.href ? styles.active : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* User + Logout */}
        <div className={styles.user}>
          <div className={styles.avatar}>
            {user?.avatar ? (
              <Image src={user.avatar} alt={user.name} width={32} height={32} style={{ borderRadius: '50%' }} />
            ) : (
              <span>{user?.name?.[0]?.toUpperCase()}</span>
            )}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name}</span>
            <span className={styles.userRole}>{user?.role === 'admin' ? 'Administrador' : 'Membro'}</span>
          </div>
          <button onClick={logout} className={styles.logoutBtn} title="Sair">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
