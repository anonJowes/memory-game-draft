import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Memory Game",
  description: "A fun memory card-matching game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer
          style={{
            textAlign: "center",
            padding: "0.5rem 1rem",
            fontSize: "0.9rem",
            color: "#6c757d",
            borderTop: "1px solid #eee",
          }}
        >
          <p>
            Built with Next.js, React, TypeScript, and Sass. Powered by Web
            Audio API for sound effects. &copy; {new Date().getFullYear()} Joyce
            Ann Antolihao.
          </p>
        </footer>
      </body>
    </html>
  );
}
