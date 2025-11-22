import { Page, Locator } from '@playwright/test';

export function byTestId(page: Page, id: string): Locator {
  return page.locator(`[data-testid="${id}"]`);
}

export function byText(page: Page, text: string): Locator {
  return page.locator(`text=${text}`);
}

export function byCss(page: Page, selector: string): Locator {
  return page.locator(selector);
}

export function buttonByLabel(page: Page, label: string): Locator {
  return page.locator(`button:has-text("${label}")`);
}

export function inputByLabel(page: Page, label: string): Locator {
  return page.getByLabel(label);
}