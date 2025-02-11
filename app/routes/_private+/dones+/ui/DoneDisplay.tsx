import { cx } from "~/lib/cx";
import { Likes } from "../../ui/Likes";

/**
 * Displays a read-only DoneEntry along with the Like button.
 */
export function DoneDisplay({ className = "", done, updateLikes, self }: Props) {
  const { content, likes } = done;
  return (
    <li className="rounded-md bg-neutral-50 p-2">
      <span className={cx("done-entry whitespace-pre-line", className)}>{content}</span>
      <Likes
        likes={[...likes]}
        self={self}
        onToggle={() => {
          const newLikes = new Set(likes ?? []);
          if (!newLikes.delete(self)) newLikes.add(self);
          updateLikes([...newLikes]);
        }}
      />
    </li>
  );
}

type Props = {
  className?: string;
  done: any;
  updateLikes: (likes: any[]) => void;
  self: any;
};
