import { AuthPage } from "./AuthPage";
import { Head } from "providers/HeadProvider/Head";

export function LoginPage() {
  return (
    <>
      <Head title={"Sign in to your account"} />
      <AuthPage isLoginPage />
    </>
  );
}
