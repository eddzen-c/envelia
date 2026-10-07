'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { FormEvent } from 'react';

import { BotanicalDivider } from '../../_components/botanical-divider';
import { HelpIcon } from './help-icon';

const categories = [
  {
    id: 'start',
    title: 'Primeros pasos',
    description: 'Todo lo que necesitas para comenzar.',
    icon: 'document',
  },
  {
    id: 'edit',
    title: 'Edición y personalización',
    description: 'Aprende a darle tu toque único.',
    icon: 'edit',
  },
  {
    id: 'payment',
    title: 'Pagos y planes',
    description: 'Información sobre precios, pagos y facturación.',
    icon: 'payment',
  },
  {
    id: 'share',
    title: 'Envío y compartir',
    description: 'Cómo compartir tu invitación.',
    icon: 'send',
  },
] as const;

const questions = [
  {
    category: 'start',
    title: '¿Cómo funciona Envelia Studio?',
    answer:
      'Crea un proyecto en el estudio, personaliza los datos de tu evento y revisa la vista previa. Cuando esté listo, puedes compartirlo mediante un enlace portable.',
  },
  {
    category: 'edit',
    title: '¿Puedo personalizar las plantillas?',
    answer:
      'El estudio permite editar el título, la fecha, la ubicación, el mensaje y el tema de tu invitación. El catálogo público muestra diseños de inspiración; su aplicación automática al editor todavía no está disponible.',
  },
  {
    category: 'share',
    title: '¿Qué formatos recibo al finalizar?',
    answer:
      'Actualmente puedes compartir un enlace portable que abre la invitación en el navegador. No necesitas descargar un archivo. La exportación a PDF o imagen todavía no está disponible.',
  },
  {
    category: 'edit',
    title: '¿Cuánto tiempo tengo para editar mi invitación?',
    answer:
      'Puedes seguir editando tus proyectos locales mientras permanezcan guardados en este navegador. Evita borrar los datos del sitio: el almacenamiento local no se sincroniza todavía entre dispositivos.',
  },
  {
    category: 'payment',
    title: '¿Puedo hacer cambios después de la compra?',
    answer:
      'Los planes se presentan en la página de Precios, pero las compras todavía no están habilitadas. Puedes explorar el estudio local sin completar un pago.',
  },
  {
    category: 'share',
    title: '¿Cómo comparto mi invitación con mis invitados?',
    answer:
      'Abre tu proyecto en el estudio y utiliza sus controles de compartir. Copia el enlace y envíalo por el canal que prefieras. Si haces cambios después, genera y comparte un enlace nuevo: el anterior conserva su contenido original.',
  },
] as const;

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es');

export function HelpContent() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const filtered = questions.filter(
    (question) =>
      (!category || question.category === category) &&
      normalize(`${question.title} ${question.answer}`).includes(normalize(query.trim())),
  );

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCategory(null);
    setQuery(input);
    document
      .getElementById('preguntas-frecuentes')
      ?.scrollIntoView?.({ block: 'start', behavior: 'instant' });
  };

  return (
    <>
      <section
        aria-labelledby="help-title"
        className="relative isolate px-5 pt-28 pb-8 sm:px-8 lg:min-h-[30.5vw] lg:px-12"
      >
        <Image
          alt=""
          aria-hidden="true"
          className="-z-10 object-cover object-right"
          fill
          priority
          sizes="100vw"
          src="/assets/envelia/help/hero.webp"
        />
        <div className="mx-auto max-w-[90rem]">
          <div className="max-w-[36rem] rounded-2xl bg-surface/80 p-4 lg:ml-[6%] lg:w-[45%] lg:bg-transparent lg:p-0">
            <BotanicalDivider className="text-champagne-600" />
            <p className="mt-2 text-center text-[0.65rem] tracking-[0.35em] uppercase">
              Estamos para acompañarte
            </p>
            <h1
              className="mt-1 font-display text-[clamp(4rem,7vw,6.75rem)] leading-none font-semibold tracking-[-0.05em] text-primary"
              id="help-title"
            >
              Ayuda
            </h1>
            <p className="mt-2 font-display text-[clamp(1.4rem,2vw,2rem)] leading-tight font-semibold text-primary">
              Resuelve tus dudas y <em className="font-normal">disfruta del proceso.</em>
            </p>
            <p className="mt-2 font-display text-lg leading-6 text-foreground sm:text-xl">
              Encuentra aquí respuestas, guías y todo lo que necesitas para crear invitaciones
              digitales inolvidables.
            </p>
            <form
              aria-label="Buscar en Ayuda"
              className="mt-4 flex min-h-14 items-center gap-3 rounded-full border border-champagne-600 bg-surface/95 py-1 pr-1 pl-4"
              onSubmit={search}
            >
              <HelpIcon className="size-6 shrink-0 text-primary" name="search" />
              <label className="sr-only" htmlFor="help-search">
                ¿En qué podemos ayudarte?
              </label>
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-base"
                id="help-search"
                onChange={(event) => setInput(event.target.value)}
                placeholder="¿En qué podemos ayudarte?"
                type="search"
                value={input}
              />
              <button
                className="min-h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                type="submit"
              >
                Buscar
              </button>
            </form>
            <p className="mt-2 text-xs text-foreground/75">
              Ejemplos: editar una plantilla, realizar un pago, enviar mi invitación…
            </p>
          </div>
        </div>
      </section>
      <div className="relative isolate overflow-hidden">
        <Image
          alt=""
          aria-hidden="true"
          className="-z-10 object-cover object-bottom"
          fill
          sizes="100vw"
          src="/assets/envelia/help/background.webp"
        />
        <nav
          aria-label="Categorías de ayuda"
          className="mx-auto grid max-w-[90rem] gap-3 px-5 py-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-12"
        >
          {categories.map((item) => (
            <button
              aria-pressed={category === item.id}
              className="flex min-h-24 items-center gap-3 rounded-xl border border-champagne-200 bg-surface/90 p-3 text-left transition-colors hover:border-champagne-600 focus-visible:outline-primary"
              key={item.id}
              onClick={() => {
                setCategory(category === item.id ? null : item.id);
                setQuery('');
                setInput('');
              }}
              type="button"
            >
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#f5e8dc] text-champagne-700">
                <HelpIcon className="size-8" name={item.icon} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg leading-5 font-semibold text-primary">
                  {item.title}
                </span>
                <span className="mt-1 block text-sm leading-5 text-foreground/75">
                  {item.description}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="grid size-7 shrink-0 place-items-center rounded-full bg-[#f9e7e3] text-primary"
              >
                →
              </span>
            </button>
          ))}
        </nav>
        <div className="mx-auto grid max-w-[80rem] gap-6 px-5 pt-2 pb-8 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:px-12">
          <section aria-labelledby="faq-title" className="scroll-mt-24" id="preguntas-frecuentes">
            <BotanicalDivider className="text-champagne-600" />
            <p className="mt-1 text-center text-[0.65rem] tracking-[0.35em] text-champagne-700 uppercase">
              Preguntas frecuentes
            </p>
            <h2
              className="mt-1 text-center font-display text-3xl leading-tight font-semibold text-primary sm:text-4xl"
              id="faq-title"
            >
              Respuestas a las dudas <em className="font-normal">más comunes</em>
            </h2>
            <p className="mt-1 text-center font-display text-lg text-foreground/75">
              Hemos reunido las preguntas más frecuentes para ayudarte fácilmente.
            </p>
            {(query || category) && (
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <p aria-live="polite">
                  {filtered.length}{' '}
                  {filtered.length === 1 ? 'respuesta encontrada' : 'respuestas encontradas'}
                </p>
                <button
                  className="min-h-11 underline underline-offset-4 focus-visible:outline-primary"
                  onClick={() => {
                    setQuery('');
                    setInput('');
                    setCategory(null);
                  }}
                  type="button"
                >
                  Ver todas
                </button>
              </div>
            )}
            <div className="mt-3 space-y-1">
              {filtered.map((question) => (
                <details
                  className="group rounded-lg border border-champagne-200/70 bg-surface/95"
                  key={question.title}
                >
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-2 font-display text-lg text-primary focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                    {question.title}
                    <span aria-hidden="true" className="transition-transform group-open:rotate-180">
                      ⌄
                    </span>
                  </summary>
                  <p className="border-t border-champagne-200 px-4 py-3 text-sm leading-6 text-foreground/80">
                    {question.answer}
                  </p>
                </details>
              ))}
              {filtered.length === 0 && (
                <p className="rounded-xl bg-surface/95 p-5 text-sm leading-6">
                  No encontramos una respuesta con esos términos. Prueba otra palabra o selecciona
                  una categoría.
                </p>
              )}
            </div>
          </section>
          <section
            aria-labelledby="support-title"
            className="rounded-2xl border border-champagne-200/70 bg-surface/95 px-4 py-5 shadow-soft sm:px-5"
          >
            <BotanicalDivider className="text-champagne-600" />
            <h2
              className="mt-2 text-center font-display text-3xl font-semibold text-primary"
              id="support-title"
            >
              ¿Aún necesitas ayuda?
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-center font-display text-lg leading-6 text-foreground/75">
              Queremos acompañarte en cada paso de tu experiencia.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {[
                {
                  icon: 'chat',
                  title: 'Escríbenos',
                  text: 'El formulario de contacto estará disponible próximamente.',
                },
                {
                  icon: 'mail',
                  title: 'Envíanos un correo',
                  text: 'El correo oficial de soporte se anunciará aquí.',
                },
                {
                  icon: 'phone',
                  title: 'WhatsApp',
                  text: 'Este canal estará disponible próximamente.',
                },
              ].map((item) => (
                <div
                  className="rounded-xl border border-champagne-200 px-2 py-4 text-center"
                  key={item.title}
                >
                  <HelpIcon
                    className="mx-auto size-7 text-champagne-700"
                    name={item.icon as 'chat' | 'mail' | 'phone'}
                  />
                  <h3 className="mt-2 font-display text-lg font-semibold text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-foreground/75">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <BotanicalDivider className="text-champagne-600" />
              <blockquote className="mt-2 text-center font-display text-lg leading-6 text-primary italic">
                “Cada gran celebración comienza con una gran historia. Estamos aquí para ayudarte a
                contar la tuya.”
              </blockquote>
              <p className="mt-2 text-center text-sm text-foreground/70">
                — Equipo Envelia Studio —
              </p>
            </div>
            <Link
              className="mx-auto mt-4 block w-fit rounded-full border border-champagne-600 px-5 py-2 text-sm font-semibold text-primary focus-visible:outline-primary"
              href="/como-funciona"
            >
              Conoce cómo funciona →
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
