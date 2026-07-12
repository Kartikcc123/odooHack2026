import { redirect } from 'next/navigation';

export default function Home() {
  // Currently redirecting to dashboard.
  // In a real app with auth, you would check the session here 
  // and redirect to /login if not authenticated.
  // redirect('/dashboard');
  
  return (
    <h1 className="text-3xl font-bold p-8">Hello OdooHack26</h1>
  );
}