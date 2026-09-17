import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MessageCircle, PackageCheck } from "lucide-react";
import { getBundleBySlug, getPublicBundles } from "@/lib/queries/bundles";
import { getPublicGames } from "@/lib/queries/games";
import { CoverArt } from "@/components/ui/cover-art";
import { DiscountBadge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Price } from "@/components/ui/price";
import { GameGrid } from "@/components/site/game-grid";
import { formatINR, buildWhatsAppBundleLink, ogImageFor } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getBundleBySlug(slug);
  if (!bundle) return { title: "Bundle not found" };
  const description = bundle.description.slice(0, 155);
  const image = ogImageFor(bundle.bannerImage);
  return {
    title: bundle.name,
    description,
    openGraph: {
      title: bundle.name,
      description,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: bundle.name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BundleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [bundle, allBundles, allGames] = await Promise.all([
    getBundleBySlug(slug),
    getPublicBundles(),
    getPublicGames(),
  ]);
  if (!bundle) notFound();

  const includedGames = bundle.gameIds
    .map((id) => allGames.find((g) => g.id === id))
    .filter((g): g is NonNullable<typeof g> => !!g);

  const otherBundles = allBundles.filter((b) => b.id !== bundle.id).slice(0, 2);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="glass-panel overflow-hidden rounded-3xl">
        <div className="relative h-56 sm:h-72">
          <CoverArt title={bundle.name} imageUrl={bundle.bannerImage} />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent" />
        </div>
        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.2em] text-accent-violet">
                <PackageCheck size={13} />
                {includedGames.length} {includedGames.length === 1 ? "GAME" : "GAMES"}
              </span>
              <h1 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
                {bundle.name}
              </h1>
            </div>
            {bundle.discountPercentage > 0 && <DiscountBadge percentage={bundle.discountPercentage} />}
          </div>

          {bundle.rating != null && (
            <div className="mt-4">
              <Rating value={bundle.rating} size="md" />
            </div>
          )}

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-text-secondary">
            {bundle.description}
          </p>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-border-glass bg-surface/60 p-6">
            <div>
              <Price original={bundle.originalPrice} sale={bundle.bundlePrice} size="lg" />
              {bundle.savings > 0 && (
                <p className="mt-1 text-xs font-medium text-success">
                  You save {formatINR(bundle.savings)}
                </p>
              )}
            </div>
            <a
              href={buildWhatsAppBundleLink({
                name: bundle.name,
                price: bundle.bundlePrice,
                slug: bundle.slug,
              })}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg">
                <MessageCircle size={16} />
                Buy bundle via WhatsApp
              </Button>
            </a>
          </div>

          {includedGames.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-5 font-display text-lg font-semibold text-text-primary">
                What&apos;s included
              </h2>
              <GameGrid games={includedGames} />
            </div>
          )}
        </div>
      </div>

      {otherBundles.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-6 font-display text-xl font-semibold text-text-primary">
            Other bundles
          </h2>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {otherBundles.map((b) => (
              <a
                key={b.id}
                href={`/bundles/${b.slug}`}
                className="glass-panel flex gap-4 overflow-hidden rounded-2xl p-4 transition-colors hover:border-accent-violet/40"
              >
                <div className="h-20 w-32 shrink-0 overflow-hidden rounded-xl">
                  <CoverArt title={b.name} imageUrl={b.bannerImage} />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-display text-sm font-semibold text-text-primary">{b.name}</p>
                  <Price original={b.originalPrice} sale={b.bundlePrice} size="sm" className="mt-1" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
