# Replace avatar URL with image upload

## Context

The contact form currently has a plain text input for "Avatar URL". We want to replace it with a
drag-and-drop image upload (adapted from the [blocks.so file-upload-01](https://blocks.so/file-upload/file-upload-01)
component). The uploaded image will be stored as a base64 data URL in the existing `avatarUrl` string
field — no schema changes needed, and the Avatar component already works with data URLs via `<img src={...}>`.

## Plan

### 1. Create `resizeImage` utility (`app/lib/resizeImage.ts`)

Pure function: takes a `File`, returns a `Promise<string>` (base64 data URL). Resizes to fit within
max 256x256 using an offscreen canvas, outputs JPEG (quality ~0.8).

### 2. Create `ImageUpload` component (`app/ui/ImageUpload.tsx`)

Adapted from blocks.so file-upload-01 dropzone pattern:

- Drag-and-drop zone with dashed border, upload icon, "click to browse" link
- On file select: resize with `resizeImage`, call `onChange` callback with data URL
- Shows image preview when a value exists (using the current avatar or newly uploaded image)
- "Remove" button to clear the avatar
- Single-image only (not multi-file)
- Integrate with react-hook-form using `FormField`/`FormItem`/`FormLabel` (same pattern as TextInput)

### 3. Update `ContactForm.tsx`

- Replace `<TextInput name="avatarUrl" ...>` with `<ImageUpload>`
- Wire to the same `saveOnBlur` / form field pattern

### Files to modify/create

| File                     | Action                                |
| ------------------------ | ------------------------------------- |
| `app/lib/resizeImage.ts` | Create                                |
| `app/ui/ImageUpload.tsx` | Create                                |
| `app/ui/ContactForm.tsx` | Edit (swap TextInput for ImageUpload) |

## Verification

- Dev server: upload an image on the edit contact page, confirm it displays in the avatar preview and persists on reload
- Confirm existing URL-based avatars still display correctly in the Avatar component
- Run `pnpm test` and `pnpm build`
