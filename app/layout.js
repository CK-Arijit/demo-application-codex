import "./globals.css";

export const metadata = {
  title: "Demo Application",
  description: "Basic Next.js app scaffold",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
