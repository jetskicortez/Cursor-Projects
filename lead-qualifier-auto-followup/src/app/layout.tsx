import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lead Qualifier + Auto Follow-up",
  description:
    "Qualify inbound commercial real estate leads and generate smart follow-up.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <header className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                Lead Qualifier + Auto Follow-up
              </h1>
              <p className="text-sm text-slate-600">
                For J.L. Cortez Commercial – Pittsburgh, PA
              </p>
            </div>
          </header>
          <main className="flex-1 pb-8">{children}</main>
          <footer className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500">
            Built for leads.jlcortez.com – intake only, no automatic sending.
          </footer>
        </div>
      </body>
    </html>
  );
}
