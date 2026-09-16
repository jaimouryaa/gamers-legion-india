import { getPublicGames, getFeaturedGames, getActiveDeals } from "@/lib/queries/games";
import { getFeaturedBundles } from "@/lib/queries/bundles";
import { Hero } from "@/components/site/hero";
import { FeatureStrip } from "@/components/site/feature-strip";
import { FeaturedGames } from "@/components/site/featured-games";
import { BundleSection } from "@/components/site/bundle-section";
import { DealsSection } from "@/components/site/deals-section";
import { RecentlyAdded } from "@/components/site/recently-added";
import { PromotionBanner } from "@/components/site/promotion-banner";
import { FinalCTA } from "@/components/site/final-cta";

export default async function HomePage() {
  const [games, featured, featuredBundles] = await Promise.all([
    getPublicGames(),
    getFeaturedGames(),
    getFeaturedBundles(),
  ]);
  const recentlyAdded = [...games].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const activeDeals = getActiveDeals(games);

  return (
    <>
      <Hero />
      <FeatureStrip />
      <FeaturedGames games={featured.length > 0 ? featured : games} />
      <BundleSection bundles={featuredBundles} games={games} />
      <DealsSection deals={activeDeals} />
      <RecentlyAdded games={recentlyAdded} />
      <PromotionBanner />
      <FinalCTA />
    </>
  );
}
