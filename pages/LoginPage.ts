import { Page, expect } from '@playwright/test';
import { byCss, buttonByLabel, byText } from '../utils/locators';

export type LoginErrorType = 'invalid' | 'empty';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await byCss(this.page, '#username').fill(username);
    await byCss(this.page, '#password').fill(password);
    await buttonByLabel(this.page, 'Log In').click();
  }

  async expectWelcomeMessage(shouldBeVisible: boolean) {
    const welcomeLocator = byText(this.page, 'Welcome');
    if (shouldBeVisible) {
      await expect(welcomeLocator).toBeVisible({ timeout: 5000 });
    } else {
      await expect(welcomeLocator).toHaveCount(0);
    }
  }

  async expectLoginError(type: LoginErrorType) {
    const errorText =
      type === 'invalid'
        ? 'Invalid username or password. Please try again.'
        : 'There is a problem with your submission';

    const errorLocator = byText(this.page, errorText);
    await expect(errorLocator).toBeVisible();
  }
}
