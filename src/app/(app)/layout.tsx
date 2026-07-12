import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import styles from './layout.module.css';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.appContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Topbar />
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
