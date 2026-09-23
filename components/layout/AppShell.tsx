import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type AppShellProps = {
  children: React.ReactNode;
  title: string;
};

export default function AppShell({
  children,
  title,
}: AppShellProps) {
  return (
    <div className="appShell">
      <Sidebar />

      <main className="main">
        <Topbar title={title} />

        {children}
      </main>
    </div>
  );
}