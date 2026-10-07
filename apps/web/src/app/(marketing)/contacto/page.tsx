import Image from 'next/image';
import type { Metadata } from 'next';
import { BotanicalDivider } from '../_components/botanical-divider';
import { ContactForm } from './_components/contact-form';
import { contactDetails } from './_components/contact-details';
import { ContactIcon, SocialIcon } from './_components/contact-icon';
import styles from './contact.module.css';

export const metadata: Metadata = {
  title: 'Contacto | Envelia Studio',
  description:
    'Hablemos de tus momentos especiales. Contacta con Envelia Studio para resolver tus dudas y acompañarte en tu invitación.',
};

const benefits = [
  { icon: 'gem', text: 'Atención personalizada' },
  { icon: 'clock', text: 'Respuesta rápida' },
  { icon: 'heart', text: 'Te acompañamos en todo el proceso' },
  { icon: 'team', text: 'Un equipo apasionado' },
  { icon: 'leaf', text: 'Tu historia nos importa' },
] as const;

export default function ContactPage() {
  return (
    <main className={styles.page} id="main-content">
      <section aria-labelledby="contact-title" className={styles.hero}>
        <Image
          alt=""
          aria-hidden="true"
          className={styles.heroImage}
          fill
          priority
          sizes="100vw"
          src="/assets/envelia/contact/hero-supplied.webp"
        />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <BotanicalDivider className={styles.divider} />
            <p className={styles.eyebrow}>Estamos aquí para ti</p>
            <h1 id="contact-title">
              Contacto
              <ContactIcon name="leaf" />
            </h1>
            <p className={styles.subtitle}>Hablemos de tus momentos especiales.</p>
            <p className={styles.intro}>
              En Envelia Studio queremos acompañarte en cada paso. Si tienes preguntas, necesitas
              asesoría o simplemente quieres saludarnos, será un placer escucharte.
            </p>
          </div>
        </div>
      </section>
      <section aria-label="Comunícate con Envelia" className={styles.content}>
        <Image
          alt=""
          aria-hidden="true"
          className={styles.contentImage}
          width={2047}
          height={373}
          sizes="100vw"
          src="/assets/envelia/contact/background-supplied.webp"
        />
        <div className={styles.panels}>
          <section aria-labelledby="message-title" className={styles.panel}>
            <p className={styles.kicker}>
              <ContactIcon name="leaf" />
              Envíanos un mensaje
            </p>
            <h2 id="message-title">Cuéntanos cómo podemos ayudarte</h2>
            <p className={styles.panelIntro}>Completa el formulario y cuéntanos qué necesitas.</p>
            <ContactForm />
          </section>
          <section
            aria-labelledby="channels-title"
            className={`${styles.panel} ${styles.channelsPanel}`}
          >
            <h2 className={styles.kicker} id="channels-title">
              <ContactIcon name="leaf" />
              Otras formas de contactarnos
            </h2>
            <div className={styles.channels}>
              <div className={styles.channel}>
                <span className={styles.iconCircle}>
                  <ContactIcon name="mail" />
                </span>
                <h3>Correo electrónico</h3>
                <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
                <p>
                  Escríbenos tus preguntas.
                  <br />
                  Será un placer escucharte.
                </p>
              </div>
              <div className={styles.channel}>
                <span className={styles.iconCircle}>
                  <ContactIcon name="chat" />
                </span>
                <h3>WhatsApp</h3>
                <a href={contactDetails.whatsapp} rel="noopener noreferrer" target="_blank">
                  {contactDetails.phone}
                </a>
                <p>
                  Hablemos de tu evento
                  <br />y de tu invitación.
                </p>
              </div>
              <div className={styles.channel}>
                <span className={styles.iconCircle}>
                  <ContactIcon name="pin" />
                </span>
                <h3>Síguenos</h3>
                <p className={styles.handle}>@enveliastudio</p>
                <p>
                  Inspírate, descubre
                  <br />
                  novedades y más.
                </p>
                <div className={styles.socials}>
                  {(['instagram', 'pinterest', 'facebook'] as const).map((name) => (
                    <a
                      aria-label={`Envelia Studio en ${name}`}
                      href={contactDetails[name]}
                      key={name}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <SocialIcon name={name} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.appointment}>
              <Image
                alt=""
                aria-hidden="true"
                className={styles.appointmentImage}
                width={1896}
                height={829}
                sizes="(min-width: 1024px) 45vw, 100vw"
                src="/assets/envelia/contact/appointment-supplied.webp"
              />
              <span className={styles.iconCircle}>
                <ContactIcon name="calendar" />
              </span>
              <div className={styles.appointmentCopy}>
                <h3>¿Prefieres una asesoría personalizada?</h3>
                <p>
                  Solicita una cita virtual con nuestro equipo. Cuéntanos tus dudas y encontraremos
                  una fecha para conversar.
                </p>
                <a
                  className={styles.primaryButton}
                  href={`mailto:${contactDetails.email}?subject=${encodeURIComponent('Solicitud de asesoría personalizada')}`}
                >
                  <ContactIcon name="calendar" />
                  Agendar cita
                </a>
              </div>
            </div>
          </section>
        </div>
        <ul aria-label="Nuestro compromiso" className={styles.benefits}>
          {benefits.map((benefit) => (
            <li key={benefit.icon}>
              <span className={styles.iconCircle}>
                <ContactIcon name={benefit.icon} />
              </span>
              <span>{benefit.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
