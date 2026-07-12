import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: "var(--bg)" }}
    >
      <SignIn
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
            // मुख्य कार्ड और ओवरऑल कंटेनर के लिए डार्क बैकग्राउंड और लाइट टेक्स्ट
            card: {
              backgroundColor: "#12161F",
              color: "#E7E9EE",
            },
            headerTitle: { color: "#E7E9EE" },
            headerSubtitle: { color: "#8891A3" },
            socialButtonsBlockButtonText: { color: "#E7E9EE" },
            dividerText: { color: "#8891A3" },
            formFieldLabel: { color: "#E7E9EE" },
            footerActionText: { color: "#8891A3" },
            footerActionLink: { color: "#D98E4A" },
            identityPreviewText: { color: "#E7E9EE" },
            
            // OTP और वेरिफिकेशन स्क्रीन फिक्सेस (यह ब्लैक स्क्रीन/टेक्स्ट को फिक्स करेगा)
            otpCodeFieldInput: {
              backgroundColor: "#1A2029",
              borderColor: "#232A38",
              color: "#E7E9EE",
            },
            formResendCodeLink: { color: "#D98E4A" },
            
            // सक्सेस/वेरिफिकेशन और अल्टरनेटिव स्क्रीन के बैकग्राउंड को डार्क रखना
            alternativeMethods: {
              backgroundColor: "#12161F",
              color: "#E7E9EE",
            },
            alternativeMethodsBlockButton: {
              backgroundColor: "#1A2029",
              borderColor: "#232A38",
              color: "#E7E9EE",
            },
            alternativeMethodsBlockButtonText: {
              color: "#E7E9EE",
            },
          },
        }}
      />
    </div>
  );
}