import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/form"
import { Input } from "@ui/input"
import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"

export const TeamNameForm = ({ teamName = "", onSubmit }: Props) => {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { teamName },
  })

  return (
    <Card className="w-[20em]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Create a team</CardTitle>
            <CardDescription>Enter a name for your team.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Team name</FormLabel>
                  <FormControl>
                    <Input autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" intent="primary" size="md" className="grow justify-center">
              Continue
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

const schema = z.object({
  teamName: z.string().min(2, {
    message: "Team name must be at least 2 characters.",
  }),
})
type Schema = z.infer<typeof schema>

type Props = {
  teamName?: string
  onSubmit: SubmitHandler<Schema>
}
