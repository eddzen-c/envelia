import { expect, test, type Page } from '@playwright/test';

const expectedTitle = 'Envelia Studio — Invitaciones que cobran vida';

const openPage = async (page: Page, path = '/') => {
  const pageErrors: Error[] = [];

  page.on('pageerror', (error) => {
    pageErrors.push(error);
  });

  const response = await page.goto(path);

  if (!response) {
    throw new Error(`Navigation to ${path} did not return a response`);
  }

  expect(response.ok()).toBeTruthy();

  return pageErrors;
};

test.describe('Marketing experience', () => {
  test('renders the home page without browser errors', async ({ page }) => {
    const pageErrors = await openPage(page);

    await expect(page).toHaveTitle(expectedTitle);

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Invitaciones digitales que cobran vida.',
      }),
    ).toBeVisible();

    await expect(page.getByRole('main')).toBeVisible();

    expect(pageErrors).toEqual([]);
  });

  test('navigates to the experience section', async ({ page }) => {
    const pageErrors = await openPage(page);

    const experienceLink = page.getByRole('link', {
      name: 'Descubrir la experiencia',
    });

    await expect(experienceLink).toHaveAttribute('href', '#experiencia');

    await experienceLink.click();

    await expect(page).toHaveURL(/\/#experiencia$/);

    await expect(
      page.getByRole('region', {
        name: 'De la idea a tus invitados',
      }),
    ).toBeInViewport();

    expect(pageErrors).toEqual([]);
  });

  test('navigates to the conceptual sample', async ({ page }) => {
    const pageErrors = await openPage(page);

    const sampleLink = page.getByRole('link', {
      name: 'Ver muestra conceptual',
    });

    await expect(sampleLink).toHaveAttribute('href', '#muestra');

    await sampleLink.click();

    await expect(page).toHaveURL(/\/#muestra$/);

    await expect(
      page.getByRole('complementary', {
        name: 'Muestra conceptual de una invitación digital',
      }),
    ).toBeInViewport();

    expect(pageErrors).toEqual([]);
  });

  test('returns from a fragment URL to the home page', async ({ page }) => {
    const pageErrors = await openPage(page, '/#experiencia');

    await expect(
      page.getByText('Próximamente', {
        exact: true,
      }),
    ).toBeVisible();

    const homeLink = page.getByRole('link', {
      name: 'Envelia Studio, página de inicio',
    });

    await expect(homeLink).toHaveAttribute('href', '/');

    await homeLink.click();

    await expect(page).toHaveURL(/\/$/);

    expect(pageErrors).toEqual([]);
  });
});
