"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MessageContentProps {
  content: string;
  tapToLearn?: string;
  onTermClick: (slug: string) => void;
}

/** Turn [TERM:slug:label] markers into markdown links with a custom `term:` scheme. */
function withTermLinks(text: string): string {
  return text.replace(/\[TERM:([^:\]]+):([^\]]+)\]/g, (_m, slug, label) => `[${label}](term:${slug})`);
}

export default function MessageContent({ content, tapToLearn, onTermClick }: MessageContentProps) {
  return (
    <div className="md-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={(url) => (url.startsWith("term:") ? url : /^(https?:|mailto:|#)/.test(url) ? url : "")}
        components={{
          a({ href, children }) {
            if (href?.startsWith("term:")) {
              const slug = href.slice(5);
              return (
                <button
                  type="button"
                  onClick={() => onTermClick(slug)}
                  title={tapToLearn}
                  className={cn(
                    "inline-flex items-center gap-0.5 mx-0.5 align-baseline",
                    "bg-primary/15 hover:bg-primary/25 border border-primary/40",
                    "text-primary rounded px-1.5 py-0.5 text-[0.8125rem] font-semibold leading-none",
                    "cursor-pointer transition-colors duration-150"
                  )}
                >
                  <span>{children}</span>
                  <span className="material-symbols-outlined text-[13px] opacity-70">info</span>
                </button>
              );
            }
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                {children}
              </a>
            );
          },
        }}
      >
        {withTermLinks(content)}
      </ReactMarkdown>
    </div>
  );
}
