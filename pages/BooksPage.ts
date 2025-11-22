import { Page, expect } from '@playwright/test';
import { AddEditModal } from './AddEditModal';
import { byText, byCss, buttonByLabel } from '../utils/locators';

export type BookData = {
  title: string;
  author: string;
  genre: string;
  isbn: string;
  publicationDate: string;
  price: string;
};

export class BooksPage {
  private modal: AddEditModal;

  constructor(private page: Page) {
    this.modal = new AddEditModal(page);
  }

  async clickAddBook() {
    await buttonByLabel(this.page, 'Add Book').click();
    await this.modal.waitForModal();
  }

  async clickEditForBook(title: string) {
    const row = this.page.locator(`table tbody tr:has-text("${title}")`);
    await row.locator('button:has-text("Edit")').click();
    await this.modal.waitForModal();
  }

  async clickDeleteForBook(title: string) {
    const row = this.page.locator(`table tbody tr:has-text("${title}")`);
    await row.locator('button:has-text("Delete")').click();
  }

  async addBook(): Promise<{ beforeCount: number; newBook: BookData }> {
    const beforeCount = await this.getTotalBooksCount();
    await this.clickAddBook();
    const newBook = await this.modal.submitBook();
    return { beforeCount, newBook };
  }

  async editBook(oldTitle: string): Promise<BookData> {
    await this.clickEditForBook(oldTitle);
    return this.modal.submitBook();
  }

  async deleteBookIfExists(title: string) {
    const row = this.page.locator(`table tbody tr:has-text("${title}")`);
    if ((await row.count()) > 0) await this.clickDeleteForBook(title);
  }

  async getTotalBooksCount(): Promise<number> {
    const header = byText(this.page, 'Total Book Titles');
    await expect(header).toBeVisible();
    return parseInt((await header.innerText()).replace(/\D+/g, ''), 10);
  }

  async expectBookCountIncreased(oldCount: number) {
    const newCount = await this.getTotalBooksCount();
    expect(newCount).toBe(oldCount + 1);
  }

  async getAllBooks(): Promise<BookData[]> {
    const rows = this.page.locator('table tbody tr');
    const books: BookData[] = [];
    for (let i = 0; i < await rows.count(); i++) {
      const row = rows.nth(i);
      books.push({
        title: await row.locator('td:nth-child(1)').innerText(),
        author: await row.locator('td:nth-child(2)').innerText(),
        genre: await row.locator('td:nth-child(3)').innerText(),
        isbn: await row.locator('td:nth-child(4)').innerText(),
        publicationDate: await row.locator('td:nth-child(5)').innerText(),
        price: await row.locator('td:nth-child(6)').innerText()
      });
    }
    return books;
  }

  async expectAllBooksHaveTitles() {
    const books = await this.getAllBooks();
    for (const book of books) expect(book.title.trim()).not.toBe('');
  }

  async expectBookInTable(title: string) {
    const books = await this.getAllBooks();
    expect(books.some(b => b.title === title)).toBe(true);
  }

  async expectBookNotInTable(title: string) {
    const books = await this.getAllBooks();
    expect(books.some(b => b.title === title)).toBe(false);
  }

  async logout() {
    await buttonByLabel(this.page, 'Log Out').click();
  }

  async expectValidationErrors(title: string) {
    await this.clickAddBook();
    await this.modal.fillTitle(title);
    await this.modal.submit();
    const expectedMessages = [
      'Author is required.',
      'ISBN is required.',
      'Publication Date is required.',
      'Price is required.'
    ];
    const errors = await this.modal.getErrorMessages();
    for (const msg of expectedMessages) expect(errors).toContain(msg);
  }

  async expectTitleLengthError(title: string) {
    await this.clickAddBook();
    await this.modal.fillTitle(title);
    await this.modal.submit();
    const expectedMessage = 'Title cannot exceed 20 characters.';
    const errorLocator = this.page.locator('#title-error');
    await expect(errorLocator).toBeVisible();
    expect(await errorLocator.innerText()).toBe(expectedMessage);
  }

  async expectButtonEnabled(buttonText: string) {
    const locator = this.page.locator(`button:has-text("${buttonText}")`);
    await expect(locator).toBeEnabled();
  }

  async clickButton(buttonText: string) {
    const locator = this.page.locator(`button:has-text("${buttonText}")`);
    await expect(locator).toBeVisible();
    await locator.click();
  }
}
