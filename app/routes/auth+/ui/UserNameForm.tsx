import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/form"
import { Input } from "@ui/input"
import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { Munge } from "./Munge"

export const UserNameForm = ({ userName = "", onSubmit }: Props) => {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { n: userName },
  })

  return (
    <Card className="w-[20em]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Welcome to XDev</CardTitle>
            <CardDescription>
              Enter your <Munge>name</Munge> to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="n"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">
                    <Munge>Name</Munge>
                  </FormLabel>
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
  // `n` because if we call it `userName`, 1password picks it up
  n: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
})
type Schema = z.infer<typeof schema>

type Props = {
  userName: string | undefined
  onSubmit: SubmitHandler<Schema>
}
