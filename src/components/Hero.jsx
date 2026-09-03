import { Link } from "react-router-dom";
import Sphere from "./Sphere.jsx";
import LogoWall from "./LogoWall.jsx";
import { track } from "../lib/analytics.ts";
import { Micro, ctaPrimary } from "./ui.jsx";

export default function Hero() {
  return (
    <section className="overflow-hidden border-b border-hairline">
      <div className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)] xl:grid-cols-[minmax(0,1fr)_minmax(0,560px)]">
          <div className="max-w-xl">
            <Micro>AGENT GRADING</Micro>
            <h1
              className="mt-6 font-sans font-bold leading-[1.05] tracking-[-0.02em]"
              style={{ fontSize: "clamp(38px, 5vw, 68px)" }}
            >
              Prove what your agents did.
            </h1>
            <p className="mt-6 font-mono text-base leading-relaxed tracking-[0.08em] text-gray-mid">
              Same test. Same conditions. Same verdict. Every run.
            </p>
            <p className="mt-6 max-w-[60ch] text-base leading-[1.7] text-gray-lt">
              Worlds grades an agent on what it actually changed, not what it said. Every run replays
              under identical conditions, enforces the real business rules, and ends in a signed report
              you can hand to a buyer, an auditor, or your board.
            </p>
            <div className="mt-8">
              <Link
                to="/sign-in"
                onClick={() => track("cta_test_your_agent_clicked", { source: "hero" })}
                className={ctaPrimary}
              >
                TEST YOUR OWN AGENT
              </Link>
              <p className="mt-4 font-mono text-sm tracking-[0.08em] text-gray-mid">
                Free. One world. Your rules.
              </p>
            </div>
          </div>

          <div className="flex w-full justify-center lg:justify-end">
            <Sphere />
          </div>
        </div>

        <LogoWall />
      </div>
    </section>
  );
}
