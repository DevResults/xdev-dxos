// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import React from "react"
import { MemoryRouter } from "react-router"
import { afterEach, describe, expect, test, vi } from "vitest"
import { ContactForm, type ContactFormValues } from "../ContactForm"

const DEFAULT_VALUES: ContactFormValues = {
  firstName: "Ada",
  lastName: "Lovelace",
  userName: "ada",
  avatarUrl: "https://example.com/ada.png",
}

const EMPTY_VALUES: ContactFormValues = {
  firstName: "",
  lastName: "",
  userName: "",
  avatarUrl: "",
}

/** Render the ContactForm for interaction tests. */
function renderForm(props: Partial<React.ComponentProps<typeof ContactForm>> = {}) {
  const onSaveField = vi.fn().mockResolvedValue(undefined)
  const onDone = vi.fn()
  const onCancel = vi.fn()

  render(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(ContactForm, {
        defaultValues: DEFAULT_VALUES,
        onSaveField,
        onDone,
        title: "Edit contact",
        description: "Update the contact's information.",
        ...props,
        onCancel: "onCancel" in props ? props.onCancel : onCancel,
      }),
    ),
  )

  return { onSaveField, onDone, onCancel }
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

  test("form is pre-filled with default values", () => {
    renderForm({
      defaultValues: {
        firstName: "Grace",
        lastName: "Hopper",
        userName: "grace",
        avatarUrl: "https://example.com/grace.png",
      },
    })

    expect(screen.getByLabelText("First name")).toHaveProperty("value", "Grace")
    expect(screen.getByLabelText("Last name")).toHaveProperty("value", "Hopper")
    expect(screen.getByLabelText("Username")).toHaveProperty("value", "grace")
    expect(screen.getByAltText("Avatar preview")).toHaveProperty(
      "src",
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
    const { onSaveField } = renderForm({ defaultValues: EMPTY_VALUES })

    const firstNameInput = screen.getByLabelText("First name")
    fireEvent.change(firstNameInput, { target: { value: "" } })
    fireEvent.blur(firstNameInput)

    await waitFor(() => {
      expect(screen.getByText("First name is required.")).toBeDefined()
    })

    expect(onSaveField).not.toHaveBeenCalledWith("firstName", expect.anything())
  })

  test("Done validates all fields before calling onDone", async () => {
    const { onDone } = renderForm({ defaultValues: EMPTY_VALUES })

    const doneButton = screen.getByRole("button", { name: "Done" })
    fireEvent.click(doneButton)

    await waitFor(() => {
      expect(screen.getByText("First name is required.")).toBeDefined()
      expect(screen.getByText("Username is required.")).toBeDefined()
    })

    expect(onDone).not.toHaveBeenCalled()
  })

  test("Done calls onDone with form values when all fields are valid", async () => {
    const { onDone } = renderForm()

    const doneButton = screen.getByRole("button", { name: "Done" })
    fireEvent.click(doneButton)

    await waitFor(() => {
      expect(onDone).toHaveBeenCalledTimes(1)
      expect(onDone).toHaveBeenCalledWith(DEFAULT_VALUES)
    })
  })

  test("cancel button calls onCancel", () => {
    const onCancel = vi.fn()
    renderForm({ onCancel })

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
