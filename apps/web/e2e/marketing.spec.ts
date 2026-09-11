import { expect, test, type Page } from '@playwright/test';

const monitorPageErrors = (page: Page) => {
  const errors: string[] = [];

  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  return errors;
};

test.describe('Marketing experience', () => {
  test('renders the home page without browser errors', async ({ page }) => {
    const pageErrors = monitorPageErrors(page);
    const response = await page.goto('/');

    expect(response).not.toBeNull();
    expect(response?.ok()).toBe(true);

    await expect(page).toHaveTitle(/Envelia Studio/u);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /Invitaciones digitales\s+que cobran vida\./u,
      }),
    ).toBeVisible();

    expect(pageErrors).toEqual([]);
  });

  test('navigates to the experience section', async ({ page }) => {
    const pageErrors = monitorPageErrors(page);
    const response = await page.goto('/');

    expect(response).not.toBeNull();
    expect(response?.ok()).toBe(true);

    await page
      .getByRole('link', {
        name: 'Descubrir la experiencia',
      })
      .click();

    await expect(page).toHaveURL(/\/#experiencia$/u);
    await expect(
      page.getByRole('region', {
        name: 'De la idea a tus invitados',
      }),
    ).toBeVisible();

    expect(pageErrors).toEqual([]);
  });

  test('navigates from the marketing page to the invitation studio', async ({ page }) => {
    const pageErrors = monitorPageErrors(page);
    const response = await page.goto('/');

    expect(response).not.toBeNull();
    expect(response?.ok()).toBe(true);

    await page
      .getByRole('link', {
        name: 'Crear mi invitación',
      })
      .click();

    await expect(page).toHaveURL(/\/studio$/u);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Diseña una invitación que se siente tuya',
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('form', {
        name: 'Diseña tu borrador',
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('article', {
        name: 'Vista previa de la invitación',
      }),
    ).toBeVisible();

    expect(pageErrors).toEqual([]);
  });

  test('returns from a fragment URL to the home page', async ({ page }) => {
    const pageErrors = monitorPageErrors(page);
    const response = await page.goto('/#muestra');

    expect(response).not.toBeNull();
    expect(response?.ok()).toBe(true);

    await page
      .getByRole('link', {
        name: 'Envelia Studio, página de inicio',
      })
      .click();

    await expect(page).toHaveURL(/\/$/u);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /Invitaciones digitales\s+que cobran vida\./u,
      }),
    ).toBeVisible();

    expect(pageErrors).toEqual([]);
  });
});
