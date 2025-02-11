import { createId } from "@paralleldrive/cuid2";
import { pipe, S, type Types } from "~/schema/lib/Effect";

export const withDefault =
  <T extends S.Schema.All>(defaultValue: () => Types.NoInfer<T["Type"]>) =>
  (self: T) =>
    pipe(self, S.propertySignature, S.withConstructorDefault(defaultValue));

export const withDefaultId = <T extends S.Schema.All>(self: T) =>
  pipe(
    self,
    withDefault(() => createId() as Types.NoInfer<T["Type"]>) // eslint-disable-line @typescript-eslint/no-unsafe-return
  );
