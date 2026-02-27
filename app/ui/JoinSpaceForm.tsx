import { Invitation } from "@dxos/react-client/invitations"
import { effectTsResolver } from "@hookform/resolvers/effect-ts"
import { Button } from "@ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/form"
import { Input } from "@ui/input"
import { type FormEvent, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { SubmitButton } from "./SubmitButton"
import { S } from "~/schema/lib/Effect"

export function JoinSpaceForm({
  heading,
  description,
  invitationCode: initialInvitationCode = "",
  status,
  error,
  onJoin,
  onAuthenticate,
  onCancel,
}: Props) {
  const [phase, setPhase] = useState<"invitation" | "auth">("invitation")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form for invitation code (uses react-hook-form for validation)
  const invitationForm = useForm<InvitationSchema>({
    resolver: effectTsResolver(invitationSchema),
    defaultValues: { invitationCode: initialInvitationCode },
  })

  // Auth code uses plain state — react-hook-form's Controller doesn't reliably
  // update when the parent re-renders rapidly (e.g. from DXOS status updates).
  const [authCode, setAuthCode] = useState("")
  const [authError, setAuthError] = useState<string | undefined>()

  // Update phase based on invitation status
  useEffect(() => {
    switch (status) {
      case Invitation.State.READY_FOR_AUTHENTICATION: {
        setPhase("auth")
        setIsSubmitting(false)

        break
      }

      case Invitation.State.AUTHENTICATING: {
        setIsSubmitting(true)

        break
      }

      case Invitation.State.SUCCESS: {
        setIsSubmitting(true)

        break
      }

      case Invitation.State.ERROR:
      case Invitation.State.TIMEOUT:
      case Invitation.State.CANCELLED: {
        setIsSubmitting(false)

        break
      }

      case Invitation.State.INIT:
      case Invitation.State.CONNECTING:
      case Invitation.State.CONNECTED:
      case Invitation.State.EXPIRED: {
        // These states don't require phase/submitting changes
        break
      }
    }
  }, [status])

  // Show error messages
  useEffect(() => {
    if (error) {
      if (phase === "invitation") {
        invitationForm.setError("invitationCode", { type: "custom", message: error })
      } else {
        setAuthError(error)
      }
    }
  }, [error, phase, invitationForm])

  const handleInvitationSubmit = async (data: InvitationSchema) => {
    setIsSubmitting(true)
    onJoin(data.invitationCode)
  }

  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = authCode.trim()
    if (trimmed.length === 0) {
      setAuthError("Please enter the verification code.")
      return
    }

    setAuthError(undefined)
    setIsSubmitting(true)
    await onAuthenticate(trimmed)
  }

  const getStatusMessage = () => {
    switch (status) {
      case Invitation.State.CONNECTING: {
        return "Connecting..."
      }

      case Invitation.State.CONNECTED: {
        return "Connected, waiting for host..."
      }

      case Invitation.State.READY_FOR_AUTHENTICATION: {
        return "Enter the verification code"
      }

      case Invitation.State.AUTHENTICATING: {
        return "Verifying..."
      }

      case Invitation.State.SUCCESS: {
        return "Joined! Redirecting..."
      }

      case Invitation.State.INIT:
      case Invitation.State.CANCELLED:
      case Invitation.State.TIMEOUT:
      case Invitation.State.ERROR:
      case Invitation.State.EXPIRED: {
        return undefined
      }
    }
  }

  const statusMessage = getStatusMessage()

  if (phase === "invitation") {
    return (
      <Card className="w-full max-w-xl">
        <Form {...invitationForm}>
          <form onSubmit={invitationForm.handleSubmit(handleInvitationSubmit)}>
            <CardHeader>
              <CardTitle>{heading}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={invitationForm.control}
                name="invitationCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invitation code</FormLabel>
                    <FormControl>
                      <Input
                        autoFocus
                        {...field}
                        readOnly={Boolean(initialInvitationCode)}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {statusMessage && <p className="mt-4 text-sm text-neutral-500">{statusMessage}</p>}
            </CardContent>
            <CardFooter className="gap-2">
              <SubmitButton
                intent="primary"
                size="md"
                className="grow justify-center"
                submittingText="Connecting..."
                isSubmitting={isSubmitting}
              >
                Join team
              </SubmitButton>
              <Button type="button" intent="neutral" size="md" onClick={onCancel}>
                Cancel
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    )
  }

  // Auth phase
  return (
    <Card className="w-full max-w-xl">
      <form onSubmit={handleAuthSubmit}>
        <CardHeader>
          <CardTitle>{heading}</CardTitle>
          <CardDescription>Enter the verification code shown on the host's device</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <label htmlFor="authCode" className="text-sm font-medium leading-none">
              Verification code
            </label>
            <Input
              id="authCode"
              autoFocus
              value={authCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setAuthCode(e.target.value)
                setAuthError(undefined)
              }}
              disabled={isSubmitting}
            />
            {authError && <p className="text-sm font-medium text-red-500">{authError}</p>}
          </div>
          {statusMessage && <p className="mt-4 text-sm text-neutral-500">{statusMessage}</p>}
        </CardContent>
        <CardFooter className="gap-2">
          <SubmitButton
            intent="primary"
            size="md"
            className="grow justify-center"
            submittingText="Verifying..."
            isSubmitting={isSubmitting}
          >
            Verify
          </SubmitButton>
          <Button type="button" intent="neutral" size="md" onClick={onCancel}>
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

const invitationSchema = S.Struct({
  invitationCode: S.Trim.pipe(
    S.minLength(8, { message: () => "Code must be at least 8 characters." }),
    S.pattern(/^[a-zA-Z\d]+$/, {
      message: () => "An invitation code can only have letters and numbers.",
    }),
  ),
})
type InvitationSchema = S.Schema.Type<typeof invitationSchema>

type Props = {
  heading: React.ReactNode
  description?: React.ReactNode
  invitationCode?: string | undefined
  status: Invitation.State
  error?: string | undefined
  onJoin: (invitationCode: string) => void
  onAuthenticate: (authCode: string) => Promise<void>
  onCancel: () => void
}
