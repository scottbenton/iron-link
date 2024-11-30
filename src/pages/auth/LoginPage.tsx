import { Head } from "providers/HeadProvider/Head";

import { AuthPage } from "pages/auth/AuthPage";

export function LoginPage() {
  return (
    <>
      <Head title={"Sign in to your account"} />
      <AuthPage isLoginPage />
    </>
  );
}
