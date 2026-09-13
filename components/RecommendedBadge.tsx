import Icon from '@/components/Icon';

interface RecommendedBadgeProps {
  /** Screen-reader text, e.g. "Recommended, rank 1 of 3". */
  ariaLabel?: string;
}

/** Marks the top-ranked item in a ranked list (schemes, channel partners). */
export default function RecommendedBadge({ ariaLabel = 'Recommended' }: RecommendedBadgeProps) {
  return (
    <span
      className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary text-white inline-flex items-center gap-1"
      aria-label={ariaLabel}
    >
      <Icon name="verified" className="w-3 h-3" />
      Recommended
    </span>
  );
}
