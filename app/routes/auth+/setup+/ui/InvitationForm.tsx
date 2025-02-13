import { zodResolver } from "@hookform/resolvers/zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/ui/shadcn/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/ui/shadcn/form"
import { Input } from "~/ui/shadcn/input"
import { useEffect } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { SubmitButton } from "./SubmitButton"

export function InvitationForm({
  heading,
  description,
  invitationCode = "",
  readOnly = false,
  onSubmit,
  error: _error,
}: Props) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { invitationCode },
  })
  const { setError, formState } = form

  useEffect(() => {
    if (_error) setError("invitationCode", { type: "custom", message: _error })
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

const schema = z.object({
  invitationCode: z
    .string()
    .trim()
    .min(8, { message: "Code must be at least 8 characters." })
    .regex(/^[a-zA-Z\d]+$/, { message: "An invitation code can only have letters and numbers." }),
})
type Schema = z.infer<typeof schema>

type Props = {
  heading: React.ReactNode
  description?: React.ReactNode
  invitationCode?: string | undefined
  readOnly?: boolean
  onSubmit: SubmitHandler<Schema>
  error?: string | undefined
}
