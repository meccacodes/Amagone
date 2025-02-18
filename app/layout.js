import "./globals.css";

export const metadata = {
  title: "amagone",
  description: "shop outside the box",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
