import { cx } from "~/lib/cx";
import { Keys } from "~/lib/keys";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import TextareaAutosize from "react-textarea-autosize";

const { enter, escape, up, down, left, right } = Keys;

/**
 * Used to create a new done or edit an existing one. Used by DailyDones (for creating new dones)
 * and DoneEditable (for editing existing ones).
 */
export const DoneInput = ({
  content,
  index,
  isFocused = false,
  onFocus,
  onFocusNext,
  onFocusPrev,
  onDestroy,
  onChange,
}: Props) => {
  // editing mode
  const [editing, setEditing] = useState(false);

  // the content of the done while editing
  const [newContent, setNewContent] = useState(content);

  const input = useHotkeys<HTMLTextAreaElement>(
    [enter, escape, up, down, left, right],
    (e, { keys = [] }) => {
      if (!input.current) return;
      const { value, selectionStart } = input.current;
      const [key] = keys;
      if (key === escape) {
        setNewContent(content); // restore the original content
        setEditing(false);
      } else if (key === up && selectionStart === 0) {
        onFocusPrev();
      } else if (key === down && selectionStart === value.length) {
        onFocusNext();
      } else if (key === enter) {
        e.preventDefault();
        setEditing(false);
        onFocusNext();
      }
    },
    { enableOnFormTags: true }
  );

  // handle entering and exiting edit mode
  useEffect(() => {
    if (!editing) input.current?.blur(); // blur when leaving editing mode
  }, [editing, input]);

  // update the input when the content of the done is modified from elsewhere
  useEffect(() => {
    setNewContent(content);
  }, [content, input]);

  // focus the input when isFocused is true
  useEffect(() => {
    if (isFocused) input.current?.focus();
  }, [isFocused, input]);

  return (
    <TextareaAutosize
      ref={input}
      className={cx(
        "done-entry h-auto grow focus:outline-none" //
      )}
      value={newContent}
      onFocus={() => {
        onFocus(index);
        setEditing(true);
      }}
      onBlur={(e) => {
        const newContent = e.target.value.trim();

        // if user has removed all the content of the done, delete it
        if (newContent.length === 0) onDestroy();
        // otherwise, update the content
        else onChange(newContent);

        setEditing(false);
      }}
      onChange={(e) => setNewContent(e.target.value)}
    />
  );
};

export type Props = {
  content: string;
  index: number;
  isFocused?: boolean;
  onFocus: (index: number) => void;
  onFocusNext: () => void;
  onFocusPrev: () => void;
  onDestroy: () => void;
  onChange: (content: string) => void;
};
