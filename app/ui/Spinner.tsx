import { cx } from "~/lib/cx";

export function Spinner({ className = "", onDark = false }: Props = {}) {
  const borderColors = onDark ? "border-white border-r-white/20" : "border-neutral-700 border-r-neutral-700/20";

  return (
    <span
      className={cx(
        `inline-block size-[1em] animate-spin rounded-full border-[0.15em] border-solid px-1`,
        borderColors,
        className
      )}
    ></span>
  );
}

type Props = {
  onDark?: boolean;
  className?: string;
};
