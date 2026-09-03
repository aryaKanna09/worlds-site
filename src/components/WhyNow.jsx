import { useEffect, useRef, useState } from "react";
import { whynow } from "../data/whynow.js";
import { Section, Micro } from "./ui.jsx";

function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return [ref, visible];
}

function FadeRow({ row }) {
  const [ref, visible] = useFadeIn();
  const fade = `fade-row transition-opacity duration-[400ms] ${visible ? "opacity-100" : "opacity-15"}`;

  if (row.kicker) {
    return (
      <div ref={ref} className={`${fade} relative py-10 pl-7`}>
        <span aria-hidden="true" className="absolute top-1/2 left-0 h-[22px] w-[10px] -translate-y-1/2 bg-accent" />
        <p className="max-w-[720px] font-sans text-xl leading-snug font-medium text-fg sm:text-2xl">
          {row.text}
        </p>
      </div>
    );
  }

  return (
    <div ref={ref} className={`${fade} flex flex-col gap-3 py-8 sm:flex-row sm:gap-10`}>
      <span className="label-mono w-36 shrink-0 text-xs text-gray-mid">{row.date}</span>
      <p className="max-w-[720px] text-lg leading-[1.6] text-gray-lt">
        {row.text}{" "}
        {row.url ? (
          <a
            href={row.url}
            target="_blank"
            rel="noreferrer"
            className="label-mono text-xs text-gray-mid hover:text-fg"
          >
            {row.source}
          </a>
        ) : (
          <span className="label-mono text-xs text-gray-mid">{row.source}</span>
        )}
      </p>
    </div>
  );
}

export default function WhyNow() {
  return (
    <Section>
      <Micro>THE ENVIRONMENT CHANGED</Micro>
      <div className="mt-8 divide-y divide-hairline border-y border-hairline">
        {whynow.map((row) => (
          <FadeRow key={row.text} row={row} />
        ))}
      </div>
    </Section>
  );
}
