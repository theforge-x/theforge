import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CheckoutButton } from "@/components/billing/checkout-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireRole } from "@/lib/auth-session";
import { getClientAccountForUser, getClientWorkspace } from "@/lib/data-access";

export const metadata: Metadata = { title: "Invoices" };

const statusVariant = {
  paid: "success",
  due: "outline",
  overdue: "destructive",
} as const;

export default async function PortalInvoicesPage() {
  const session = await requireRole("client");
  const account = await getClientAccountForUser(session.user.id);
  if (!account) redirect("/login?error=client-account-required");
  const { invoices } = await getClientWorkspace(account.client.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl">Invoices</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Billing history for your engagement. Choose a secure payment provider
          for open invoices.
        </p>
      </div>
      <Card>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Pay with</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {invoice.issued}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {invoice.due}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: invoice.currency,
                    }).format(invoice.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={statusVariant[invoice.status]}
                      className="capitalize"
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      {invoice.status === "paid" ? (
                        <Button variant="ghost" size="sm" disabled>
                          Paid
                        </Button>
                      ) : (
                        <>
                          <CheckoutButton
                            invoiceId={invoice.id}
                            provider="stripe"
                          />
                          <CheckoutButton
                            invoiceId={invoice.id}
                            provider="paystack"
                          />
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
