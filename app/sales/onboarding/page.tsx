import type { Metadata } from "next";
import { SalesOnboardingWorkspace } from "@/components/sales/onboarding-workspace";

export const metadata: Metadata = {
  title: "Sales Certification",
  description:
    "Sales onboarding, product mastery, simulations, and certification for theForge consultants.",
};

export default function SalesOnboardingPage() {
  return <SalesOnboardingWorkspace />;
}
