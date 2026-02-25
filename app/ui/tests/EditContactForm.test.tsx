// @vitest-environment jsdom

import React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { afterEach, describe, expect, test, vi } from "vitest"
import { EditContactForm } from "../EditContactForm"
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

/** Render the form for interaction tests. */
function renderForm(props: Partial<React.ComponentProps<typeof EditContactForm>> = {}) {
  const onCancel = vi.fn()
  const onSubmit = vi.fn()
  const contact = createMockContact(props.contact as Partial<ExtendedContact>)

  render(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(EditContactForm, {
        onCancel,
        onSubmit,
        contact,
        ...props,
      }),
    ),
  )

  return { onCancel, onSubmit, contact }
}

afterEach(() => {
  cleanup()
})

describe("EditContactForm", () => {
  test("renders with the correct heading", () => {
    renderForm()

    expect(screen.getByText("Edit contact")).toBeDefined()
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

  test("submit button says 'Save changes'", () => {
    renderForm()

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

    const { onSubmit } = renderForm({ contact })

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
  })

  test("does not submit when required fields are empty", () => {
    const { onSubmit } = renderForm()

    // Clear required fields
    fireEvent.change(screen.getByLabelText("First name"), { target: { value: "" } })
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "" } })

    const [form] = screen.getAllByTestId("edit-contact-form")
    fireEvent.submit(form)

    expect(onSubmit).not.toHaveBeenCalled()
  })

  test("does not submit when firstName is only whitespace", () => {
    const { onSubmit } = renderForm()

    fireEvent.change(screen.getByLabelText("First name"), { target: { value: "   " } })

    const [form] = screen.getAllByTestId("edit-contact-form")
    fireEvent.submit(form)

    expect(onSubmit).not.toHaveBeenCalled()
  })

  test("does not submit when userName is only whitespace", () => {
    const { onSubmit } = renderForm()

    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "   " } })

    const [form] = screen.getAllByTestId("edit-contact-form")
    fireEvent.submit(form)

    expect(onSubmit).not.toHaveBeenCalled()
  })

  test("cancel button calls onCancel", () => {
    const { onCancel } = renderForm()

    const cancelButton = screen.getByRole("button", { name: "Cancel" })
    fireEvent.click(cancelButton)

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  test("has a back link to members list", () => {
    renderForm()

    const backLink = screen.getByText(/Back to members/)
    expect(backLink).toBeDefined()
    expect(backLink.getAttribute("href")).toBe("/team/members")
  })
})
