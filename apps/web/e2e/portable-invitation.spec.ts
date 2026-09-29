import { expect, test, type Page } from '@playwright/test';

import type { InvitationDraft } from '../src/features/invitation-draft/model/invitation-draft';
import {
  encodePortableInvitationDraft,
  portableInvitationMaxEncodedLength,
  portableInvitationPath,
} from '../src/features/invitation-draft/model/invitation-draft-portable-link';
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

const requireBaseURL = (baseURL: string | undefined) => {
  expect(baseURL).toBeDefined();

  if (!baseURL) {
    throw new Error('Playwright baseURL is required');
  }

  return baseURL;
};

const createPortableInvitationURL = (baseURL: string, draft: InvitationDraft) => {
  const result = encodePortableInvitationDraft(draft);

  expect(result.status).toBe('encoded');

  if (result.status !== 'encoded') {
    throw new Error('Expected the E2E draft to be encoded');
  }

  const invitationURL = new URL(portableInvitationPath, baseURL);

  invitationURL.hash = result.payload;

  return invitationURL.toString();
};

test.describe('Portable invitation links', () => {
  test('shares the current project with an isolated recipient without replacing local data', async ({
    baseURL,
    browser,
    context,
    page,
  }) => {
    const applicationURL = requireBaseURL(baseURL);
    const senderErrors = monitorPageErrors(page);

    const readStoredProjects = async (targetPage: Page) => {
      const serializedLibrary = await targetPage.evaluate(
        (storageKey) => window.localStorage.getItem(storageKey),
        invitationProjectLibraryStorageKey,
      );

      return serializedLibrary ? parseInvitationProjectLibrary(serializedLibrary) : null;
    };

    await context.grantPermissions(['clipboard-read', 'clipboard-write'], {
      origin: applicationURL,
    });

    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'share', {
        configurable: true,
        value: undefined,
      });
    });

    const studioResponse = await page.goto('/studio');

    expect(studioResponse).not.toBeNull();
    expect(studioResponse?.ok()).toBe(true);

    await page
      .getByRole('button', {
        name: 'Crear mi primera invitación',
      })
      .click();

    const senderDraft: InvitationDraft = {
      eventTitle: 'Cena bajo las estrellas',
      eventDate: '2027-08-21',
      location: 'Terraza del Bosque · Querétaro',
      message: 'Celebremos una noche llena de luz y buenos recuerdos.',
      theme: 'midnight',
    };

    const senderForm = page.getByRole('form', {
      name: 'Diseña tu borrador',
    });

    await senderForm
      .getByRole('textbox', {
        name: /^Título del evento\b/u,
      })
      .fill(senderDraft.eventTitle);
    await senderForm.getByLabel('Fecha del evento').fill(senderDraft.eventDate);
    await senderForm
      .getByRole('textbox', {
        name: 'Lugar',
      })
      .fill(senderDraft.location);
    await senderForm
      .getByRole('textbox', {
        name: 'Mensaje',
      })
      .fill(senderDraft.message);
    await senderForm
      .getByRole('radio', {
        name: 'Medianoche',
      })
      .check();

    await expect
      .poll(async () => (await readStoredProjects(page))?.[0]?.content.eventTitle)
      .toBe(senderDraft.eventTitle);

    await page
      .getByRole('button', {
        name: 'Compartir invitación',
      })
      .click();

    await expect(
      page.getByRole('status', {
        name: 'Estado del enlace compartible',
      }),
    ).toContainText('Enlace copiado al portapapeles.');

    const sharedURL = await page.evaluate(() => navigator.clipboard.readText());
    const parsedSharedURL = new URL(sharedURL);

    expect(parsedSharedURL.origin).toBe(applicationURL);
    expect(parsedSharedURL.pathname).toBe(portableInvitationPath);
    expect(parsedSharedURL.search).toBe('');
    expect(parsedSharedURL.hash.length).toBeGreaterThan(1);

    const recipientContext = await browser.newContext({
      baseURL: applicationURL,
    });
    const recipientPage = await recipientContext.newPage();
    const recipientErrors = monitorPageErrors(recipientPage);
    const invitationDocumentRequests: string[] = [];

    recipientPage.on('request', (request) => {
      if (
        request.isNavigationRequest() &&
        request.resourceType() === 'document' &&
        new URL(request.url()).pathname === portableInvitationPath
      ) {
        invitationDocumentRequests.push(request.url());
      }
    });

    try {
      const recipientStudioResponse = await recipientPage.goto('/studio');

      expect(recipientStudioResponse).not.toBeNull();
      expect(recipientStudioResponse?.ok()).toBe(true);

      await recipientPage
        .getByRole('button', {
          name: 'Crear mi primera invitación',
        })
        .click();

      const recipientForm = recipientPage.getByRole('form', {
        name: 'Diseña tu borrador',
      });
      const recipientTitle = recipientForm.getByRole('textbox', {
        name: /^Título del evento\b/u,
      });

      await recipientTitle.fill('Proyecto privado del destinatario');

      await expect
        .poll(async () => (await readStoredProjects(recipientPage))?.[0]?.content.eventTitle)
        .toBe('Proyecto privado del destinatario');

      const sharedResponse = await recipientPage.goto(sharedURL);

      expect(sharedResponse).not.toBeNull();
      expect(sharedResponse?.ok()).toBe(true);

      const sharedInvitation = recipientPage.getByRole('article', {
        name: 'Invitación compartida',
      });

      await expect(sharedInvitation).toBeVisible();
      await expect(sharedInvitation).toHaveAttribute('data-theme', senderDraft.theme);
      await expect(sharedInvitation).toContainText(senderDraft.eventTitle);
      await expect(sharedInvitation).toContainText('21 de agosto de 2027');
      await expect(sharedInvitation).toContainText(senderDraft.location);
      await expect(sharedInvitation).toContainText(senderDraft.message);

      expect((await readStoredProjects(recipientPage))?.[0]?.content.eventTitle).toBe(
        'Proyecto privado del destinatario',
      );

      expect(invitationDocumentRequests).toEqual([
        new URL(portableInvitationPath, applicationURL).toString(),
      ]);

      await recipientPage.goto('/studio');

      await expect(
        recipientPage.getByRole('heading', {
          name: 'Proyecto privado del destinatario',
        }),
      ).toBeVisible();

      await recipientPage
        .getByRole('button', {
          name: 'Abrir Proyecto privado del destinatario',
        })
        .click();

      await expect(
        recipientPage
          .getByRole('form', {
            name: 'Diseña tu borrador',
          })
          .getByRole('textbox', {
            name: /^Título del evento\b/u,
          }),
      ).toHaveValue('Proyecto privado del destinatario');

      expect((await readStoredProjects(page))?.[0]?.content.eventTitle).toBe(
        senderDraft.eventTitle,
      );

      expect(senderErrors).toEqual([]);
      expect(recipientErrors).toEqual([]);
    } finally {
      await recipientContext.close();
    }
  });
  test('offers recovery for a portable link without a fragment', async ({ page }) => {
    const pageErrors = monitorPageErrors(page);
    const response = await page.goto(portableInvitationPath);

    expect(response).not.toBeNull();
    expect(response?.ok()).toBe(true);

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Una invitación para ti',
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', {
        level: 2,
        name: 'El enlace está incompleto',
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', {
        name: 'Crear una invitación',
      }),
    ).toHaveAttribute('href', '/studio');

    expect(pageErrors).toEqual([]);
  });

  test('rejects a corrupted portable fragment safely', async ({ page }) => {
    const pageErrors = monitorPageErrors(page);
    const response = await page.goto(`${portableInvitationPath}#not+base64`);

    expect(response).not.toBeNull();
    expect(response?.ok()).toBe(true);

    await expect(
      page.getByRole('heading', {
        level: 2,
        name: 'No pudimos abrir esta invitación',
      }),
    ).toBeVisible();
    await expect(page.getByText(/datos locales permanecen intactos/iu)).toBeVisible();

    expect(pageErrors).toEqual([]);
  });

  test('rejects a portable fragment above the size boundary', async ({ page }) => {
    const pageErrors = monitorPageErrors(page);
    const oversizedPayload = 'A'.repeat(portableInvitationMaxEncodedLength + 1);
    const response = await page.goto(`${portableInvitationPath}#${oversizedPayload}`);

    expect(response).not.toBeNull();
    expect(response?.ok()).toBe(true);

    await expect(
      page.getByRole('heading', {
        level: 2,
        name: 'El enlace supera el tamaño permitido',
      }),
    ).toBeVisible();

    expect(pageErrors).toEqual([]);
  });

  test('renders a shared invitation without horizontal overflow at 320 pixels', async ({
    baseURL,
    page,
  }) => {
    await page.setViewportSize({
      width: 320,
      height: 800,
    });

    const pageErrors = monitorPageErrors(page);
    const applicationURL = requireBaseURL(baseURL);
    const sharedURL = createPortableInvitationURL(applicationURL, {
      eventTitle: 'Celebración móvil ✨',
      eventDate: '2027-11-06',
      location: 'Jardín del Centro · Oaxaca',
      message: 'Acompáñanos a compartir música, alegría y una noche inolvidable.',
      theme: 'champagne',
    });
    const response = await page.goto(sharedURL);

    expect(response).not.toBeNull();
    expect(response?.ok()).toBe(true);

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Una invitación para ti',
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('article', {
        name: 'Invitación compartida',
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', {
        name: 'Crear mi invitación',
      }),
    ).toBeVisible();

    const pageDimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));

    expect(pageDimensions.clientWidth).toBe(320);
    expect(pageDimensions.scrollWidth).toBeLessThanOrEqual(pageDimensions.clientWidth);
    expect(pageErrors).toEqual([]);
  });
});
