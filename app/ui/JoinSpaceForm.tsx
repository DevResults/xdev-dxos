import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/form"
import { Input } from "@ui/input"
import { Invitation } from "@dxos/react-client/invitations"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { SubmitButton } from "./SubmitButton"

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

  // Form for invitation code
  const invitationForm = useForm<InvitationSchema>({
    resolver: zodResolver(invitationSchema),
    defaultValues: { invitationCode: initialInvitationCode },
  })

  // Form for auth code
  const authForm = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: { authCode: "" },
  })

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
      // No default
    }
  }, [status])

  // Show error messages
  useEffect(() => {
    if (error) {
      if (phase === "invitation") {
        invitationForm.setError("invitationCode", { type: "custom", message: error })
      } else {
        authForm.setError("authCode", { type: "custom", message: error })
      }
    }
  }, [error, phase, invitationForm, authForm])

  const handleInvitationSubmit = async (data: InvitationSchema) => {
    setIsSubmitting(true)
    onJoin(data.invitationCode)
  }

  const handleAuthSubmit = async (data: AuthSchema) => {
    setIsSubmitting(true)
    await onAuthenticate(data.authCode)
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

      default: {
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
                        disabled={isSubmitting || Boolean(initialInvitationCode)}
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
      <Form {...authForm}>
        <form onSubmit={authForm.handleSubmit(handleAuthSubmit)}>
          <CardHeader>
            <CardTitle>{heading}</CardTitle>
            <CardDescription>
              Enter the verification code shown on the host's device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={authForm.control}
              name="authCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification code</FormLabel>
                  <FormControl>
                    <Input autoFocus {...field} disabled={isSubmitting} />
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
      </Form>
    </Card>
  )
}

const invitationSchema = z.object({
  invitationCode: z
    .string()
    .trim()
    .min(8, { message: "Code must be at least 8 characters." })
    .regex(/^[a-zA-Z\d]+$/, { message: "An invitation code can only have letters and numbers." }),
})
type InvitationSchema = z.infer<typeof invitationSchema>

const authSchema = z.object({
  authCode: z.string().trim().min(1, { message: "Please enter the verification code." }),
})
type AuthSchema = z.infer<typeof authSchema>

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
