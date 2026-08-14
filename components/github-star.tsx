"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

export function HeaderGithubStar({
  repo = "Wefters/wefter",
}: {
  repo?: string;
}) {
  const [stars, setStars] = useState<number>(2);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${repo}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {});
  }, [repo]);

  return (
    <a
      href={`https://github.com/${repo}`}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col items-center justify-center gap-0.5 rounded-lg px-2.5 py-1 text-fd-foreground hover:bg-fd-accent/80 transition-all group shrink-0"
      title={`GitHub Repository: ${stars} stars`}
    >
      <div className="flex items-center gap-1.5">
        <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
        <span className="font-semibold text-xs leading-none">GitHub</span>
      </div>
      <div className="flex items-center gap-1 text-[10px] font-mono text-fd-muted-foreground group-hover:text-fd-foreground transition-colors leading-none">
        <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
        <span className="font-bold">{stars.toLocaleString()} stars</span>
      </div>
    </a>
  );
}

export function GithubStarButton({
  repo = "Wefters/wefter",
  className = "",
}: {
  repo?: string;
  className?: string;
}) {
  const [stars, setStars] = useState<number>(2);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${repo}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {});
  }, [repo]);

  return (
    <a
      href={`https://github.com/${repo}`}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1.5 rounded-xl border border-fd-border/80 bg-fd-card/80 px-3.5 py-2 text-xs font-semibold text-fd-foreground shadow-xs backdrop-blur-xs transition-all hover:bg-fd-accent hover:border-fd-primary/40 group ${className}`}
    >
      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
      <span>Star</span>
      <span className="ml-0.5 rounded-md bg-fd-muted/80 px-1.5 py-0.5 text-[10px] font-mono text-fd-muted-foreground font-bold">
        {stars.toLocaleString()}
      </span>
    </a>
  );
}
