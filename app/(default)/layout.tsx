export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="w-full min-w-0 grow">{children}</main>;
}
