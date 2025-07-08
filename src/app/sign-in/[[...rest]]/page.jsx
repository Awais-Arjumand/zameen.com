import { SignIn } from "@clerk/nextjs";

export const metadata = {
  title: "Sign In",
  description: "Sign in to access the admin dashboard",
};

export default async function SignInPage({ searchParams }) {
  const awaitedSearchParams = await searchParams;
  const redirectUrl = Array.isArray(awaitedSearchParams.redirect_url)
    ? awaitedSearchParams.redirect_url[0]
    : awaitedSearchParams.redirect_url;

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-50">
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "shadow-none bg-transparent",
          },
        }}
        afterSignInUrl={redirectUrl || "/admin"}
        afterSignUpUrl="/admin"
      />
    </div>
  );
}
