import { useParams } from "react-router-dom";
import { worlds } from "../data/worlds.js";
import PatchNotes from "../components/PatchNotes.jsx";
import { Micro } from "../components/ui.jsx";

// Public mirror of a world's daily update feed.
export default function WorldFeed() {
  const { slug } = useParams();
  const world = worlds.find((w) => w.id === slug);
  return (
    <main className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:py-24">
      <Micro>WORLD FEED</Micro>
      <h1 className="mt-3 font-sans text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
        {world ? world.name : slug}: updated against the live service.
      </h1>
      <p className="mt-4 max-w-[60ch] text-base leading-[1.6] text-gray-lt">
        Patch notes, API changes, and internal updates land in the world the same day. This feed is the
        record.
      </p>
      <div className="mt-8 max-w-[720px]">
        <PatchNotes world={slug} surface="public" />
      </div>
    </main>
  );
}
