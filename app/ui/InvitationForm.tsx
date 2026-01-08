import { effectTsResolver } from "@hookform/resolvers/effect-ts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/form"
import { Input } from "@ui/input"
import { useEffect } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { SubmitButton } from "./SubmitButton"
import { S } from "~/schema/lib/Effect"

export function InvitationForm({
  heading,
  description,
  invitationCode = "",
  readOnly = false,
  onSubmit,
  error: _error,
}: Props) {
  const form = useForm<Schema>({
    resolver: effectTsResolver(schema),
    defaultValues: { invitationCode },
  })
  const { setError, formState } = form

  useEffect(() => {
    if (_error) {
      setError("invitationCode", { type: "custom", message: _error })
    }
  })

  return (
    <Card className="w-full max-w-xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async data => {
            try {
              await onSubmit(data)
            } catch (error: any) {
              const { message } = error as Error
              setError("invitationCode", { type: "custom", message })
            }
          })}
        >
          <CardHeader>
            <CardTitle>{heading}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="invitationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invitation code</FormLabel>
                  <FormControl>
                    <Input autoFocus {...field} disabled={readOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <SubmitButton
              intent="primary"
              size="md"
              className="grow justify-center"
              submittingText="Connecting..."
              isSubmitting={formState.isSubmitting}
            >
              Join team
            </SubmitButton>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

const schema = S.Struct({
  invitationCode: S.Trim.pipe(
    S.minLength(8, { message: () => "Code must be at least 8 characters." }),
    S.pattern(/^[a-zA-Z\d]+$/, {
      message: () => "An invitation code can only have letters and numbers.",
    }),
  ),
})
type Schema = S.Schema.Type<typeof schema>

type Props = {
  heading: React.ReactNode
  description?: React.ReactNode
  invitationCode?: string | undefined
  readOnly?: boolean
  onSubmit: SubmitHandler<Schema>
  error?: string | undefined
}
