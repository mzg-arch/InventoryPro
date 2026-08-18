import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  PackageCheck,
  ShieldCheck,
  Truck,
  UserRoundCheck,
} from "lucide-react";
import HomeHeader from "../components/home/HomeHeader";
import AuthActions from "../components/home/AuthActions";
import DashboardPreview from "../components/home/DashboardPreview";

export const metadata: Metadata = {
  title: "InventoryPro | Clear inventory management",
  description:
    "Manage products, suppliers, stock levels, and inventory summaries from one organized workspace.",
};

const features = [
  {
    icon: Boxes,
    title: "Product management",
    description:
      "Create and maintain product records with SKUs, categories, pricing, and descriptions.",
  },
  {
    icon: PackageCheck,
    title: "Stock-level tracking",
    description:
      "Keep current quantities and minimum stock levels together for quick review.",
  },
  {
    icon: AlertTriangle,
    title: "Low-stock visibility",
    description:
      "See which products are at or below their configured minimum stock level.",
  },
  {
    icon: Truck,
    title: "Supplier management",
    description:
      "Organize supplier names, contact details, addresses, and linked products.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard summaries",
    description:
      "Review product totals, stock quantities, inventory value, and recent records.",
  },
  {
    icon: UserRoundCheck,
    title: "Secure user accounts",
    description:
      "Create an account and sign in before accessing your inventory workspace.",
  },
];

const steps = [
  {
    title: "Create your account",
    description:
      "Register with your name, email address, and password to set up your workspace.",
  },
  {
    title: "Add products and suppliers",
    description:
      "Record the items you manage and the supplier contacts connected to your inventory.",
  },
  {
    title: "Monitor inventory",
    description:
      "Use the dashboard to review stock, identify low-stock products, and keep records current.",
  },
];

export default function HomePage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen overflow-x-hidden bg-page-background text-text-primary">
      <HomeHeader />

      <main>
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-18 lg:grid-cols-[0.88fr_1.12fr] lg:px-8 lg:py-20">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-subtle-accent uppercase">
                Practical inventory management
              </p>
              <h1 className="mt-4 text-4xl leading-[1.08] font-semibold tracking-[-0.035em] text-text-primary sm:text-[44px]">
                Keep your inventory organized and under control.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-text-secondary">
                Track products, suppliers, stock levels, and important inventory
                activity from one clear workspace.
              </p>

              <AuthActions className="mt-7" />

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-5 text-xs text-text-muted">
                <span>Product records</span>
                <span>Supplier contacts</span>
                <span>Stock summaries</span>
              </div>
            </div>

            <DashboardPreview />
          </div>
        </section>

        <section
          id="features"
          className="scroll-mt-20 border-b border-border bg-surface-primary"
        >
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-subtle-accent uppercase">
                Core capabilities
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                The essentials for everyday inventory work
              </h2>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                InventoryPro keeps the information you use most often structured,
                searchable, and easy to update.
              </p>
            </div>

            <div className="mt-9 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, description }, index) => (
                <article
                  key={title}
                  className={`p-5 ${
                    index % 2 === 0
                      ? "bg-surface-primary"
                      : "bg-surface-raised"
                  }`}
                >
                  <div className="flex size-8 items-center justify-center rounded-md border border-border-strong bg-surface-secondary text-button-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-text-primary">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-20 border-b border-border bg-surface-secondary"
        >
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
              <div className="max-w-md">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-subtle-accent uppercase">
                  How it works
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                  A straightforward workflow from setup to oversight
                </h2>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  Start with the records you already use, then keep quantities and
                  contacts current as your inventory changes.
                </p>
              </div>

              <ol className="grid gap-3 sm:grid-cols-3">
                {steps.map((step, index) => (
                  <li
                    key={step.title}
                    className="rounded-lg border border-border bg-surface-primary p-5 shadow-xs"
                  >
                    <span className="flex size-7 items-center justify-center rounded-full border border-subtle-accent/40 bg-subtle-accent/10 text-xs font-semibold text-button-primary">
                      {index + 1}
                    </span>
                    <h3 className="mt-5 text-sm font-semibold text-text-primary">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                      {step.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="scroll-mt-20 border-b border-border bg-page-background"
        >
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-2 lg:px-8">
            <div className="rounded-lg border border-border bg-surface-primary p-6 shadow-xs sm:p-7">
              <div className="flex size-9 items-center justify-center rounded-md bg-sidebar text-surface-primary">
                <ClipboardList className="size-4" aria-hidden="true" />
              </div>
              <p className="mt-5 text-[11px] font-semibold tracking-[0.14em] text-subtle-accent uppercase">
                About InventoryPro
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">
                Built for teams that need a clearer inventory routine
              </h2>
              <p className="mt-4 text-sm leading-6 text-text-secondary">
                InventoryPro is suited to small businesses and operational teams
                that manage products, quantities, and supplier relationships. It
                replaces scattered notes with a consistent place to review and
                update everyday inventory information.
              </p>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                The focus is practical: fewer disconnected records, clearer stock
                visibility, and a dashboard that highlights what needs attention.
              </p>
            </div>

            <div className="rounded-lg border border-sidebar-hover bg-sidebar p-6 text-surface-primary shadow-xs sm:p-7">
              <div className="flex size-9 items-center justify-center rounded-md bg-sidebar-active text-surface-primary">
                <ShieldCheck className="size-4" aria-hidden="true" />
              </div>
              <p className="mt-5 text-[11px] font-semibold tracking-[0.14em] text-text-muted uppercase">
                Security and organization
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Account-based access to your inventory workspace
              </h2>
              <p className="mt-4 text-sm leading-6 text-text-muted">
                Dashboard data is available after sign-in, and authenticated
                requests carry the active account token. Product and supplier
                information stays organized within the signed-in workspace.
              </p>
              <div className="mt-6 space-y-3 border-t border-sidebar-hover pt-5">
                <div className="flex items-center gap-3 text-sm text-surface-secondary">
                  <ShieldCheck className="size-4 text-text-muted" aria-hidden="true" />
                  Sign-in required for dashboard access
                </div>
                <div className="flex items-center gap-3 text-sm text-surface-secondary">
                  <ClipboardList className="size-4 text-text-muted" aria-hidden="true" />
                  Structured product and supplier records
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-surface-raised">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-16">
            <Boxes className="mx-auto size-6 text-subtle-accent" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Bring your inventory records into one clear workspace.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-text-secondary">
              Create an account to start organizing products and suppliers, or
              log in to continue managing an existing inventory.
            </p>
            <AuthActions className="mt-6 justify-center" />
          </div>
        </section>
      </main>

      <footer className="bg-surface-primary">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-9 sm:px-6 md:grid-cols-[1fr_auto] md:items-end lg:px-8">
          <div className="max-w-md">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-subtle-accent/30 focus-visible:ring-offset-2"
            >
              <span className="flex size-7 items-center justify-center rounded-md bg-sidebar text-surface-primary">
                <Boxes className="size-3.5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-text-primary">
                InventoryPro
              </span>
            </Link>
            <p className="mt-3 text-xs leading-5 text-text-secondary">
              Product, supplier, and stock management from one organized
              workspace.
            </p>
          </div>

          <nav
            className="flex flex-wrap gap-x-5 gap-y-2 text-xs"
            aria-label="Footer navigation"
          >
            <Link
              href="#features"
              className="rounded-sm text-text-secondary outline-none hover:text-text-primary hover:underline hover:underline-offset-4 focus-visible:ring-2 focus-visible:ring-subtle-accent/30"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-sm text-text-secondary outline-none hover:text-text-primary hover:underline hover:underline-offset-4 focus-visible:ring-2 focus-visible:ring-subtle-accent/30"
            >
              How it works
            </Link>
            <Link
              href="#about"
              className="rounded-sm text-text-secondary outline-none hover:text-text-primary hover:underline hover:underline-offset-4 focus-visible:ring-2 focus-visible:ring-subtle-accent/30"
            >
              About
            </Link>
            <Link
              href="/login"
              className="rounded-sm text-text-secondary outline-none hover:text-text-primary hover:underline hover:underline-offset-4 focus-visible:ring-2 focus-visible:ring-subtle-accent/30"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-sm text-text-secondary outline-none hover:text-text-primary hover:underline hover:underline-offset-4 focus-visible:ring-2 focus-visible:ring-subtle-accent/30"
            >
              Create account
            </Link>
          </nav>
        </div>
        <div className="border-t border-border px-4 py-4 text-center text-[11px] text-text-muted sm:px-6">
          © {currentYear} InventoryPro
        </div>
      </footer>
    </div>
  );
}
