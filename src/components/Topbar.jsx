'use client'

import styles from './Topbar.module.css';

export default function Topbar() {
  const user = {
    name: 'Priya Shah',
    role: 'Admin',
    initials: 'PS'
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.userProfile}>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user.name}</span>
          <span className={styles.userRole}>{user.role}</span>
        </div>
        <div className={styles.avatar}>
          {user.initials}
        </div>
      </div>
    </header>
  );
}
