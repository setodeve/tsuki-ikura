import { Analytics } from "@vercel/analytics/next";
import { WageCalculator } from "@/components/wage-calculator";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <WageCalculator />
      <Analytics />
    </main>
  );
}
