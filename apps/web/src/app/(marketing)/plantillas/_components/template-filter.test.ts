import { describe, expect, it } from 'vitest';
import { filterTemplates, normalizeCategory } from './template-filter';

const templates = [
  { categoryId: 'bodas', category: 'Boda', name: 'Jardín Dorado' },
  { categoryId: 'xv', category: 'XV años', name: 'Rosa Eterna' },
] as const;
describe('Template filtering', () => {
  it('combines category and accent-insensitive search', () => {
    expect(filterTemplates(templates, 'bodas', 'JARDIN', '')).toEqual([templates[0]]);
    expect(filterTemplates(templates, 'xv', 'JARDIN', '')).toEqual([]);
  });
  it('normalizes existing occasion links and preserves the source order', () => {
    expect(normalizeCategory('xv-anos')).toBe('xv');
    expect(normalizeCategory('eventos-especiales')).toBe('especiales');
    expect(filterTemplates(templates, '', '', '')).toEqual(templates);
    expect(filterTemplates(templates, '', '', 'nombre').map(({ name }) => name)).toEqual([
      'Jardín Dorado',
      'Rosa Eterna',
    ]);
    expect(templates[0].name).toBe('Jardín Dorado');
  });
});
