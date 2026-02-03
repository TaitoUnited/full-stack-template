---
name: layout-iteration
description: Iterates on layout until the app screen in the browser matches the user's Figma screenshot. Use at Step 3 of the frontend feature flow after layout implementation.
disable-model-invocation: false
---

# Layout Iteration

Iterates on layout (positioning, styling, structure) until the app screen **matches the user's Figma screenshot**. No interactions or data fetching are added in this step—only visual/layout fixes.

## When to Use

- At **Step 3** of the frontend feature development flow ([`client/flow.md`](../../client/flow.md))
- After **Step 2** (layout implementation) is complete and the feature screen is reachable
- When you have the **user's Figma screenshot** (or design reference) as the visual target

## Prerequisites

- **Dev server**: Client app running in dev mode (e.g. `npm start` in client). **CRITICAL: Automatically start it if not running - never ask the user to start it.**
- **Figma screenshot**: User has provided a screenshot (or image) of the desired layout from Figma.
- **Browser MCP**: Cursor's browser MCP (e.g. **cursor-ide-browser**) is available so you can open the app URL and capture state.
- **Screenshot MCP (optional)**: If a screenshot MCP is configured (e.g. ScreenshotMCP, Webpage Screenshot MCP), you can capture a pixel image of the page and compare it to the Figma screenshot via vision. Otherwise use the backup or fallbacks below.
- **Backup: ask user to take a screenshot**: If no screenshot MCP is available, you can ask the **user** to open the app in their browser (same URL, e.g. `http://localhost:5173/`), take a screenshot (e.g. browser dev tools, OS shortcut, or right‑click → “Save as”), and provide the image. You then compare that image to the Figma screenshot (e.g. via vision) and list differences. Use this when automated capture is not possible.
- **Other fallbacks**: User-led comparison (user looks at live app and Figma and reports differences in words), or `browser_snapshot` + Figma to infer layout/CSS differences; user confirms or corrects.

## Instructions

1. **Automatically ensure the app is running** (CRITICAL: Never ask user to start it)
   - Check if client dev server is accessible: `curl http://localhost:5173` or check if port 5173 is in use
   - If not running, **automatically start it**: `cd client && npm start` (run in background with `is_background: true`)
   - Wait for dev server to be ready (use short incremental waits with health checks, e.g., wait 2-3 seconds, check if accessible, repeat if needed)
   - Note the URL (e.g. `http://localhost:5173/`)
   - **Never prompt the user**: If the app is not running, start it automatically without asking

2. **Open the feature screen in the browser**  
   Use the browser MCP to navigate to the URL where the feature is rendered (e.g. `http://localhost:5173/` or the route that shows the implemented layout). Use short waits and snapshots to confirm the page has loaded before comparing.

3. **Capture the current state for comparison**  
   - **If a screenshot MCP is available**: Capture a pixel screenshot of the page. Compare this image to the user's Figma screenshot (e.g. using vision) to list visual differences.
   - **Backup — ask user to take a screenshot**: If no screenshot MCP is available, ask the **user** to open the app in their browser at the same URL (e.g. `http://localhost:5173/`), take a screenshot (browser or OS), and provide the image. Compare that image to the Figma screenshot (e.g. via vision) and list differences. Use this when automated capture is not possible.
   - **Other fallbacks**: Use `browser_snapshot` to get page structure and/or ask the user to compare the live app with the Figma screenshot and report differences in words (spacing, alignment, fonts, colors, missing/extra elements, order). Alternatively, use the snapshot structure plus the Figma screenshot to infer layout/CSS differences where possible; have the user confirm or correct.

4. **Compare and list differences**  
   Compare the app state with the **user-provided Figma screenshot**:
   - List differences (e.g. spacing, alignment, font size, colors, missing elements, extra elements, wrong order).
   - For each difference, identify the **component or style** that needs to change and the **intended value** from Figma (e.g. token name, pixel value, color).

5. **Correct the layout in code**  
   Edit the implementation (styles, tokens, structure) to address each difference. Do not add interaction logic or data fetching—only layout/styling changes.

6. **Repeat until match or user acceptance**  
   - Reload or navigate again in the browser (so the latest code is visible), then capture state again and compare again.
   - Continue until:
     - The app and the user's Figma screenshot match, or
     - The user explicitly accepts the current state and ends the iteration.

7. **Get user confirmation**  
   Before leaving this step, get explicit confirmation from the user that layout is approved. Only then proceed to Step 4 (interactions and data implementation).

## Rules

- **Automatic app startup**: **NEVER ask the user to start the app**. Always check if it's running and start it automatically if needed. This is mandatory, not optional.
- **Layout only**: Do not add click handlers, form submission, GraphQL, loading/error UI from API, or route guards that fetch data. Only positioning, styling, and static structure.
- **Short waits**: Use short incremental waits and snapshots when checking the page; avoid long fixed delays.
- **Updated reference**: If the user provides a new Figma screenshot, use it as the new reference for comparison.
- **One iteration at a time**: Fix differences, then re-capture and re-compare; do not assume the fix is correct without verifying in the browser.

## Output

- A list of differences (if any) for each comparison cycle.
- Code edits that resolve those differences.
- Final confirmation from the user that layout is approved before proceeding to Step 4.

## Optional: Subagent for comparison-only

If you later introduce a **layout-comparator** subagent that only compares app screenshot to Figma screenshot and returns a list of differences (no code edits), you can call it from this skill to get the difference list, then apply the fixes yourself and repeat. The skill procedure stays the same; only the "capture and compare" step would optionally delegate to that subagent.
