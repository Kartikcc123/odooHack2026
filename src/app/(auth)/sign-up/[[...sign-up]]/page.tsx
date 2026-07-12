import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: "var(--bg)" }}
    >
      <SignUp
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
            headerTitle: { color: "#E7E9EE" },
            headerSubtitle: { color: "#8891A3" },
            socialButtonsBlockButtonText: { color: "#E7E9EE" },
            dividerText: { color: "#8891A3" },
            formFieldLabel: { color: "#E7E9EE" },
            footerActionText: { color: "#8891A3" },
            footerActionLink: { color: "#D98E4A" },
            identityPreviewText: { color: "#E7E9EE" },
          },
        }}
        localization={{
          signUp: {
            start: {
              title: "Create your AssetFlow account",
              subtitle: "Welcome! Please fill in the details to get started.",
            },
          },
        }}
      />
    </div>
  );
}
