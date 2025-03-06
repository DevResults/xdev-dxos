export const DeleteButton = ({ onDestroy }: Props) => {
  return (
    <button
      title="Delete"
      className="cursor-pointer rounded-full bg-neutral-200 p-1 font-bold text-danger-500 opacity-0 hover:bg-danger hover:text-white focus:opacity-100 group-hover:opacity-100"
      onClick={() => onDestroy()}
      onFocus={e => e.stopPropagation()}
      tabIndex={-1}
    >
      <IconTrash className="size-4" />
    </button>
  )
}

type Props = {
  onDestroy: () => void
}
