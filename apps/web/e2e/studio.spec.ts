import { expect, test, type Page } from '@playwright/test';

import {
  invitationProjectLibraryStorageKey,
  parseInvitationProjectLibrary,
} from '../src/features/invitation-draft/model/invitation-project-library-persistence';

const monitorPageErrors = (page: Page) => {
  const errors: string[] = [];

  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  return errors;
};

const createFirstProject = async (page: Page) => {
  await page
    .getByRole('button', {
      name: 'Crear mi primera invitación',
    })
    .click();

  return page.getByRole('form', {
    name: 'Diseña tu borrador',
  });
};

const readStoredProjects = async (page: Page) => {
  const serializedLibrary = await page.evaluate(
    (storageKey) => window.localStorage.getItem(storageKey),
    invitationProjectLibraryStorageKey,
  );

  return serializedLibrary ? parseInvitationProjectLibrary(serializedLibrary) : null;
};

test.describe('Invitation project library', () => {
  test('creates a project and updates its preview while it is edited', async ({ page }) => {
    const pageErrors = monitorPageErrors(page);
    const response = await page.goto('/studio');

    expect(response).not.toBeNull();
    expect(response?.ok()).toBe(true);

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Crea y organiza invitaciones que se sienten tuyas',
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: 'Mis invitaciones',
      }),
    ).toBeVisible();

    const form = await createFirstProject(page);
    const preview = page.getByRole('article', {
      name: 'Vista previa de la invitación',
    });

    await form
      .getByRole('textbox', {
        name: /^Título del evento\b/u,
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

    await expect
      .poll(async () => (await readStoredProjects(page))?.[0]?.content.eventTitle)
      .toBe('Graduación de Valeria');

    expect(pageErrors).toEqual([]);
  });

  test('changes the visual theme and restores the initial example', async ({ page }) => {
    const pageErrors = monitorPageErrors(page);
    const response = await page.goto('/studio');

    expect(response).not.toBeNull();
    expect(response?.ok()).toBe(true);

    const form = await createFirstProject(page);
    const preview = page.getByRole('article', {
      name: 'Vista previa de la invitación',
    });
    const title = form.getByRole('textbox', {
      name: /^Título del evento\b/u,
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

    await expect
      .poll(async () => (await readStoredProjects(page))?.[0]?.content.eventTitle)
      .toBe('Andrea & Mateo');

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

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Crea y organiza invitaciones que se sienten tuyas',
      }),
    ).toBeVisible();

    const form = await createFirstProject(page);
    const preview = page.getByRole('article', {
      name: 'Vista previa de la invitación',
    });

    await expect(form).toBeVisible();
    await expect(preview).toBeVisible();

    await form
      .getByRole('textbox', {
        name: /^Título del evento\b/u,
      })
      .fill('Fiesta móvil');

    await expect(preview).toContainText('Fiesta móvil');

    const pageDimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));

    expect(pageDimensions.clientWidth).toBe(320);
    expect(pageDimensions.scrollWidth).toBeLessThanOrEqual(pageDimensions.clientWidth);
    expect(pageErrors).toEqual([]);
  });

  test('restores a customized project after reloading the page', async ({ page }) => {
    const pageErrors = monitorPageErrors(page);
    const response = await page.goto('/studio');

    expect(response).not.toBeNull();
    expect(response?.ok()).toBe(true);

    const form = await createFirstProject(page);

    await form
      .getByRole('textbox', {
        name: /^Título del evento\b/u,
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

    await expect
      .poll(async () => (await readStoredProjects(page))?.[0]?.content.eventTitle)
      .toBe('Aniversario de Lucía y Daniel');

    const reloadResponse = await page.reload();

    expect(reloadResponse).not.toBeNull();
    expect(reloadResponse?.ok()).toBe(true);

    await expect(
      page.getByRole('status', {
        name: 'Estado de la biblioteca',
      }),
    ).toContainText('Invitaciones recuperadas de este navegador.');

    await expect(
      page.getByRole('heading', {
        name: 'Aniversario de Lucía y Daniel',
      }),
    ).toBeVisible();

    await page
      .getByRole('button', {
        name: 'Abrir Aniversario de Lucía y Daniel',
      })
      .click();

    const restoredForm = page.getByRole('form', {
      name: 'Diseña tu borrador',
    });
    const restoredPreview = page.getByRole('article', {
      name: 'Vista previa de la invitación',
    });

    await expect(
      restoredForm.getByRole('textbox', {
        name: /^Título del evento\b/u,
      }),
    ).toHaveValue('Aniversario de Lucía y Daniel');
    await expect(restoredForm.getByLabel('Fecha del evento')).toHaveValue('2028-04-15');
    await expect(
      restoredForm.getByRole('textbox', {
        name: 'Lugar',
      }),
    ).toHaveValue('Casa del Lago');
    await expect(
      restoredForm.getByRole('textbox', {
        name: 'Mensaje',
      }),
    ).toHaveValue('Celebremos una nueva etapa de nuestra historia.');
    await expect(
      restoredForm.getByRole('radio', {
        name: 'Medianoche',
      }),
    ).toBeChecked();
    await expect(restoredPreview).toHaveAttribute('data-theme', 'midnight');
    await expect(restoredPreview).toContainText('Aniversario de Lucía y Daniel');
    await expect(restoredPreview).toContainText('15 de abril de 2028');

    expect(pageErrors).toEqual([]);
  });

  test('persists the restored initial example inside its project', async ({ page }) => {
    const pageErrors = monitorPageErrors(page);
    const response = await page.goto('/studio');

    expect(response).not.toBeNull();
    expect(response?.ok()).toBe(true);

    const form = await createFirstProject(page);
    const title = form.getByRole('textbox', {
      name: /^Título del evento\b/u,
    });
    const lavenderTheme = form.getByRole('radio', {
      name: 'Lavanda',
    });
    const champagneTheme = form.getByRole('radio', {
      name: 'Champaña',
    });

    await title.fill('Proyecto temporal');
    await champagneTheme.check();

    await form
      .getByRole('button', {
        name: 'Restablecer ejemplo',
      })
      .click();

    await expect(title).toHaveValue('Andrea & Mateo');
    await expect(lavenderTheme).toBeChecked();

    await expect
      .poll(async () => (await readStoredProjects(page))?.[0]?.content.eventTitle)
      .toBe('Andrea & Mateo');

    await page
      .getByRole('button', {
        name: 'Volver a Mis invitaciones',
      })
      .click();

    await expect(
      page.getByRole('heading', {
        name: 'Andrea & Mateo',
      }),
    ).toBeVisible();

    await page.reload();

    await page
      .getByRole('button', {
        name: 'Abrir Andrea & Mateo',
      })
      .click();

    await expect(
      page
        .getByRole('form', {
          name: 'Diseña tu borrador',
        })
        .getByRole('textbox', {
          name: /^Título del evento\b/u,
        }),
    ).toHaveValue('Andrea & Mateo');

    expect(pageErrors).toEqual([]);
  });

  test('duplicates and deletes local projects', async ({ page }) => {
    const pageErrors = monitorPageErrors(page);
    const response = await page.goto('/studio');

    expect(response).not.toBeNull();
    expect(response?.ok()).toBe(true);

    await createFirstProject(page);

    await page
      .getByRole('button', {
        name: 'Volver a Mis invitaciones',
      })
      .click();

    await page
      .getByRole('button', {
        name: 'Duplicar Andrea & Mateo',
      })
      .click();

    await expect(
      page.getByRole('heading', {
        name: 'Andrea & Mateo',
      }),
    ).toHaveCount(2);

    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await page
      .getByRole('button', {
        name: 'Eliminar Andrea & Mateo',
      })
      .first()
      .click();

    await expect(
      page.getByRole('heading', {
        name: 'Andrea & Mateo',
      }),
    ).toHaveCount(1);

    await expect.poll(async () => (await readStoredProjects(page))?.length).toBe(1);

    expect(pageErrors).toEqual([]);
  });

  test('discards corrupted library data without breaking project creation', async ({ page }) => {
    await page.addInitScript(
      ({ storageKey }) => {
        window.localStorage.setItem(storageKey, '{not-valid-json');
      },
      {
        storageKey: invitationProjectLibraryStorageKey,
      },
    );

    const pageErrors = monitorPageErrors(page);
    const response = await page.goto('/studio');

    expect(response).not.toBeNull();
    expect(response?.ok()).toBe(true);

    await expect(
      page.getByRole('heading', {
        name: 'Mis invitaciones',
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', {
        name: 'Crear mi primera invitación',
      }),
    ).toBeVisible();

    await expect
      .poll(() =>
        page.evaluate(
          (storageKey) => window.localStorage.getItem(storageKey),
          invitationProjectLibraryStorageKey,
        ),
      )
      .toBeNull();

    const form = await createFirstProject(page);

    await expect(
      form.getByRole('textbox', {
        name: /^Título del evento\b/u,
      }),
    ).toHaveValue('Andrea & Mateo');

    expect(pageErrors).toEqual([]);
  });
});
