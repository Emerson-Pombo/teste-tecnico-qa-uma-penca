import { Page, expect, Locator } from '@playwright/test'

export class ProductPage {
    readonly page: Page;

    nameInput: Locator;
    readonly priceInput: Locator;
    readonly descriptionInput: Locator;

    readonly statusSelect: Locator;
    readonly saveButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.nameInput = page.locator('#name');
        this.priceInput = page.locator('#price');
        this.descriptionInput = page.locator('#description');

        this.statusSelect = page.locator('#status');

        this.saveButton = page.locator('#save');
    }

    async accessProductRegistration() {
        await this.page.goto('/products/new');
    }

    async fillProduct(data: { name: string, price: string, description: string, status: 'ativo' | 'inativo' }) {
        await this.nameInput.fill(data.name);
        await this.priceInput.fill(data.price);
        await this.descriptionInput.fill(data.description);

        await this.setStatus(data.status);
    }

    async setStatus(status: 'ativo' | 'inativo') {
        await this.statusSelect.selectOption(status);
    }

    async getSelectedStatus(): Promise<string> {
        return await this.statusSelect.inputValue();
    }

    async save() {
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