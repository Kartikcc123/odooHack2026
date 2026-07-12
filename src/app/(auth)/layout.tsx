import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 glass-panel p-8 bg-white shadow-md">
        {/* Logo / Branding Placeholder */}
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-emerald-600 font-sans">
            AssetFlow
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Enterprise Asset & Resource Management
          </p>
        </div>

        {/* Clerk Sign-In / Sign-Up Component goes here */}
        <div className="mt-6 flex justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}