// @vitest-environment jsdom

import React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"
import { EditContactDialog } from "./EditContactDialog"
import type { ExtendedContact } from "~/schema/Contact"

/** Create a mock ExtendedContact for testing. */
function createMockContact(overrides: Partial<ExtendedContact> = {}): ExtendedContact {
  return {
    id: "test-contact-id",
    firstName: "Ada",
    lastName: "Lovelace",
    userName: "ada",
    avatarUrl: "https://example.com/ada.png",
    isSelf: false,
    isAdmin: false,
    isMember: false,
    identityKey: undefined,
    identityId: undefined,
    invitation: undefined,
    invitationStatus: "NOT_INVITED",
    contact: {} as any,
    ...overrides,
  } as ExtendedContact
}

/** Render the dialog for interaction tests. */
function renderDialog(props: Partial<React.ComponentProps<typeof EditContactDialog>> = {}) {
  const onClose = vi.fn()
  const onSubmit = vi.fn()
  const contact = createMockContact(props.contact as Partial<ExtendedContact>)

  render(
    React.createElement(EditContactDialog, {
      defaultOpen: true,
      onClose,
      onSubmit,
      contact,
      ...props,
    }),
  )

  return { onClose, onSubmit, contact }
}

afterEach(() => {
  cleanup()
})

describe("EditContactDialog", () => {
  test("renders with the correct title", () => {
    renderDialog()

    expect(screen.getByText("Edit contact")).toBeDefined()
  })

  test("form is pre-filled with the contact's data", () => {
    const contact = createMockContact({
      firstName: "Grace",
      lastName: "Hopper",
      userName: "grace",
      avatarUrl: "https://example.com/grace.png",
    })

    renderDialog({ contact })

    expect(screen.getByLabelText("First name")).toHaveProperty("value", "Grace")
    expect(screen.getByLabelText("Last name")).toHaveProperty("value", "Hopper")
    expect(screen.getByLabelText("Username")).toHaveProperty("value", "grace")
    expect(screen.getByLabelText("Avatar URL")).toHaveProperty("value", "https://example.com/grace.png")
  })

  test("submit button says 'Save changes'", () => {
    renderDialog()

    expect(screen.getByRole("button", { name: "Save changes" })).toBeDefined()
  })

  test("form submission calls onSubmit with correct values including contactId", () => {
    const contact = createMockContact({
      id: "contact-123",
      firstName: "Ada",
      lastName: "Lovelace",
      userName: "ada",
      avatarUrl: "https://example.com/ada.png",
    })

    const { onClose, onSubmit } = renderDialog({ contact })

    // Update the form fields
    fireEvent.change(screen.getByLabelText("First name"), { target: { value: "  Grace  " } })
    fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "  Hopper " } })
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "  grace " } })
    fireEvent.change(screen.getByLabelText("Avatar URL"), {
      target: { value: "  https://example.com/grace.png  " },
    })

    const [form] = screen.getAllByTestId("edit-contact-form")
    fireEvent.submit(form)

    expect(onSubmit).toHaveBeenCalledWith({
      contactId: "contact-123",
      firstName: "Grace",
      lastName: "Hopper",
      userName: "grace",
      avatarUrl: "https://example.com/grace.png",
    })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test("does not submit when required fields are empty", () => {
    const { onSubmit } = renderDialog()

    // Clear required fields
    fireEvent.change(screen.getByLabelText("First name"), { target: { value: "" } })
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "" } })

    const [form] = screen.getAllByTestId("edit-contact-form")
    fireEvent.submit(form)

    expect(onSubmit).not.toHaveBeenCalled()
  })
})
