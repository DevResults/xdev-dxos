// @vitest-environment jsdom

import React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"
import { AddContactDialog } from "../AddContactDialog"

/** Render the dialog for interaction tests. */
function renderDialog(props: Partial<React.ComponentProps<typeof AddContactDialog>> = {}) {
  const onClose = vi.fn()
  const onSubmit = vi.fn()

  render(
    React.createElement(AddContactDialog, {
      defaultOpen: true,
      onClose,
      onSubmit,
      ...props,
    }),
  )

  return { onClose, onSubmit }
}

afterEach(() => {
  cleanup()
})

describe("AddContactDialog", () => {
  test("renders first name, last name, username, and avatar URL fields", () => {
    renderDialog()

    expect(screen.getByLabelText("First name")).toBeDefined()
    expect(screen.getByLabelText("Last name")).toBeDefined()
    expect(screen.getByLabelText("Username")).toBeDefined()
    expect(screen.getByLabelText("Avatar URL")).toBeDefined()
  })

  test("submits trimmed values when required fields are present", async () => {
    const { onClose, onSubmit } = renderDialog()

    fireEvent.change(screen.getByLabelText("First name"), { target: { value: "  Ada  " } })
    fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "  Lovelace " } })
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "  ada " } })
    fireEvent.change(screen.getByLabelText("Avatar URL"), {
      target: { value: "  https://example.com/ada.png  " },
    })

    const [form] = screen.getAllByTestId("add-contact-form")
    fireEvent.submit(form)

    expect(onSubmit).toHaveBeenCalledWith({
      firstName: "Ada",
      lastName: "Lovelace",
      userName: "ada",
      avatarUrl: "https://example.com/ada.png",
    })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test("does not submit when required fields are missing", () => {
    const { onSubmit } = renderDialog()

    const [form] = screen.getAllByTestId("add-contact-form")
    fireEvent.submit(form)

    expect(onSubmit).not.toHaveBeenCalled()
  })
})
