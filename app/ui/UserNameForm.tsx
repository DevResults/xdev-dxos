import { effectTsResolver } from "@hookform/resolvers/effect-ts"
import { Button } from "@ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/form"
import { Input } from "@ui/input"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Munge } from "./Munge"
import { S } from "~/schema/lib/Effect"

export const UserNameForm = ({ userName = "", onSubmit }: Props) => {
  const form = useForm<Schema>({
    resolver: effectTsResolver(schema),
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

const schema = S.Struct({
  // `n` because if we call it `userName`, 1password picks it up
  n: S.String.pipe(S.minLength(2, { message: () => "Name must be at least 2 characters." })),
})
type Schema = S.Schema.Type<typeof schema>

type Props = {
  userName: string | undefined
  onSubmit: SubmitHandler<Schema>
}
