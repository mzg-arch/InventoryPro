import type { ReactNode } from "react";
import { Boxes, ChartNoAxesCombined, Truck } from "lucide-react";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

const capabilities = [
  { icon: Boxes, label: "Products", detail: "Catalog and stock records" },
  { icon: Truck, label: "Suppliers", detail: "Contacts and product links" },
  {
    icon: ChartNoAxesCombined,
    label: "Overview",
    detail: "Value and low-stock visibility",
  },
];

export default function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-page-background px-4 py-6 sm:px-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-xl border border-border-strong bg-surface-primary shadow-sm lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="hidden bg-sidebar p-8 text-surface-primary lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-md border border-surface-primary/20 bg-surface-primary text-sidebar">
                <Boxes className="size-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold">InventoryPro</p>
                <p className="text-xs text-text-muted">Inventory workspace</p>
              </div>
            </div>

            <div className="mt-12">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-text-muted uppercase">
                Workspace
              </p>
              <h2 className="mt-3 max-w-xs text-2xl font-semibold leading-tight tracking-tight">
                Your inventory, organized in one place.
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-text-muted">
                Keep essential product and supplier information easy to review
                and update.
              </p>
            </div>
          </div>

          <div className="mt-10 space-y-1">
            {capabilities.map(({ icon: Icon, label, detail }) => (
              <div
                key={label}
                className="flex items-center gap-3 border-t border-sidebar-hover py-3 first:border-t-0"
              >
                <Icon className="size-4 text-text-muted" aria-hidden="true" />
                <div>
                  <p className="text-xs font-medium text-surface-primary">{label}</p>
                  <p className="mt-0.5 text-[11px] text-text-muted">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section className="px-5 py-6 sm:px-10 sm:py-9">
          <div className="mx-auto max-w-sm">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex size-9 items-center justify-center rounded-md bg-sidebar text-surface-primary">
                <Boxes className="size-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  InventoryPro
                </p>
                <p className="text-xs text-text-muted">Inventory workspace</p>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold tracking-[0.12em] text-text-muted uppercase">
                {eyebrow}
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">
                {title}
              </h1>
              <p className="mt-2 text-sm leading-5 text-text-secondary">
                {description}
              </p>
            </div>

            {children}

            <div className="mt-5 text-center text-xs text-text-muted">
              {footer}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
