import Image from "next/image";
import { PortableText, type PortableTextComponents, type PortableTextBlock } from "@portabletext/react";
import type { ArticleImage } from "@/lib/articles";
import { imageUrl } from "@/sanity/client";

// Sanity image references end in "-<width>x<height>-<ext>": read the size from it.
function imageSize(image: ArticleImage): { width: number; height: number } {
  const ref = (image as { asset?: { _ref?: string } }).asset?._ref ?? "";
  const match = ref.match(/-(\d+)x(\d+)-/);
  return match ? { width: Number(match[1]), height: Number(match[2]) } : { width: 1344, height: 896 };
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-5">{children}</p>,
    h2: ({ children }) => <h2 className="mt-10 font-serif text-3xl font-bold">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 font-serif text-2xl font-bold">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="mt-6 border-l-4 border-ink pl-4 italic">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="mt-5 list-disc pl-6">{children}</ul>,
    number: ({ children }) => <ol className="mt-5 list-decimal pl-6">{children}</ol>,
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} className="underline" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: { value: ArticleImage }) => {
      const { width, height } = imageSize(value);
      const displayWidth = Math.min(width, 1344);
      return (
        <figure className="mt-6">
          <Image
            src={imageUrl(value).width(displayWidth).url()}
            alt={value.alt ?? ""}
            width={displayWidth}
            height={Math.round((height * displayWidth) / width)}
            className="w-full"
          />
        </figure>
      );
    },
  },
};

// The full text of an article: paragraphs, headings, quotes, lists and pictures.
export function ArticleBody({ body }: { body: PortableTextBlock[] }) {
  return (
    <div className="font-serif text-lg leading-relaxed [&>*:first-child]:mt-0">
      <PortableText value={body} components={components} />
    </div>
  );
}
