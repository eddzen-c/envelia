import { expect, test, type Page } from '@playwright/test';
import { invitationDraftStorageKey } from '../src/features/invitation-draft/model/invitation-draft-persistence';

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

  test('restores a customized draft after reloading the page', async ({ page }) => {
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
    const persistenceStatus = page.getByRole('status', {
      name: 'Estado del borrador',
    });

    await expect(persistenceStatus).toContainText('Los cambios se guardarán en este navegador.');

    await form
      .getByRole('textbox', {
        name: 'Título del evento',
      })
      .fill('Aniversario de Lucía y Daniel');
    await form.getByLabel('Fecha del evento').fill('2028-04-15');
    await form
      .getByRole('textbox', {
        name: 'Lugar',
      })
      .fill('Casa del Lago');
    await form
      .getByRole('textbox', {
        name: 'Mensaje',
      })
      .fill('Celebremos una nueva etapa de nuestra historia.');
    await form
      .getByRole('radio', {
        name: 'Medianoche',
      })
      .check();

    await expect(persistenceStatus).toContainText('Borrador guardado en este navegador.');

    const storedValue = await page.evaluate(
      (storageKey) => window.localStorage.getItem(storageKey),
      invitationDraftStorageKey,
    );

    expect(storedValue).not.toBeNull();

    const reloadResponse = await page.reload();

    expect(reloadResponse).not.toBeNull();
    expect(reloadResponse?.ok()).toBe(true);

    await expect(persistenceStatus).toContainText('Borrador recuperado de este navegador.');
    await expect(
      form.getByRole('textbox', {
        name: 'Título del evento',
      }),
    ).toHaveValue('Aniversario de Lucía y Daniel');
    await expect(form.getByLabel('Fecha del evento')).toHaveValue('2028-04-15');
    await expect(
      form.getByRole('textbox', {
        name: 'Lugar',
      }),
    ).toHaveValue('Casa del Lago');
    await expect(
      form.getByRole('textbox', {
        name: 'Mensaje',
      }),
    ).toHaveValue('Celebremos una nueva etapa de nuestra historia.');
    await expect(
      form.getByRole('radio', {
        name: 'Medianoche',
      }),
    ).toBeChecked();
    await expect(preview).toHaveAttribute('data-theme', 'midnight');
    await expect(preview).toContainText('Aniversario de Lucía y Daniel');
    await expect(preview).toContainText('15 de abril de 2028');

    expect(pageErrors).toEqual([]);
  });

  test('clears the persisted draft and keeps the initial example after reloading', async ({
    page,
  }) => {
    const pageErrors = monitorPageErrors(page);
    const response = await page.goto('/studio');

    expect(response).not.toBeNull();
    expect(response?.ok()).toBe(true);

    const form = page.getByRole('form', {
      name: 'Diseña tu borrador',
    });
    const persistenceStatus = page.getByRole('status', {
      name: 'Estado del borrador',
    });
    const title = form.getByRole('textbox', {
      name: 'Título del evento',
    });
    const lavenderTheme = form.getByRole('radio', {
      name: 'Lavanda',
    });
    const champagneTheme = form.getByRole('radio', {
      name: 'Champaña',
    });

    await expect(persistenceStatus).toContainText('Los cambios se guardarán en este navegador.');

    await title.fill('Borrador que será eliminado');
    await champagneTheme.check();

    await expect(persistenceStatus).toContainText('Borrador guardado en este navegador.');

    await form
      .getByRole('button', {
        name: 'Restablecer ejemplo',
      })
      .click();

    await expect(persistenceStatus).toContainText(
      'Borrador local eliminado; restauramos el ejemplo inicial.',
    );
    await expect(title).toHaveValue('Andrea & Mateo');
    await expect(lavenderTheme).toBeChecked();

    const storedValueAfterReset = await page.evaluate(
      (storageKey) => window.localStorage.getItem(storageKey),
      invitationDraftStorageKey,
    );

    expect(storedValueAfterReset).toBeNull();

    const reloadResponse = await page.reload();

    expect(reloadResponse).not.toBeNull();
    expect(reloadResponse?.ok()).toBe(true);

    await expect(persistenceStatus).toContainText('Los cambios se guardarán en este navegador.');
    await expect(title).toHaveValue('Andrea & Mateo');
    await expect(lavenderTheme).toBeChecked();

    expect(pageErrors).toEqual([]);
  });

  test('discards corrupted browser data without breaking the editor', async ({ page }) => {
    await page.addInitScript(
      ({ storageKey }) => {
        window.localStorage.setItem(storageKey, '{not-valid-json');
      },
      {
        storageKey: invitationDraftStorageKey,
      },
    );

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
    const persistenceStatus = page.getByRole('status', {
      name: 'Estado del borrador',
    });

    await expect(persistenceStatus).toContainText(
      'Se descartó un borrador guardado que ya no era válido.',
    );
    await expect(
      form.getByRole('textbox', {
        name: 'Título del evento',
      }),
    ).toHaveValue('Andrea & Mateo');
    await expect(
      form.getByRole('radio', {
        name: 'Lavanda',
      }),
    ).toBeChecked();
    await expect(preview).toContainText('Andrea & Mateo');

    const storedValue = await page.evaluate(
      (storageKey) => window.localStorage.getItem(storageKey),
      invitationDraftStorageKey,
    );

    expect(storedValue).toBeNull();
    expect(pageErrors).toEqual([]);
  });
});
