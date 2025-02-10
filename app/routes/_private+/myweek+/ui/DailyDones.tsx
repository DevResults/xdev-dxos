import { type LocalDate } from "@js-joda/core";
import { cx } from "~/lib/cx";
import { useState } from "react";
import { DoneEditable } from "./DoneEditable";
import { DoneInput } from "./DoneInput";

/** Displays a single day of the current user's dones */
export const DailyDones = ({ date, doneEntries, self }: Props) => {
  const [focus, setFocus] = useState<number>(-1); // nothing focused by default

  const dones: any[] = [];

  const focusNext = () => setFocus((f: number) => Math.min(f + 1, dones.length + 1));
  const focusPrev = () => setFocus((f: number) => Math.max(f - 1, 0));

  return (
    <>
      <ul className="flex h-full flex-col gap-1 p-2">
        {/* existing dones */}
        {dones.map((done, index) => (
          <li key={done.id}>
            <DoneEditable
              done={done}
              index={index}
              onUpdate={(content) => doneEntries.update({ id: done.id, content })}
              onDestroy={() => doneEntries.destroy(done.id)}
              isFocused={focus === index}
              onFocus={setFocus}
              onFocusNext={focusNext}
              onFocusPrev={focusPrev}
              self={self}
            />
          </li>
        ))}
        {/* new done */}
        <li
          className={cx(
            "flex grow flex-col rounded-md border p-2",
            "focus-within:border-2 focus-within:border-primary-600"
          )}
        >
          <DoneInput
            key={dones.length} // this way we get a new instance after adding a done
            content=""
            isFocused={focus === dones.length}
            index={dones.length}
            onFocus={setFocus}
            onFocusNext={focusNext}
            onFocusPrev={focusPrev}
            onDestroy={() => {}}
            onChange={(content) => {
              // doneEntries.add(new DoneEntry({ date, contactId: self.id, content }))
              setFocus(dones.length + 1);
            }}
          />
        </li>
      </ul>
    </>
  );
};

type Props = {
  date: LocalDate;
  doneEntries: any;
  self: any;
};
