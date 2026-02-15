import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Wayfare — Memory Journal',
    description: 'A beautiful memory journaling platform. Save your moments, travel through your memories.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="antialiased bg-cream-50 text-slate-700">
                {children}
            </body>
        </html>
    );
}
