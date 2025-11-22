import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BooksPage } from '../pages/BooksPage';
import { loginData, bookData } from '../utils/test-data';

let loginPage: LoginPage;
let booksPage: BooksPage;

test.describe('Books Catalog Tests', () => {

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    booksPage = new BooksPage(page);
    await loginPage.goto();
    await loginPage.login(loginData.valid.username, loginData.valid.password);
  });

  test('Add a book successfully and verify book titles', async () => {
    const { beforeCount, newBook } = await booksPage.addBook();
    await booksPage.expectBookInTable(newBook.title);
    await booksPage.expectBookCountIncreased(beforeCount);
  });

  test('Edit a book title', async () => {
    const { newBook } = await booksPage.addBook();
    await booksPage.expectBookInTable(newBook.title);

    const editedBook = await booksPage.editBook(newBook.title);
    await booksPage.expectBookInTable(editedBook.title);
  });

  test('Adding a book with missing required fields shows validation errors', async () => {
    await booksPage.expectValidationErrors(bookData.book.title);
  });

  test('Delete a book', async () => {
    const { newBook } = await booksPage.addBook();
    await booksPage.expectBookInTable(newBook.title);

    await booksPage.clickDeleteForBook(newBook.title);
    await booksPage.expectBookNotInTable(newBook.title);
  });

  test('Pagination buttons work', async () => {
    for (let i = 0; i < 7; i++) {
      await booksPage.addBook();
    }

    await booksPage.expectButtonEnabled('Next');
    await booksPage.clickButton('Next');

    await booksPage.expectButtonEnabled('Previous');
    await booksPage.clickButton('Previous');
  });

  test('Logout is successful', async () => {
    await booksPage.logout();
    await loginPage.expectWelcomeMessage(false);
  });

  test('Shows error when title exceeds 20 characters', async () => {
    await booksPage.expectTitleLengthError(bookData.book.longTitle);
  });

});
