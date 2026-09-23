import "./globals.css";

export const metadata = {
  title: "PaperMark AI",
  description: "AI-assisted assignment evaluation for instructors",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}