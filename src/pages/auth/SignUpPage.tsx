import { Head } from "providers/HeadProvider/Head";

import { AuthPage } from "pages/auth/AuthPage";

export function SignUpPage() {
  return (
    <>
      <Head title={"Create an Account"} />
      <AuthPage isLoginPage={false} />
    </>
  );
}
