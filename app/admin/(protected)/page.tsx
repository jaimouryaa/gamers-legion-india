import type { Metadata } from "next";
import Link from "next/link";
import { Gamepad2, Tag, Star, Plus, Package, Users } from "lucide-react";
import { getAdminKpis, getAllGamesForAdmin } from "@/lib/queries/games";
import { getAllBundlesForAdmin } from "@/lib/queries/bundles";
import { KpiCard } from "@/components/admin/kpi-card";
import { StatusPill } from "@/components/ui/badge";
import { CoverArt } from "@/components/ui/cover-art";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin Dashboard", robots: { index: false } };

export default async function AdminDashboardPage() {
  const [kpis, games, bundles] = await Promise.all([
    getAdminKpis(),
    getAllGamesForAdmin(),
    getAllBundlesForAdmin(),
  ]);
  const recent = games.slice(0, 6);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text-primary">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-text-muted">Manage your games, deals and bundles.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard icon={<Gamepad2 size={17} />} value={kpis.totalGames} label="Total games" />
        <KpiCard icon={<Tag size={17} />} value={kpis.activeDeals} label="Active deals" />
        <KpiCard icon={<Package size={17} />} value={bundles.length} label="Bundles" />
        <KpiCard icon={<Star size={17} />} value={kpis.featured} label="Featured" />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Quick actions
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <QuickAction href="/admin/games/new" icon={Plus} label="Add game" />
          <QuickAction href="/admin/games" icon={Gamepad2} label="Manage games" />
          <QuickAction href="/admin/bundles/new" icon={Package} label="Create bundle" />
          <QuickAction href="/admin/games" icon={Users} label="Manage users" disabled />
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Recently updated games
          </h2>
          <Link href="/admin/games" className="text-xs font-medium text-accent-cyan hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-3 overflow-hidden rounded-2xl border border-border-glass">
          {recent.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-text-muted">No recent activity</p>
          ) : (
            <ul>
              {recent.map((g) => (
                <li
                  key={g.id}
                  className="flex items-center gap-3 border-b border-border-glass px-4 py-3 last:border-0"
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                    <CoverArt title={g.title} genre={g.genre} imageUrl={g.coverImage} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text-primary">{g.title}</p>
                    <p className="text-xs text-text-muted">{formatINR(g.salePrice)}</p>
                  </div>
                  <StatusPill status={g.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
  disabled,
}: {
  href: string;
  icon: typeof Plus;
  label: string;
  disabled?: boolean;
}) {
  const content = (
    <>
      <Icon size={18} className="text-accent-cyan" />
      <span className="mt-2 text-sm font-medium text-text-primary">{label}</span>
      {disabled && <span className="mt-0.5 text-[10px] text-text-muted">Coming soon</span>}
    </>
  );
  const className =
    "glass-panel flex flex-col items-start rounded-2xl p-4 transition-colors hover:border-accent-cyan/40";

  if (disabled) {
    return <div className={`${className} opacity-60`}>{content}</div>;
  }
  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
