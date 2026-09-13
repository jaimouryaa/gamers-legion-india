import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { WishlistDrawer } from "@/components/site/wishlist-drawer";
import { WhatsAppFloatButton } from "@/components/site/whatsapp-float-button";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <WishlistDrawer />
      <WhatsAppFloatButton />
    </>
  );
}
