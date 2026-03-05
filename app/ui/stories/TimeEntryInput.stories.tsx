import { LocalDate } from "@js-joda/core"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fn, userEvent, waitFor, within } from "@storybook/test"
import { clients } from "data/clients"
import { contacts } from "data/contacts"
import { projects } from "data/projects"
import { TimeEntryInput } from "../TimeEntryInput"

const herb = contacts.find(c => c.id === "herb")!
const date = LocalDate.parse("2024-11-07")

/**
 * Set the textarea value and commit via blur. Pastes value in one shot to avoid
 * character-by-character autocomplete interference, then adds a trailing space to dismiss
 * any open autocomplete before blurring.
 */
const fillAndBlur = async (input: HTMLElement, value: string) => {
  await userEvent.click(input)
  await userEvent.clear(input)
  await userEvent.paste(value)
  // Type a space to dismiss autocomplete (query ends at space boundary)
  await userEvent.type(input, " ")
  await new Promise(r => setTimeout(r, 50))
  input.blur()
  await new Promise(r => setTimeout(r, 50))
}

/** Find the error popover text (rendered via portal, so outside canvasElement). */
const getErrorText = (input: HTMLElement) => {
  const errorId = input.getAttribute("aria-errormessage")!
  const errorEl = document.getElementById(errorId)!
  return errorEl.textContent ?? ""
}

const meta: Meta<typeof TimeEntryInput> = {
  title: "Hours/TimeEntryInput",
  component: TimeEntryInput,
  args: {
    content: "",
    index: 0,
    self: herb,
    date,
    projects,
    clients,
    isFocused: true,
    onCommit: fn(),
    onDestroy: fn(),
    onDiscard: fn(),
    onFocus: fn(),
    onFocusNext: fn(),
    onFocusPrev: fn(),
  },
  decorators: [
    Story => (
      <div className="w-80 p-4">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}

export const WithContent: Story = {
  args: { content: "1h #out doctor appointment" },
}

/** Typing a valid entry and pressing Enter calls onCommit. */
export const CommitsValidEntry: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, "90min #out")
    await waitFor(() => {
      expect(args.onCommit).toHaveBeenCalledWith(
        expect.objectContaining({ duration: 90, project: "out-" }),
      )
    })
  },
}

/** Entry with no duration shows an error. */
export const RejectsNoDuration: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, "#out")
    await waitFor(() => {
      expect(input).toHaveAttribute("aria-invalid", "true")
    })
    expect(args.onCommit).not.toHaveBeenCalled()
    expect(getErrorText(input)).toContain("No duration found")
  },
}

/** Entry with multiple durations shows an error. */
export const RejectsMultipleDurations: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, "1h 2h #out")
    await waitFor(() => {
      expect(input).toHaveAttribute("aria-invalid", "true")
    })
    expect(args.onCommit).not.toHaveBeenCalled()
    expect(getErrorText(input)).toContain("More than one duration was found")
  },
}

/** Entry without a project code shows an error. */
export const RejectsNoProject: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, "1h")
    await waitFor(() => {
      expect(input).toHaveAttribute("aria-invalid", "true")
    })
    expect(args.onCommit).not.toHaveBeenCalled()
    expect(getErrorText(input)).toContain("project code")
  },
}

/** Entry with multiple project codes shows an error. */
export const RejectsMultipleProjects: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, "1h #out #overhead")
    await waitFor(() => {
      expect(input).toHaveAttribute("aria-invalid", "true")
    })
    expect(args.onCommit).not.toHaveBeenCalled()
    expect(getErrorText(input)).toContain("one project code")
  },
}

/** Entry with an unknown project code shows an error. */
export const RejectsUnknownProject: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, "1h #nonexistent")
    await waitFor(() => {
      expect(input).toHaveAttribute("aria-invalid", "true")
    })
    expect(args.onCommit).not.toHaveBeenCalled()
    expect(getErrorText(input)).toContain("nonexistent")
  },
}

/** Entry with multiple client codes shows an error. */
export const RejectsMultipleClients: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, "1h #out @chemonics @aba")
    await waitFor(() => {
      expect(input).toHaveAttribute("aria-invalid", "true")
    })
    expect(args.onCommit).not.toHaveBeenCalled()
    expect(getErrorText(input)).toContain("one @client code")
  },
}

/** Entry with an unknown client code shows an error. */
export const RejectsUnknownClient: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, "1h #out @unknownclient")
    await waitFor(() => {
      expect(input).toHaveAttribute("aria-invalid", "true")
    })
    expect(args.onCommit).not.toHaveBeenCalled()
    expect(getErrorText(input)).toContain("Client code not found")
  },
}

/** Project requiring a client without one provided shows an error. */
export const RejectsClientRequired: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, "1h #Business:Contracts")
    await waitFor(() => {
      expect(input).toHaveAttribute("aria-invalid", "true")
    })
    expect(args.onCommit).not.toHaveBeenCalled()
    expect(getErrorText(input)).toContain("client")
  },
}

/** Project requiring a client accepts entry when client is provided. */
export const AcceptsClientRequired: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, "1h #Business:Contracts @chemonics")
    await waitFor(() => {
      expect(args.onCommit).toHaveBeenCalledWith(
        expect.objectContaining({ duration: 60, project: "business-contracts" }),
      )
    })
  },
}

/** Correcting a mistake after an error allows submission. */
export const AcceptsAfterCorrection: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")

    // First, enter invalid content
    await fillAndBlur(input, "#out")
    await waitFor(() => {
      expect(input).toHaveAttribute("aria-invalid", "true")
    })
    expect(args.onCommit).not.toHaveBeenCalled()

    // Correct the mistake
    await fillAndBlur(input, "#out 1h")
    await waitFor(() => {
      expect(args.onCommit).toHaveBeenCalled()
    })
  },
}

// Duration format tests

/** Parses HH:MM duration format. */
export const ParsesHHMM: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, "1:30 #out")
    await waitFor(() => {
      expect(args.onCommit).toHaveBeenCalledWith(expect.objectContaining({ duration: 90 }))
    })
  },
}

/** Parses :MM (minutes only) format. */
export const ParsesMinutesOnly: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, ":45 #out")
    await waitFor(() => {
      expect(args.onCommit).toHaveBeenCalledWith(expect.objectContaining({ duration: 45 }))
    })
  },
}

/** Parses decimal hours. */
export const ParsesDecimalHours: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, "1.5 #out")
    await waitFor(() => {
      expect(args.onCommit).toHaveBeenCalledWith(expect.objectContaining({ duration: 90 }))
    })
  },
}

/** Parses decimal hours with leading dot. */
export const ParsesLeadingDot: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, ".25 #out")
    await waitFor(() => {
      expect(args.onCommit).toHaveBeenCalledWith(expect.objectContaining({ duration: 15 }))
    })
  },
}

/** Parses hour abbreviation format. */
export const ParsesHourAbbreviation: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, "2hr #out")
    await waitFor(() => {
      expect(args.onCommit).toHaveBeenCalledWith(expect.objectContaining({ duration: 120 }))
    })
  },
}

/** Parses minute abbreviation format. */
export const ParsesMinuteAbbreviation: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, "45min #out")
    await waitFor(() => {
      expect(args.onCommit).toHaveBeenCalledWith(expect.objectContaining({ duration: 45 }))
    })
  },
}

/** Parses combined hour and minute format. */
export const ParsesCombined: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, "1h30m #out")
    await waitFor(() => {
      expect(args.onCommit).toHaveBeenCalledWith(expect.objectContaining({ duration: 90 }))
    })
  },
}

/** Parses duration case-insensitively. */
export const ParsesCaseInsensitive: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, "1HR30MIN #out")
    await waitFor(() => {
      expect(args.onCommit).toHaveBeenCalledWith(expect.objectContaining({ duration: 90 }))
    })
  },
}

// Project code tests

/** Parses project code with subcode. */
export const ParsesSubcode: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, "1h #Feature:API")
    await waitFor(() => {
      expect(args.onCommit).toHaveBeenCalledWith(
        expect.objectContaining({ project: "feature-api" }),
      )
    })
  },
}

/** Parses project code case-insensitively. */
export const ParsesProjectCaseInsensitive: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, "1h #OUT")
    await waitFor(() => {
      expect(args.onCommit).toHaveBeenCalledWith(expect.objectContaining({ project: "out-" }))
    })
  },
}

/** Parses project code with spaces in subcode using dash. */
export const ParsesDashSubcode: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, "1h #Feature:Project-X")
    await waitFor(() => {
      expect(args.onCommit).toHaveBeenCalledWith(
        expect.objectContaining({ project: "feature-project-x" }),
      )
    })
  },
}

// Description tests

/** Captures description text. */
export const CapturesDescription: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, "1h #out doctor appointment")
    await waitFor(() => {
      expect(args.onCommit).toHaveBeenCalledWith(
        expect.objectContaining({ description: "doctor appointment" }),
      )
    })
  },
}

/** Captures description with client and project. */
export const CapturesDescriptionWithClient: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, "1h #Support:Ongoing @chemonics fixing login issue")
    await waitFor(() => {
      expect(args.onCommit).toHaveBeenCalledWith(
        expect.objectContaining({ description: "fixing login issue" }),
      )
    })
  },
}

/** Pressing Escape restores original content and calls onDiscard. */
export const EscapeDiscardsEdit: Story = {
  args: { content: "1h #out original" },
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await userEvent.type(input, "2h #overhead replacement")
    await userEvent.keyboard("{Escape}")
    await waitFor(() => {
      expect(args.onDiscard).toHaveBeenCalled()
    })
  },
}

/** Clearing content and pressing Enter calls onDestroy. */
export const ClearingDestroysEntry: Story = {
  args: { content: "1h #out" },
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await userEvent.clear(input)
    await userEvent.keyboard("{Enter}")
    await waitFor(() => {
      expect(args.onDestroy).toHaveBeenCalled()
    })
  },
}

// Autocomplete tests

/** Typing # followed by partial text opens autocomplete. */
export const AutocompleteProject: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("combobox")
    expect(input).toHaveAttribute("aria-expanded", "false")
    await userEvent.type(input, "1h #bus")
    await waitFor(() => {
      expect(input).toHaveAttribute("aria-expanded", "true")
    })
    const autocompleteId = input.getAttribute("aria-controls")!
    const menu = document.getElementById(autocompleteId)!
    const options = menu.querySelectorAll("[role=option]")
    const optionTexts = Array.from(options).map(o => o.textContent)
    expect(optionTexts).toEqual([
      "Business:CivResults",
      "Business:Contracts",
      "Business:Marketing",
      "Business:Outreach",
      "Business:Proposals",
    ])
  },
}

/** Typing @ followed by partial text opens client autocomplete. */
export const AutocompleteClient: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("combobox")
    await userEvent.type(input, "1h @chem")
    await waitFor(() => {
      expect(input).toHaveAttribute("aria-expanded", "true")
    })
  },
}

/** Blurring a valid entry commits it. */
export const CommitsOnBlur: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox")
    await fillAndBlur(input, "90min #out")
    await waitFor(() => {
      expect(args.onCommit).toHaveBeenCalledWith(
        expect.objectContaining({ duration: 90, project: "out-" }),
      )
    })
  },
}
