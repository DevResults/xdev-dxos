import { type ButtonProps, Button } from "@ui/button"
import { Spinner } from "~/ui/Spinner"

export const SubmitButton = ({ isSubmitting, submittingText, children, ...props }: Props) => (
  <Button {...props} type="submit" disabled={isSubmitting}>
    {isSubmitting ?
      <>
        <Spinner onDark className="mr-2" />
        {submittingText}
      </>
    : children}
  </Button>
)

type Props = ButtonProps & {
  isSubmitting: boolean
  submittingText: string
}
