// The site logo: an ermine spot (the black-and-white symbol of Brittany)
// next to the name. It uses the current text colour, so it works on
// both light and dark backgrounds.
export function ErmineMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 60" aria-hidden="true" className={className} fill="currentColor">
      <circle cx="20" cy="6" r="4.5" />
      <circle cx="10.5" cy="14" r="4.5" />
      <circle cx="29.5" cy="14" r="4.5" />
      <path d="M20 17 C23 27 31 40 33 58 L26.5 51 L20 59 L13.5 51 L7 58 C9 40 17 27 20 17 Z" />
    </svg>
  );
}

// "Keleier Breiz hag ar Bed": on one line on wide screens, two lines on phones.
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <ErmineMark className="h-[1.6em] w-auto shrink-0 sm:h-[1em]" />
      <span className="text-left font-serif font-black uppercase leading-[1.05] tracking-[0.08em]">
        <span className="block sm:inline">Keleier Breiz</span> <span className="block sm:inline">hag ar Bed</span>
      </span>
    </span>
  );
}
