---
Task ID: 1
Agent: main (Z.ai Code)
Task: Add thumbnail upload feature to the Post Kaam form on Hunar.pk so users can upload a main image that represents their kaam (work) — the image people see on the kaam card, detail modal, and admin list. (Also confirmed the previously-completed admin password gate + state-backed workers are intact.)

Work Log:
- Read full `src/app/page.tsx` (2700+ lines) to understand existing structure: Kaam interface, post form, KaamCard, KaamDetailModal, admin panel.
- Added optional `thumbnail?: string` field to the `Kaam` interface (base64 data URL).
- Added `postThumbnail` state (`string | null`) next to existing `postSamples` state.
- Added `handleThumbnailUpload` callback (FileReader → base64, validates image type + 2MB max, shows toast on success/error).
- Added `removeThumbnail` callback (clears state + info toast).
- Added a new "Thumbnail Image" section in the Post Kaam form, ABOVE the existing "Sample Images" section. When no thumbnail: dashed-border upload dropzone. When thumbnail present: live card-style preview (16/10 aspect, category badge, remove button) + "Replace thumbnail" option. Includes helper text: "This is how your kaam will look to people browsing Hunar.pk."
- Wired `thumbnail: postThumbnail ?? undefined` into the `newKaam` object in `handlePostKaam`, added `postThumbnail` to the dependency array, and reset `setPostThumbnail(null)` after submit.
- Updated `KaamCard` component: renders `<img src={kaam.thumbnail}>` with hover zoom when present, falls back to `GradientImage` otherwise.
- Updated `KaamDetailModal` header: renders the thumbnail as a full-width cover image when present, falls back to gradient.
- Updated admin "Kaam Posts" management list: shows the thumbnail image (10x10) when present, falls back to category icon.
- Switched all three file inputs (thumbnail upload, replace thumbnail, samples upload) from Tailwind `hidden` to `sr-only` — keeps them visually hidden AND accessible AND interactable for browser automation/testing.
- Ran `bun run lint` → clean, no errors.
- Verified dev server compiled without errors.

Browser Verification (Agent Browser + VLM):
- Logged in as existing worker "Sara Khan" (persisted from previous session).
- Navigated to Post Kaam, filled title/category/price/description.
- Generated a test PNG (green with "HUNAR" text) via Python PIL.
- Uploaded the test PNG to the thumbnail input → live preview appeared on the form with "Remove thumbnail" + "Replace thumbnail" controls.
- Submitted the form → landed on Explore page with the new kaam card showing the uploaded thumbnail (NOT the gradient placeholder). VLM confirmed: "its main image is a green thumbnail showing 'HUNAR' text (an actual uploaded photo)" while other cards show gradient placeholders.
- Opened the kaam detail modal → header image is the uploaded thumbnail. VLM confirmed.
- Tested admin password gate: wrong password → "Incorrect password. Access denied." (blocked); correct password "BA56CR7VK18" → admin panel unlocked.
- In admin "Kaam Posts" tab → the thumbnail test kaam row shows a small real photo thumbnail; other rows show generic category icons. VLM confirmed.
- No browser console errors, no dev server errors, lint clean.

Stage Summary:
- Thumbnail upload feature is fully functional end-to-end: form upload → live preview → kaam card → detail modal → admin list, with graceful gradient fallback for kaams without a thumbnail.
- Admin password gate (password "BA56CR7VK18") and state-backed workers (with cascade delete) from the previous iteration remain intact and verified working.
- All file inputs now use `sr-only` instead of `hidden` for better accessibility and testability.
- Artifacts produced: modified `src/app/page.tsx` only.
