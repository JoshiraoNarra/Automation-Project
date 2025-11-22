import { Page, expect } from '@playwright/test';
import { byCss, byText } from '../utils/locators';

export class AddEditModal {
  constructor(private page: Page) {}

  async waitForModal() {
    const addModal = byText(this.page, 'Add a New Book');
    const editModal = byText(this.page, 'Edit book details');
    await expect(addModal.or(editModal)).toBeVisible({ timeout: 5000 });
  }

  async fillTitle(title: string) {
    await byCss(this.page, 'input[name="title"], #title').fill(title);
  }

  private async isAddModal(): Promise<boolean> {
    return (await byCss(this.page, '#genre').count()) > 0;
  }

  private randomDate(): string {
    const start = new Date(1950, 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private generateRandomBook() {
    const genres = ['Fiction', 'Non-Fiction', 'Mystery', 'Fantasy', 'Science Fiction', 'Biography'];
    const randomString = () => Math.random().toString(36).substring(2, 10);
    const randomNumber = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    return {
      title: `Book ${randomString()}`,
      author: `Author ${randomString()}`,
      genre: genres[Math.floor(Math.random() * genres.length)],
      isbn: `${randomNumber(1000000000000, 9999999999999)}`,
      publicationDate: this.randomDate(),
      price: `${randomNumber(5, 50)}`
    };
  }

  async fillForm() {
    const data = this.generateRandomBook();

    await this.fillTitle(data.title);
    await byCss(this.page, 'input[name="author"], #author').fill(data.author);

    if (await this.isAddModal()) {
      await this.page.selectOption('#genre', { label: data.genre });
    } else {
      await byCss(this.page, 'input[name="genre"]').fill(data.genre);
    }

    await byCss(this.page, 'input[name="isbn"], #isbn').fill(data.isbn);
    await byCss(this.page, 'input[name="publicationDate"], #publicationDate').fill(data.publicationDate);
    await byCss(this.page, 'input[name="price"], #price').fill(data.price);

    return data;
  }

  async submit() {
    const button = byCss(this.page, 'button:text("Add Book"), button:text("Save Changes")');
    await expect(button).toBeVisible();
    await button.click();
  }

  async submitBook() {
    await this.waitForModal();
    const data = await this.fillForm();
    await this.submit();
    return data;
  }

  async getErrorMessages(): Promise<string[]> {
    return await byCss(this.page, 'div[role="alert"] li').allTextContents();
  }
}
