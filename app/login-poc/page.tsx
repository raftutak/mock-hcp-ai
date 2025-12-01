import { HeroSimple } from "@/components/landing/hero-simple";
import { LoginPocContainer } from "@/components/auth/login-poc-container";

export default function LoginPOCPage() {
  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <HeroSimple title="Login POC" />
        <LoginPocContainer />
      </main>
    </div>
  );
}
