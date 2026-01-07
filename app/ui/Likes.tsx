import { useState } from "react"
import { cx } from "~/lib/cx"
import { likesDescription } from "~/lib/likesDescription"
import type { Contact } from "~/schema/Contact"

export function Likes({ likes = [], self, onToggle }: Props) {
  const numberLikes = likes.length ?? 0
  const likedByMe = likes.includes(self)
  const readonly = onToggle === undefined

  const [animateLike, setAnimateLike] = useState(false)
  const [animateUnlike, setAnimateUnlike] = useState(false)

  if (readonly && numberLikes === 0) {
    return null
  }

  return (
    <button
      className="flex min-h-[1.5em] cursor-pointer flex-row items-center gap-1 py-px font-sans text-xs text-neutral-400"
      onClick={() => {
        if (readonly) {
          return
        }

        if (likedByMe) {
          setAnimateUnlike(true)
          setTimeout(() => {
            setAnimateUnlike(false)
          }, 200)
        } else {
          setAnimateLike(true)
          setTimeout(() => {
            setAnimateLike(false)
          }, 200)
        }

        onToggle()
      }}
      title={numberLikes === 0 ? "Click to like" : likesDescription(likes, self)}
    >
      {numberLikes === 0 ?
        <IconHeart
          className={cx(
            "size-[1em]", //
            animateUnlike && "animate-shortshake",
          )}
        />
      : <>
          <IconHeartFilled
            className={cx(
              "size-[1em]",
              likedByMe && "text-primary",
              animateLike && "animate-celebrate",
              animateUnlike && "animate-shortshake",
            )}
          />
          {numberLikes}
        </>
      }
    </button>
  )
}

type Props = {
  likes?: Contact[]
  self: Contact
  onToggle?: () => void
}
