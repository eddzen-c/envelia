'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { createContactMailto } from './contact-details';
import { ContactIcon } from './contact-icon';
import styles from '../contact.module.css';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [preparedMail, setPreparedMail] = useState<string | null>(null);

  const prepare = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPreparedMail(createContactMailto(name, email, topic, message));
  };

  return (
    <form
      aria-label="Envíanos un mensaje"
      className={styles.form}
      onSubmit={prepare}
      onChange={() => setPreparedMail(null)}
    >
      <div className={styles.fields}>
        <div>
          <label className="sr-only" htmlFor="contact-name">
            Nombre completo
          </label>
          <input
            autoComplete="name"
            id="contact-name"
            maxLength={80}
            name="name"
            onChange={(event) => setName(event.target.value)}
            placeholder="Nombre completo *"
            required
            value={name}
          />
        </div>
        <div>
          <label className="sr-only" htmlFor="contact-email">
            Correo electrónico
          </label>
          <input
            autoComplete="email"
            id="contact-email"
            maxLength={254}
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Correo electrónico *"
            required
            type="email"
            value={email}
          />
        </div>
      </div>
      <label className="sr-only" htmlFor="contact-topic">
        ¿En qué podemos ayudarte?
      </label>
      <select
        id="contact-topic"
        name="topic"
        onChange={(event) => setTopic(event.target.value)}
        required
        value={topic}
      >
        <option disabled value="">
          ¿En qué podemos ayudarte? *
        </option>
        <option>Crear mi invitación</option>
        <option>Edición y personalización</option>
        <option>Planes y precios</option>
        <option>Compartir mi invitación</option>
        <option>Otro tema</option>
      </select>
      <div className={styles.message}>
        <label className="sr-only" htmlFor="contact-message">
          Tu mensaje
        </label>
        <textarea
          aria-describedby="contact-counter"
          id="contact-message"
          maxLength={500}
          minLength={10}
          name="message"
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tu mensaje *"
          required
          rows={4}
          value={message}
        />
        <span id="contact-counter">{message.length}/500</span>
      </div>
      <button className={styles.primaryButton} type="submit">
        <ContactIcon name="send" />
        Enviar mensaje
      </button>
      <p className={styles.formNote}>El envío se completa desde tu aplicación de correo.</p>
      {preparedMail && (
        <div className={styles.feedback} role="status">
          <p>Tu mensaje está preparado. Abre tu correo para completar el envío.</p>
          <a className={styles.mailLink} href={preparedMail}>
            Abrir mi correo para enviar →
          </a>
        </div>
      )}
    </form>
  );
}
