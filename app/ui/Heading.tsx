import { cx } from "class-variance-authority"

/** Renders a styled heading element (h1, h2, or h3). */
export const Heading = ({ level, className, children }: Props) => {
  const Tag = `h${level}` as const
  return <Tag className={cx(styles[level], className)}>{children}</Tag>
}

const styles = {
  1: "text-lg font-bold tracking-tight text-neutral-900",
  2: "font-serif text-xl text-neutral-800",
  3: "text-sm font-bold text-neutral-700",
} as const

type Props = {
  /** The heading level (1, 2, or 3). */
  level: 1 | 2 | 3
  /** Additional CSS classes. */
  className?: string
  children: React.ReactNode
}
