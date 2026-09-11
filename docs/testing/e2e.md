# Playwright E2E testing

## Usage

Open Playwright for running tests locally:

```sh
taito playwright         # run tests in headless mode
taito playwright:client  # run tests only for client
taito playwright-ui      # open test recording ui
taito playwright-debug   # run tests with a visible browser window
```

To test other apps than client add relevant commands to root `package.json`.

## Conventions

- Prefer purpose-specific `data-testid` attributes and Playwright's
`getByTestId()` for elements that E2E tests interact with or assert. Avoid
selecting by rendered text because copy and translations can change without
changing behavior. Keep accessible names and semantics intact, and use role or
accessibility assertions when those are the behavior under test.
- If you are doing simple tests like cheking that views load correctly it is beneficial to use `test.describe.serial()` and avoid `page.goto('x')`. This will prevent playwright from creating unnecessary browser contexts and reloading the site, speeding up the tests.

### Editor integration

Test recorder from the Playwright [vscode plugin](https://playwright.dev/docs/getting-started-vscode) is great help in writing tests.

Same plugin is also useful for running tests while debugging them.
