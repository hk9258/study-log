import { Navigation } from "@/components/common/Navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="mx-auto w-full max-w-5xl px-6 py-8">{children}</main>
    </>
  );
}
