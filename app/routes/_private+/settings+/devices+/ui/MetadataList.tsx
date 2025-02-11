import { cx } from "~/lib/cx";

export const MetadataList = ({ children, className }: Props) => (
  <div
    className={cx("flex flex-row gap-2 divide-x text-xs text-neutral-400 [&>div:not(:first-child)]:pl-2", className)}
  >
    {children}
  </div>
);

type Props = {
  children: React.ReactNode;
  className?: string;
};
