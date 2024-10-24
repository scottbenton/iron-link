import { AuthPage } from "pages/auth/AuthPage";
import { Head } from "providers/HeadProvider/Head";

export function LoginPage() {
  return (
    <>
      <Head title={"Sign in to your account"} />
      <AuthPage isLoginPage />
    </>
  );
}
