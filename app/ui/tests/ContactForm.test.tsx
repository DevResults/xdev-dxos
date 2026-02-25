// @vitest-environment jsdom

import React from "react"
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { afterEach, describe, expect, test, vi } from "vitest"
import { ContactForm } from "../ContactForm"
import type { Contact, ExtendedContact } from "~/schema/Contact"

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
    member: undefined,
    selfIdentity: undefined,
    identity: undefined,
    identityId: undefined,
    invitation: undefined,
    invitationStatus: "NOT_INVITED",
    contact: {} as unknown as Contact,
    ...overrides,
  } as ExtendedContact
}

/** Render the ContactForm for interaction tests. */
function renderForm(props: Partial<React.ComponentProps<typeof ContactForm>> = {}) {
  const onSaveField = vi.fn().mockResolvedValue(undefined)
  const onDone = vi.fn()
  const onCancel = vi.fn()
  const contact = props.contact ?? createMockContact()

  render(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(ContactForm, {
        contact,
        onSaveField,
        onDone,
        title: "Edit contact",
        description: "Update the contact's information.",
        ...props,
        onCancel: "onCancel" in props ? props.onCancel : onCancel,
      }),
    ),
  )

  return { onSaveField, onDone, onCancel, contact }
}

afterEach(() => {
  cleanup()
})

describe("ContactForm", () => {
  test("renders with the correct heading", () => {
    renderForm()
    expect(screen.getByText("Edit contact")).toBeDefined()
  })

  test("renders custom title and description", () => {
    renderForm({ title: "Add contact", description: "Enter details." })
    expect(screen.getByText("Add contact")).toBeDefined()
    expect(screen.getByText("Enter details.")).toBeDefined()
  })

  test("form is pre-filled with the contact's data", () => {
    const contact = createMockContact({
      firstName: "Grace",
      lastName: "Hopper",
      userName: "grace",
      avatarUrl: "https://example.com/grace.png",
    })

    renderForm({ contact })

    expect(screen.getByLabelText("First name")).toHaveProperty("value", "Grace")
    expect(screen.getByLabelText("Last name")).toHaveProperty("value", "Hopper")
    expect(screen.getByLabelText("Username")).toHaveProperty("value", "grace")
    expect(screen.getByLabelText("Avatar URL")).toHaveProperty(
      "value",
      "https://example.com/grace.png",
    )
  })

  test("Done button is shown", () => {
    renderForm()
    expect(screen.getByRole("button", { name: "Done" })).toBeDefined()
  })

  test("Cancel button shown when onCancel provided", () => {
    renderForm({ onCancel: vi.fn() })
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDefined()
  })

  test("Cancel button not shown when onCancel is undefined", () => {
    renderForm({ onCancel: undefined })
    expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull()
  })

  test("has a back link to members list", () => {
    renderForm()
    const backLink = screen.getByText(/Back to members/)
    expect(backLink).toBeDefined()
    expect(backLink.getAttribute("href")).toBe("/team/members")
  })

  test("blur on valid field calls onSaveField", async () => {
    const { onSaveField } = renderForm()

    const lastNameInput = screen.getByLabelText("Last name")
    fireEvent.change(lastNameInput, { target: { value: "Babbage" } })
    fireEvent.blur(lastNameInput)

    await waitFor(() => {
      expect(onSaveField).toHaveBeenCalledWith("lastName", "Babbage")
    })
  })

  test("blur on invalid required field does not call onSaveField", async () => {
    const contact = createMockContact({ firstName: "" })
    const { onSaveField } = renderForm({ contact })

    const firstNameInput = screen.getByLabelText("First name")
    fireEvent.change(firstNameInput, { target: { value: "" } })
    fireEvent.blur(firstNameInput)

    // Wait a tick to ensure async validation settles
    await waitFor(() => {
      expect(screen.getByText("First name is required.")).toBeDefined()
    })

    expect(onSaveField).not.toHaveBeenCalledWith("firstName", expect.anything())
  })

  test("Done validates all fields before calling onDone", async () => {
    const contact = createMockContact({ firstName: "", userName: "" })
    const { onDone } = renderForm({ contact })

    // Clear the required fields
    fireEvent.change(screen.getByLabelText("First name"), { target: { value: "" } })
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "" } })

    const doneButton = screen.getByRole("button", { name: "Done" })
    fireEvent.click(doneButton)

    await waitFor(() => {
      expect(screen.getByText("First name is required.")).toBeDefined()
      expect(screen.getByText("Username is required.")).toBeDefined()
    })

    expect(onDone).not.toHaveBeenCalled()
  })

  test("Done calls onDone when all fields are valid", async () => {
    const { onDone } = renderForm()

    const doneButton = screen.getByRole("button", { name: "Done" })
    fireEvent.click(doneButton)

    await waitFor(() => {
      expect(onDone).toHaveBeenCalledTimes(1)
    })
  })

  test("cancel button calls onCancel", () => {
    const onCancel = vi.fn()
    renderForm({ onCancel })

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
