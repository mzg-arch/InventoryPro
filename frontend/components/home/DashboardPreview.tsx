import {
  AlertTriangle,
  Boxes,
  CircleDollarSign,
  LayoutDashboard,
  Truck,
} from "lucide-react";

const previewMetrics = [
  { label: "Products", icon: Boxes },
  { label: "Suppliers", icon: Truck },
  { label: "Low stock", icon: AlertTriangle },
  { label: "Inventory value", icon: CircleDollarSign },
];

export default function DashboardPreview() {
  return (
    <div
      role="img"
      aria-label="Interface preview showing InventoryPro dashboard sections"
      className="overflow-hidden rounded-xl border border-border-strong bg-surface-primary shadow-sm"
    >
      <div className="flex min-h-[360px] sm:min-h-[420px]">
        <aside className="hidden w-32 shrink-0 bg-sidebar p-3 sm:block">
          <div className="flex items-center gap-2 border-b border-sidebar-hover pb-3">
            <span className="flex size-7 items-center justify-center rounded-md bg-surface-primary text-sidebar">
              <Boxes className="size-3.5" aria-hidden="true" />
            </span>
            <span className="text-[10px] font-semibold text-surface-primary">
              InventoryPro
            </span>
          </div>
          <div className="mt-5 space-y-1.5">
            <div className="flex items-center gap-2 rounded-md bg-sidebar-active px-2 py-2 text-[9px] font-medium text-surface-primary">
              <LayoutDashboard className="size-3" aria-hidden="true" />
              Dashboard
            </div>
            <div className="flex items-center gap-2 rounded-md px-2 py-2 text-[9px] text-text-muted">
              <Boxes className="size-3" aria-hidden="true" />
              Products
            </div>
            <div className="flex items-center gap-2 rounded-md px-2 py-2 text-[9px] text-text-muted">
              <Truck className="size-3" aria-hidden="true" />
              Suppliers
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1 bg-page-background p-3 sm:p-4">
          <div className="flex items-end justify-between border-b border-border pb-3">
            <div>
              <p className="text-[8px] font-semibold tracking-[0.12em] text-text-muted uppercase">
                Inventory overview
              </p>
              <p className="mt-1 text-sm font-semibold text-text-primary">
                Dashboard
              </p>
            </div>
            <div className="h-6 w-16 rounded-md bg-button-primary" />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {previewMetrics.map(({ label, icon: Icon }, index) => (
              <div
                key={label}
                className={`rounded-md border border-border p-2.5 ${
                  index === 2 ? "bg-surface-raised" : "bg-surface-primary"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[8px] font-medium text-text-secondary">
                    {label}
                  </span>
                  <Icon className="size-3 text-subtle-accent" aria-hidden="true" />
                </div>
                <div className="mt-3 h-2 w-10 rounded-sm bg-button-primary" />
                <div className="mt-2 h-1.5 w-14 rounded-sm bg-border" />
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-2 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-md border border-border bg-surface-primary p-3">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-semibold text-text-primary">
                  Inventory activity
                </p>
                <span className="text-[8px] text-text-muted">Overview</span>
              </div>
              <div className="mt-4 flex h-28 items-end gap-2 border-b border-border px-1 pb-1 sm:h-36">
                {[38, 64, 48, 82, 58, 72, 50].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t-sm bg-sidebar-active"
                    style={{ height: `${height}%`, opacity: 0.42 + index * 0.07 }}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-md border border-border bg-surface-raised p-3">
              <p className="text-[9px] font-semibold text-text-primary">
                Stock overview
              </p>
              <div className="mt-4 space-y-3">
                {["Available stock", "Minimum levels", "Needs attention"].map(
                  (label, index) => (
                    <div key={label}>
                      <div className="flex justify-between gap-2 text-[8px] text-text-muted">
                        <span>{label}</span>
                        <span>—</span>
                      </div>
                      <div className="mt-1.5 h-1.5 rounded-full bg-border">
                        <div
                          className="h-full rounded-full bg-subtle-accent"
                          style={{ width: `${78 - index * 18}%` }}
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
