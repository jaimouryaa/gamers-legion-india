import { getPublicGames, getFeaturedGames, getActiveDeals } from "@/lib/queries/games";
import { getPublicBundles } from "@/lib/queries/bundles";
import { getPublishedProofs } from "@/lib/queries/proofs";
import { Hero } from "@/components/site/hero";
import { GameHero } from "@/components/hero/game-hero";
import { FeatureStrip } from "@/components/site/feature-strip";
import { FeaturedGames } from "@/components/site/featured-games";
import { BundleSection } from "@/components/site/bundle-section";
import { DealsSection } from "@/components/site/deals-section";
import { RecentlyAdded } from "@/components/site/recently-added";
import { ProofSection } from "@/components/site/proof-section";
import { FinalCTA } from "@/components/site/final-cta";
import { StatsStrip } from "@/components/site/stats-strip";

export default async function HomePage() {
  const [games, featured, allBundles, proofs] = await Promise.all([
    getPublicGames(),
    getFeaturedGames(),
    getPublicBundles(),
    getPublishedProofs(),
  ]);
  const featuredBundles = allBundles.filter((b) => b.featured);
  const displayBundles = featuredBundles.length > 0 ? featuredBundles : allBundles;
  const recentlyAdded = [...games].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const activeDeals = getActiveDeals(games);
  const heroGames = (featured.length > 0 ? featured : games).filter((g) => g.slug).slice(0, 10);

  return (
    <>
      {heroGames.length >= 3 ? <GameHero games={heroGames} /> : <Hero />}
      <FeatureStrip />
      <FeaturedGames games={featured.length > 0 ? featured : games} />
      <BundleSection bundles={displayBundles} games={games} />
      <RecentlyAdded games={recentlyAdded} />
      <DealsSection deals={activeDeals} />
      <ProofSection proofs={proofs} />
      <FinalCTA />
      <StatsStrip />
    </>
  );
}
