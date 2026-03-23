import "./globals.css";

export const metadata = {
  title: "Salesforce Account Portal",
  description: "UI shell for sign-in and dashboard account management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
