"use client";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
export function PrintProposalButton() {
  return (
    <Button
      className="print:hidden"
      variant="ember"
      onClick={() => window.print()}
    >
      <Printer />
      Download / print PDF
    </Button>
  );
}
