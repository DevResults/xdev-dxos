import { useCallback, useRef } from "react"

/**
 * Keyboard navigation hook for spreadsheet-like grids.
 * Uses `data-row` and `data-col` attributes on focusable elements for DOM-based focus management.
 */
export const useGridNavigation = ({ rowCount, colCount, onAddRow }: Options) => {
  const containerRef = useRef<HTMLDivElement>(null)

  /** Focus the cell at the given row/col coordinates. */
  const focusCell = useCallback((row: number, col: number) => {
    const el = containerRef.current?.querySelector<HTMLElement>(
      `[data-row="${row}"][data-col="${col}"]`,
    )
    if (el) {
      el.focus()
      // Select all text if it's an input
      if (el instanceof HTMLInputElement) {
        el.select()
      }
    }
  }, [])

  /** Handle keyboard events on grid cells. */
  const handleCellKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      const target = e.currentTarget
      const row = Number(target.dataset.row)
      const col = Number(target.dataset.col)
      if (Number.isNaN(row) || Number.isNaN(col)) return

      switch (e.key) {
        case "Tab": {
          e.preventDefault()
          if (e.shiftKey) {
            // Move backward
            if (col > 0) {
              focusCell(row, col - 1)
            } else if (row > 0) {
              focusCell(row - 1, colCount - 1)
            }
          } else {
            // Move forward
            if (col < colCount - 1) {
              focusCell(row, col + 1)
            } else if (row < rowCount - 1) {
              focusCell(row + 1, 0)
            }
          }
          break
        }

        case "Enter": {
          e.preventDefault()
          if (row < rowCount - 1) {
            focusCell(row + 1, col)
          } else {
            onAddRow?.()
            // Focus the new row after it renders
            requestAnimationFrame(() => focusCell(row + 1, col))
          }
          break
        }

        case "Escape": {
          e.preventDefault()
          target.blur()
          break
        }

        case "ArrowUp": {
          if (target instanceof HTMLInputElement && target.selectionStart === 0) {
            e.preventDefault()
            if (row > 0) focusCell(row - 1, col)
          }
          break
        }

        case "ArrowDown": {
          if (target instanceof HTMLInputElement && target.selectionStart === target.value.length) {
            e.preventDefault()
            if (row < rowCount - 1) focusCell(row + 1, col)
          }
          break
        }

        case "ArrowLeft": {
          if (target instanceof HTMLInputElement && target.selectionStart === 0) {
            e.preventDefault()
            if (col > 0) focusCell(row, col - 1)
          }
          break
        }

        case "ArrowRight": {
          if (target instanceof HTMLInputElement && target.selectionStart === target.value.length) {
            e.preventDefault()
            if (col < colCount - 1) focusCell(row, col + 1)
          }
          break
        }
      }
    },
    [rowCount, colCount, focusCell, onAddRow],
  )

  return { containerRef, handleCellKeyDown }
}

type Options = {
  /** Total number of data rows. */
  rowCount: number
  /** Number of navigable columns (excluding the delete button column). */
  colCount: number
  /** Called when Enter is pressed on the last row. */
  onAddRow?: () => void
}
