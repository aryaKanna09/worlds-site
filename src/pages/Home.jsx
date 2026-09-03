import Hero from "../components/Hero.jsx";
import Scorecard from "../components/Scorecard.jsx";
import Report from "../components/Report.jsx";
import WhyNow from "../components/WhyNow.jsx";
import CatalogTeaser from "../components/CatalogTeaser.jsx";

export default function Home({ onInstall }) {
  return (
    <main>
      <Hero />
      <Scorecard />
      <Report />
      <WhyNow />
      <CatalogTeaser onInstall={onInstall} />
    </main>
  );
}
