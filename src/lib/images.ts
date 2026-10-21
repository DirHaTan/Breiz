import "server-only";
import type { ArticleImage } from "@/lib/articles";
import { imageUrl } from "@/sanity/client";

// Web address of an article image, cropped to 16:9 at the given width.
export function imageSrc(image: ArticleImage, width: number): string {
  return imageUrl(image).width(width).height(Math.round((width * 9) / 16)).fit("crop").url();
}
