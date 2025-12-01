import { HeroSimple } from "@/components/landing/hero-simple";
import { LoginContainer } from "@/components/auth/login-container";

export default function LoginPage() {
  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <HeroSimple title="Login" />
        <LoginContainer />
      </main>
    </div>
  );
}
