import HeroSection from "../components/home/HeroSection.jsx";
import CurrentDrop from "../components/home/CurrentDrop.jsx";
import FeaturedProducts from "../components/home/FeaturedProducts.jsx";
import EditorialShowcase from "../components/home/EditorialShowcase.jsx";
import DropCountdown from "../components/home/DropCountdown.jsx";
import ManifestoSection from "../components/home/ManifestoSection.jsx";
import ExploreByAnime from "../components/home/ExploreByAnime.jsx";
export default function Home() {
  return (
    <>
      <HeroSection />
      <CurrentDrop />
      <ExploreByAnime/>
      <FeaturedProducts />
      <EditorialShowcase />
      <DropCountdown />
      <ManifestoSection />
    </>
  );
}
