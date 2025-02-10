import { cx } from "~/lib/cx";
import { Keys } from "~/lib/keys";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

const { enter, up, down } = Keys;

export const AutocompleteMenu = ({ items, onSelect, id }: Props) => {
  if (items.length === 0) return null;

  const [selectedIndex, setSelectedIndex] = useState(0);

  useHotkeys(
    [enter, up, down],
    (e, { keys = [] }) => {
      e.preventDefault(); // Prevent form submission
      e.stopImmediatePropagation();
      const key = keys.join("");
      if (key === enter) onSelect(items[selectedIndex]);
      if (key === up) setSelectedIndex((i) => Math.max(i - 1, 0));
      if (key === down) setSelectedIndex((i) => Math.min(i + 1, items.length - 1));
    },
    { enableOnFormTags: true }
  );

  return (
    <div
      role="listbox"
      id={id}
      aria-label={`Suggestions`}
    >
      {items.map((item, index) => (
        <div
          key={item}
          role="option"
          aria-selected={index === selectedIndex}
          className={cx("cursor-pointer rounded px-2 py-1", index === selectedIndex && "bg-primary-100")}
          onMouseDown={(e) => {
            e.preventDefault(); // Prevent textarea blur
            onSelect(item);
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

type Props = {
  id: string;
  items: string[];
  onSelect: (selection: string) => void;
};

// HELPERS

/**
 * Finds an autocomplete query substring given the text in an input and the current cursor
 * position within the input.
 **/
export const findAutocompleteQuery = (
  /** The full text contents of the input */
  text: string,
  /** The position of the cursor within the input */
  position: number,
  /** The trigger definitions */
  triggers: AutocompleteTrigger[]
): AutocompleteState | undefined => {
  // Find start of current word
  let start = position;
  while (start > 0 && !/\s/.test(text[start - 1])) start--;

  // Find end of current word
  let end = position;
  while (end < text.length && !/\s/.test(text[end])) end++;

  // Extract word at cursor
  const word = text.slice(start, end);

  for (const { type, trigger } of triggers)
    if (word.startsWith(trigger)) {
      const query = word.slice(1); // remove the trigger character at the beginning
      return { type, trigger, start, end, query };
    }
};

/**
 * Given a query and a set of autocomplete definitions, returns an array of strings to show in an
 * autocomplete menu.
 */
export const getAutocompleteItems = <Name, Item>(
  { query, trigger }: AutocompleteState,
  autocompleteModes: Array<AutocompleteMode<Name, Item>>
) => {
  const mode = autocompleteModes.find((m) => m.trigger === trigger);
  if (!mode) return [];

  const { collection, property } = mode;

  return collection
    .all()
    .map((item) => String(item[property]))
    .filter((value) => value.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      // list matches that start with the query first, otherwise sort alphabetically
      const aStartsWith = a.toLowerCase().startsWith(query.toLowerCase());
      const bStartsWith = b.toLowerCase().startsWith(query.toLowerCase());
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return a.localeCompare(b);
    });
};

export type AutocompleteTrigger = {
  type: string;
  trigger: string;
};

export type AutocompleteMode<Name = any, Item = any, C = any> = AutocompleteTrigger & {
  property: any;
  collection: C;
};

export type AutocompleteState = AutocompleteTrigger & {
  start: number;
  end: number;
  query: string;
};
