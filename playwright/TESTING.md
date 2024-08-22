# Testing with Playwright

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

- Don't create/edit/delete data before DB initilization is sorted out.
- Remember to target labels, aria-labels, titles, data-testid attributes in selectors. If a selector created by playwright looks brittle e.g. `div[2] > p` you should probably add some identifiers to elements.
- If you are doing simple tests like cheking that views load correctly it is beneficial to use `test.describe.serial()` and avoid `page.goto('x')`. This will prevent playwright from creating unnecessary browser contexts and reloading the site, speeding up the tests.

> [!NOTE]
> Unlimited runners causes tests to timeout at some point.

### Editor integration

Test recorder from the Playwright [vscode plugin](https://playwright.dev/docs/getting-started-vscode) is great help in writing tests.

Same plugin is also useful for running tests while debugging them.
