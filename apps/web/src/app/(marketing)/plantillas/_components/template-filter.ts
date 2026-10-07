const aliases = new Map([
  ['xv-anos', 'xv'],
  ['eventos-especiales', 'especiales'],
]);

export const normalizeCategory = (value: string) => aliases.get(value) ?? value;
const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim();

export function filterTemplates<T extends { categoryId: string; category: string; name: string }>(
  templates: readonly T[],
  category: string,
  search: string,
  order: string,
): T[] {
  const query = normalizeText(search);
  const filtered = templates.filter(
    (template) =>
      (!category || template.categoryId === category) &&
      (!query || normalizeText(`${template.name} ${template.category}`).includes(query)),
  );
  return order === 'nombre'
    ? filtered.sort((a, b) => a.name.localeCompare(b.name, 'es'))
    : filtered;
}
