import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0E14] w-full">
      <SignIn
        appearance={{
          baseTheme: undefined,
          variables: {
            colorPrimary: "#D98E4A",
            colorBackground: "#12161F",
            colorText: "#E7E9EE",
          },
        }}
      />
    </div>
  );
}
