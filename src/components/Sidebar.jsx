'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Organization Setup', href: '/org-setup' },
  { label: 'Assets', href: '/assets' },
  { label: 'Allocation & Transfer', href: '/allocation' },
  { label: 'Resource Booking', href: '/bookings' },
  { label: 'Maintenance', href: '/maintenance' },
  { label: 'Audit', href: '/audits' },
  { label: 'Reports', href: '/reports' },
  { label: 'Notifications', href: '/notifications' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>AssetFlow</div>
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
