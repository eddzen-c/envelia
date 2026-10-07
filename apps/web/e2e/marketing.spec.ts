import { expect, test } from '@playwright/test';

const pages = [
  { path: '/', heading: /Bienvenida a\s+Envelia Studio/u },
  { path: '/plantillas', heading: /Diseños que cuentan\s+tu historia/u },
  { path: '/como-funciona', heading: /Cómo funciona\s+en Envelia Studio/u },
  { path: '/precios', heading: /Invitaciones tan\s+especiales como tu historia/u },
  { path: '/inspiracion', heading: /Ideas que hacen\s+momentos inolvidables/u },
  { path: '/ayuda', heading: 'Ayuda' },
  { path: '/contacto', heading: 'Contacto' },
] as const;

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 320, height: 900 },
]) {
  test.describe(`Public experience at ${viewport.width}px`, () => {
    test.use({ viewport });
    for (const destination of pages) {
      test(`${destination.path} renders with working images and no horizontal overflow`, async ({
        page,
      }) => {
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        const response = await page.goto(destination.path);
        expect(response?.ok()).toBe(true);
        await expect(
          page.getByRole('heading', { level: 1, name: destination.heading }),
        ).toBeVisible();
        await expect(page.getByRole('main')).toHaveCount(1);
        const images = page.locator('img');
        for (const image of await images.all()) {
          if (!(await image.isVisible())) {
            continue;
          }
          await image.scrollIntoViewIfNeeded();
          await expect
            .poll(() =>
              image.evaluate((element) => {
                const img = element as HTMLImageElement;
                return img.complete && img.naturalWidth > 0;
              }),
            )
            .toBe(true);
        }
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
        ).toBe(true);
        expect(errors).toEqual([]);
      });
    }
  });
}

test('navigates through the public header and account access', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Navegación principal', exact: true });
  await navigation.getByRole('link', { name: 'Plantillas', exact: true }).click();
  await expect(page).toHaveURL(/\/plantillas$/u);
  await page
    .getByRole('navigation', { name: 'Acceso a tu cuenta', exact: true })
    .getByRole('link', { name: 'Crear invitación' })
    .click();
  await expect(page).toHaveURL(/\/crear-cuenta$/u);
  await expect(page.getByRole('form', { name: 'Formulario para crear una cuenta' })).toBeVisible();
});

test('opens the mobile menu and follows a public destination', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/');
  await page.getByText('Menú', { exact: true }).click();
  await page
    .getByRole('navigation', { name: 'Navegación principal móvil' })
    .getByRole('link', { name: 'Precios' })
    .click();
  await expect(page).toHaveURL(/\/precios$/u);
});

test('filters and searches the actual template collection', async ({ page }) => {
  await page.goto('/plantillas');
  await page
    .getByRole('navigation', { name: 'Filtrar plantillas por ocasión' })
    .getByRole('link', { name: 'XV Años' })
    .click();
  await expect(page.getByRole('link', { name: /Explorar plantilla/u })).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Explorar plantilla Rosa Eterna' })).toBeVisible();
  await page.goto('/plantillas');
  await page.getByRole('searchbox', { name: 'Buscar plantillas' }).fill('jardin');
  await page.getByRole('searchbox', { name: 'Buscar plantillas' }).press('Enter');
  await expect(page.getByRole('link', { name: /Explorar plantilla/u })).toHaveCount(1);
  await page.getByRole('searchbox', { name: 'Buscar plantillas' }).fill('inexistente');
  await page.getByRole('searchbox', { name: 'Buscar plantillas' }).press('Enter');
  await expect(page.getByRole('status')).toContainText('No encontramos plantillas');
  await page.getByRole('link', { name: 'Ver todas las plantillas' }).click();
  await expect(page.getByRole('link', { name: /Explorar plantilla/u })).toHaveCount(5);
});

test('filters help questions and recovers from an empty search', async ({ page }) => {
  await page.goto('/ayuda');
  const questions = page.locator('main details');
  await expect(questions).toHaveCount(6);
  await page.getByRole('button', { name: /pagos y planes/i }).click();
  await expect(questions).toHaveCount(1);
  await page.getByRole('button', { name: 'Ver todas' }).click();
  await expect(questions).toHaveCount(6);
  await page.getByRole('searchbox').fill('inexistente');
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();
  await expect(page.getByText(/no encontramos una respuesta/i)).toBeVisible();
});

test('prepares contact mail without sending it and invalidates edited data', async ({ page }) => {
  await page.goto('/contacto');
  await page.getByRole('textbox', { name: 'Nombre completo' }).fill('Ana López');
  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('ana@example.com');
  await page.getByRole('combobox').selectOption('Crear mi invitación');
  await page
    .getByRole('textbox', { name: 'Tu mensaje' })
    .fill('Quiero crear una invitación para mi boda.');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByRole('status')).toContainText('Tu mensaje está preparado');
  await expect(page.getByRole('link', { name: /abrir mi correo/i })).toHaveAttribute(
    'href',
    /^mailto:hola@enveliastudio\.com\?/u,
  );
  await page
    .getByRole('textbox', { name: 'Tu mensaje' })
    .fill('He cambiado los detalles de mi consulta.');
  await expect(page.getByRole('status')).toHaveCount(0);
});

test('exposes real footer social links', async ({ page }) => {
  await page.goto('/');
  const social = page.getByRole('navigation', { name: 'Redes sociales' });
  for (const [name, href] of [
    ['Instagram', 'https://www.instagram.com/enveliastudio/'],
    ['Pinterest', 'https://www.pinterest.com/enveliastudio/'],
    ['Facebook', 'https://www.facebook.com/enveliastudio/'],
  ] as const) {
    await expect(social.getByRole('link', { name })).toHaveAttribute('href', href);
  }
});
