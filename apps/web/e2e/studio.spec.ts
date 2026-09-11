import { expect, test, type Page } from '@playwright/test';

const monitorPageErrors = (page: Page) => {
  const errors: string[] = [];

  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  return errors;
};

test.describe('Invitation draft studio', () => {
  test('updates the preview while the invitation is edited', async ({ page }) => {
    const pageErrors = monitorPageErrors(page);
    const response = await page.goto('/studio');

    expect(response).not.toBeNull();
    expect(response?.ok()).toBe(true);

    const form = page.getByRole('form', {
      name: 'Diseña tu borrador',
    });
    const preview = page.getByRole('article', {
      name: 'Vista previa de la invitación',
    });

    await form
      .getByRole('textbox', {
        name: 'Título del evento',
      })
      .fill('Graduación de Valeria');
    await form.getByLabel('Fecha del evento').fill('2027-06-25');
    await form
      .getByRole('textbox', {
        name: 'Lugar',
      })
      .fill('Jardín de los Arcos');
    await form
      .getByRole('textbox', {
        name: 'Mensaje',
      })
      .fill('Celebremos juntos el comienzo de una nueva etapa.');

    await expect(preview).toContainText('Graduación de Valeria');
    await expect(preview).toContainText('25 de junio de 2027');
    await expect(preview).toContainText('Jardín de los Arcos');
    await expect(preview).toContainText('Celebremos juntos el comienzo de una nueva etapa.');

    expect(pageErrors).toEqual([]);
  });

  test('changes the visual theme and restores the initial example', async ({ page }) => {
    const pageErrors = monitorPageErrors(page);
    const response = await page.goto('/studio');

    expect(response).not.toBeNull();
    expect(response?.ok()).toBe(true);

    const form = page.getByRole('form', {
      name: 'Diseña tu borrador',
    });
    const preview = page.getByRole('article', {
      name: 'Vista previa de la invitación',
    });
    const title = form.getByRole('textbox', {
      name: 'Título del evento',
    });
    const lavenderTheme = form.getByRole('radio', {
      name: 'Lavanda',
    });
    const midnightTheme = form.getByRole('radio', {
      name: 'Medianoche',
    });

    await title.fill('Celebración temporal');
    await midnightTheme.check();

    await expect(midnightTheme).toBeChecked();
    await expect(preview).toHaveAttribute('data-theme', 'midnight');
    await expect(preview).toContainText('Medianoche');
    await expect(preview).toContainText('Celebración temporal');

    await form
      .getByRole('button', {
        name: 'Restablecer ejemplo',
      })
      .click();

    await expect(title).toHaveValue('Andrea & Mateo');
    await expect(lavenderTheme).toBeChecked();
    await expect(preview).toHaveAttribute('data-theme', 'lavender');
    await expect(preview).toContainText('Andrea & Mateo');
    await expect(preview).toContainText('18 de octubre de 2026');

    expect(pageErrors).toEqual([]);
  });

  test('remains usable at a viewport width of 320 pixels', async ({ page }) => {
    await page.setViewportSize({
      width: 320,
      height: 800,
    });

    const pageErrors = monitorPageErrors(page);
    const response = await page.goto('/studio');

    expect(response).not.toBeNull();
    expect(response?.ok()).toBe(true);

    const form = page.getByRole('form', {
      name: 'Diseña tu borrador',
    });
    const preview = page.getByRole('article', {
      name: 'Vista previa de la invitación',
    });

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Diseña una invitación que se siente tuya',
      }),
    ).toBeVisible();
    await expect(form).toBeVisible();
    await expect(preview).toBeVisible();

    await form
      .getByRole('textbox', {
        name: 'Título del evento',
      })
      .fill('Fiesta móvil');

    await expect(preview).toContainText('Fiesta móvil');

    const pageDimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));

    expect(pageDimensions.scrollWidth).toBeLessThanOrEqual(pageDimensions.clientWidth);
    expect(pageErrors).toEqual([]);
  });
});
