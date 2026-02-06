import { Page, expect } from '@playwright/test'

export class ProductPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async accessProductRegistration() {
        await this.page.goto('/products/new');
    }

    async fillProduct(name: string, price: string, description: string) {
        await this.page.fill('#name', name);
        await this.page.fill('#price', price);
        await this.page.fill('#description', description)
    }

    async salve() {
        await this.page.click('#click');
    }

    async validateSuccess() {
        await expect(
            this.page.locator('#.alert-success')
        ).toContainText('Produto criado com sucesso');
    }

    async validateError(message: string) {
        await expect(
            this.page.locator('.error')
        ).toContainText(message);
    }
}