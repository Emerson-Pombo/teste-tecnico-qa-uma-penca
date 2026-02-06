import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { ProductPage } from '../../pages/product.page';

import user from '../../data/user.json';
import product from '../../data/product.json';

test.describe('Cadastro de Produto', () => {

    test('Deve criar um produto ativo com sucesso', async ({ page }) => {

        const loginPage = new LoginPage(page);
        const productPage = new ProductPage(page);

        await loginPage.acessar();
        await loginPage.realizarLogin(user.email, user.senha);

        await productPage.accessProductRegistration();

        await productPage.fillProduct({
            name: product.name,
            price: product.price,
            description: product.description,
            status: 'ativo'
        });

        await productPage.save();

        await productPage.validateSuccess();

        expect(await productPage.getSelectedStatus()).toBe('ativo');
    });


    test('Deve criar um produto inativo com sucesso', async ({ page }) => {

        const loginPage = new LoginPage(page);
        const productPage = new ProductPage(page);

        await loginPage.acessar();
        await loginPage.realizarLogin(user.email, user.senha);

        await productPage.accessProductRegistration();

        await productPage.fillProduct({
            name: product.name,
            price: product.price,
            description: product.description,
            status: 'inativo'
        });

        await productPage.save();

        await productPage.validateSuccess();

        expect(await productPage.getSelectedStatus()).toBe('inativo');
    });


    test('Validar exibição correta no catálogo', async () => { })

    test('Validar atualização imediata após edição', async () => { })

    test('Criar produto com preço decimal válido', async () => { })

    test('Editar apenas um campo mantendo os demais', async () => { })

    // Cenários Negativos

    test('Não deve permitir criar produto sem nome', async () => { })

    test('Não deve permitir criar produto sem preço', async () => { })

    test('Não deve permitir preço negativo', async () => { })

    test('Não deve permitir preço igual a zero', async () => { })

    test('Deve validar limite máximo da descrição', async () => { })

    test('Não deve permitir criação sem autenticação', async () => { })

    test('Não deve aceitar status inválido', async () => { })

    test('Não deve permitir editar produto inexistente', async () => { })


});
