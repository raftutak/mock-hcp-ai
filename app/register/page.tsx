import { HeroSimple } from "@/components/landing/hero-simple";
import { RegisterContainer } from "@/components/auth/register-container";

export default function RegisterPage() {
  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <HeroSimple title="Register" />
        <RegisterContainer />
      </main>
    </div>
  );
}
