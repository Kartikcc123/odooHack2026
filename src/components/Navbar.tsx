"use client";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>AF</span>
          <span className="display font-semibold">AssetFlow</span>
        </Link>

        <nav className={styles.links}>
          <a href="#features" className={styles.link}>Features</a>
          <a href="#workflow" className={styles.link}>Workflow</a>
          <a href="#roles" className={styles.link}>Roles</a>
        </nav>

        <div className={styles.actions}>
          {!isSignedIn && (
            <>
              <Link href="/sign-in" className={styles.signIn}>Sign in</Link>
              <Link href="/sign-up" className={styles.cta}>Get started</Link>
            </>
          )}
          {isSignedIn && (
            <>
              <Link href="/dashboard" className={styles.cta}>Dashboard</Link>
              <UserButton afterSignOutUrl="/" />
            </>
          )}
        </div>
      </div>
    </header>
  );
}