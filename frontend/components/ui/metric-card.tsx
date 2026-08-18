import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: ReactNode;
  description: string;
  icon?: ReactNode;
  alert?: boolean;
}

export default function MetricCard({
  label,
  value,
  description,
  icon,
  alert = false,
}: MetricCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface-primary p-4 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-text-secondary">{label}</p>
        {icon && (
          <span
            className={`flex size-7 items-center justify-center rounded-md border ${
              alert
                ? "border-subtle-accent/40 bg-subtle-accent/10 text-subtle-accent"
                : "border-border bg-surface-secondary text-text-secondary"
            }`}
          >
            {icon}
          </span>
        )}
      </div>
      <p
        className={`mt-2 text-2xl font-semibold tracking-tight tabular-nums ${
          alert ? "text-button-primary" : "text-text-primary"
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs leading-4 text-text-muted">{description}</p>
    </div>
  );
}
