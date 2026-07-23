import type { ReactNode } from "react";

export function ContentBody({ body }: { body: string }) {
  const lines = body.split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(
        <h2
          key={`heading-${index}`}
          className="font-display mt-14 text-3xl leading-tight first:mt-0 sm:text-4xl"
        >
          {line.slice(3)}
        </h2>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push(
        <h3
          key={`subheading-${index}`}
          className="font-display mt-10 text-2xl leading-tight"
        >
          {line.slice(4)}
        </h3>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      blocks.push(
        <blockquote
          key={`quote-${index}`}
          className="border-primary text-foreground my-9 border-l-2 py-2 pl-6 text-xl leading-8"
        >
          {renderInline(line.slice(2))}
        </blockquote>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      const start = index;
      while (index < lines.length && lines[index].trim().startsWith("- ")) {
        items.push(lines[index].trim().slice(2));
        index += 1;
      }
      blocks.push(
        <ul key={`list-${start}`} className="my-6 space-y-3 pl-1">
          {items.map((item) => (
            <li key={item} className="flex gap-3 leading-8">
              <span className="bg-primary mt-3 size-1.5 shrink-0 rounded-full" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    const paragraph = [line];
    const start = index;
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].trim().startsWith("## ") &&
      !lines[index].trim().startsWith("### ") &&
      !lines[index].trim().startsWith("> ") &&
      !lines[index].trim().startsWith("- ")
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(
      <p
        key={`paragraph-${start}`}
        className="text-muted-foreground my-6 text-base leading-8 sm:text-lg sm:leading-9"
      >
        {renderInline(paragraph.join(" "))}
      </p>,
    );
  }

  return <div className="mx-auto max-w-3xl px-6 py-20">{blocks}</div>;
}

function renderInline(value: string) {
  const link = /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g;
  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const match of value.matchAll(link)) {
    if (match.index > cursor) parts.push(value.slice(cursor, match.index));
    parts.push(
      <a
        key={`${match[2]}-${match.index}`}
        href={match[2]}
        target="_blank"
        rel="noreferrer"
        className="text-primary underline decoration-current/30 underline-offset-4 hover:decoration-current"
      >
        {match[1]}
      </a>,
    );
    cursor = match.index + match[0].length;
  }
  if (cursor < value.length) parts.push(value.slice(cursor));
  return parts.length ? parts : value;
}
