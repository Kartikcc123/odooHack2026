'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for actual auth logic
    router.push('/dashboard');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>AssetFlow</div>
          <div className={styles.subtitle}>
            {isLogin ? 'Sign in to your account' : 'Create an employee account'}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input type="text" className={styles.input} placeholder="John Doe" required />
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>Email address</label>
            <input type="email" className={styles.input} placeholder="name@company.com" required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input type="password" className={styles.input} placeholder="••••••••" required />
            {isLogin && (
              <a href="#" className={styles.forgotPassword}>Forgot password?</a>
            )}
          </div>

          <button type="submit" className={styles.submitBtn}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className={styles.toggleText}>
          {isLogin ? "New here? " : "Already have an account? "}
          <button 
            className={styles.toggleLink}
            onClick={() => setIsLogin(!isLogin)}
            type="button"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
