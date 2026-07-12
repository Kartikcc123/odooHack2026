"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser, SignOutButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes"; // ✅ 1. Dark theme import add किया
import {
  LayoutDashboard,
  Building2,
  Package,
  ArrowLeftRight,
  CalendarClock,
  Wrench,
  ClipboardCheck,
  BarChart3,
  Bell,
  LogOut,
} from "lucide-react";
import styles from "./Sidebar.module.css";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/org-setup", label: "Organization Setup", icon: Building2 },
  { href: "/assets", label: "Assets", icon: Package },
  {
    href: "/allocations",
    label: "Allocation & Transfer",
    icon: ArrowLeftRight,
  },
  { href: "/bookings", label: "Resource Booking", icon: CalendarClock },
  { href: "/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/audit", label: "Audit", icon: ClipboardCheck },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside className={styles.sidebar}>
      <Link href="/dashboard" className={styles.brand}>
        <span className={styles.brandMark}>AF</span>
        <span className="display font-semibold">AssetFlow</span>
      </Link>

      <nav className={styles.nav}>
        {NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
            >
              {active && <span className={styles.activeBar} />}
              <Icon size={17} strokeWidth={2} className={styles.navIcon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <UserButton
          afterSignOutUrl="/sign-in"
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: "#D98E4A",
              colorBackground: "#12161F",
              colorInputBackground: "#1A2029",
              colorText: "#E7E9EE",
              colorTextSecondary: "#8891A3",
            },
            elements: {
              userButtonPopoverCard: {
                backgroundColor: "#12161F",
                border: "1px solid #232A38",
              },
              userButtonPopoverMain: {
                backgroundColor: "#12161F",
              },
              // 👇 ye missing tha - naam aur email ke liye
              userPreviewMainIdentifier: {
                color: "#E7E9EE",
                fontWeight: 600,
              },
              userPreviewSecondaryIdentifier: {
                color: "#8891A3",
              },
              userPreviewAvatarContainer: {
                // avatar circle ok hai already
              },
              userButtonPopoverActionButton: {
                color: "#E7E9EE",
                hover: {
                  backgroundColor: "#1A2029",
                },
              },
              userButtonPopoverActionButtonText: {
                color: "#E7E9EE",
              },
              // 👇 icons (gear, sign-out) bhi faded the
              userButtonPopoverActionButtonIcon: {
                color: "#8891A3",
              },
              userButtonPopoverFooter: {
                backgroundColor: "#0B0E14",
                borderTop: "1px solid #232A38",
              },
              // 👇 "Secured by clerk" / "Development mode" text bhi dim tha
              badge: {
                color: "#D98E4A",
              },
            },
          }}
        />

        {user && (
          <span className={styles.userName}>
            {user.firstName ?? user.username}
          </span>
        )}

        <SignOutButton redirectUrl="/sign-in">
          <button className={styles.logoutBtn} title="Sign out">
            <LogOut size={15} />
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
