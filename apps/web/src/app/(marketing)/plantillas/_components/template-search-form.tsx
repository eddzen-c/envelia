'use client';

import type { ComponentProps } from 'react';

export function TemplateSearchForm(props: ComponentProps<'form'>) {
  return (
    <form
      {...props}
      action="/plantillas"
      method="get"
      onChange={(event) => {
        if (event.target instanceof HTMLSelectElement) {
          event.currentTarget.requestSubmit();
        }
      }}
    />
  );
}
