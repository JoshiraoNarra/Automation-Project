import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { loginData } from '../utils/test-data';

let loginPage: LoginPage;

test.describe('Login Page Tests', () => {

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Successful login with valid credentials', async () => {
    await loginPage.login(loginData.valid.username, loginData.valid.password);
    await loginPage.expectWelcomeMessage(true);
  });

  test('Login fails with invalid credentials', async () => {
    await loginPage.login(loginData.invalid.username, loginData.invalid.password);
    await loginPage.expectLoginError('invalid');
  });

  test('Login fails with empty username and password', async () => {
    await loginPage.login('', '');
    await loginPage.expectLoginError('empty');
  });

});
