import { AmbienceProvider } from "@/components/ambience/AmbienceProvider";
import { AmbienceRoot } from "@/components/ambience/AmbienceRoot";
import { MobileHeader, Sidebar } from "@/components/layout/Sidebar";
import { SkipLink } from "@/components/layout/SkipLink";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <AmbienceProvider>
      <SkipLink />
      <AmbienceRoot />
      <Sidebar />
      <MobileHeader />
      <div className="site-main min-h-screen lg:pl-[var(--sidebar-width)]">
        <main
          id="main-content"
          className="mx-auto w-full max-w-[var(--content-max)] px-5 py-10 sm:px-8 lg:py-14"
        >
          {children}
        </main>
        <footer className="mx-auto w-full max-w-[var(--content-max)] border-t border-border px-5 py-8 text-sm text-text-muted sm:px-8">
          <p>
            Lumenwald — research notes by Adya Srivastava. Atmosphere inspired by
            night forests and indoor cloud canopies.
          </p>
        </footer>
      </div>
    </AmbienceProvider>
  );
}
