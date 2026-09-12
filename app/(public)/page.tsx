import { getPublicGames, getFeaturedGames, getActiveDeals } from "@/lib/queries/games";
import { Hero } from "@/components/site/hero";
import { FeatureStrip } from "@/components/site/feature-strip";
import { FeaturedGames } from "@/components/site/featured-games";
import { DealsSection } from "@/components/site/deals-section";
import { RecentlyAdded } from "@/components/site/recently-added";
import { PromotionBanner } from "@/components/site/promotion-banner";
import { FinalCTA } from "@/components/site/final-cta";

export default async function HomePage() {
  const [games, featured] = await Promise.all([getPublicGames(), getFeaturedGames()]);
  const recentlyAdded = [...games].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const activeDeals = getActiveDeals(games);

  return (
    <>
      <Hero />
      <FeatureStrip />
      <FeaturedGames games={featured.length > 0 ? featured : games} />
      <DealsSection deals={activeDeals} />
      <RecentlyAdded games={recentlyAdded} />
      <PromotionBanner />
      <FinalCTA />
    </>
  );
}
