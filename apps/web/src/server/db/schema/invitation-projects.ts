import { sql } from 'drizzle-orm';
import {
  check,
  date,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import {
  invitationDraftLimits,
  invitationThemeIds,
} from '../../../features/invitation-draft/model/invitation-draft';
import {
  invitationProjectIdentityMaxLength,
  invitationProjectStatuses,
} from '../../../features/invitation-draft/model/invitation-project';

import { user } from './auth';

export const invitationProjectStatusEnum = pgEnum(
  'invitation_project_status',
  invitationProjectStatuses,
);

export const invitationThemeEnum = pgEnum('invitation_theme', invitationThemeIds);

export const invitationProjects = pgTable(
  'invitation_projects',
  {
    projectId: varchar('project_id', {
      length: invitationProjectIdentityMaxLength,
    }).primaryKey(),
    ownerId: text('owner_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    eventTitle: varchar('event_title', {
      length: invitationDraftLimits.eventTitle,
    }).notNull(),
    eventDate: date('event_date', {
      mode: 'string',
    }),
    location: varchar('location', {
      length: invitationDraftLimits.location,
    }).notNull(),
    message: varchar('message', {
      length: invitationDraftLimits.message,
    }).notNull(),
    theme: invitationThemeEnum('theme').notNull(),
    status: invitationProjectStatusEnum('status').notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      precision: 3,
      mode: 'date',
    }).notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      precision: 3,
      mode: 'date',
    }).notNull(),
    publicationId: varchar('publication_id', {
      length: invitationProjectIdentityMaxLength,
    }),
    publishedAt: timestamp('published_at', {
      withTimezone: true,
      precision: 3,
      mode: 'date',
    }),
    archivedAt: timestamp('archived_at', {
      withTimezone: true,
      precision: 3,
      mode: 'date',
    }),
  },
  (table) => [
    check(
      'invitation_projects_project_id_format_check',
      sql`${table.projectId} ~ '^[A-Za-z0-9][A-Za-z0-9_-]*$'`,
    ),
    check(
      'invitation_projects_owner_id_length_check',
      sql`char_length(${table.ownerId}) <= ${sql.raw(String(invitationProjectIdentityMaxLength))}`,
    ),
    check(
      'invitation_projects_owner_id_format_check',
      sql`${table.ownerId} ~ '^[A-Za-z0-9][A-Za-z0-9_-]*$'`,
    ),
    check(
      'invitation_projects_publication_id_format_check',
      sql`${table.publicationId} IS NULL OR ${table.publicationId} ~ '^[A-Za-z0-9][A-Za-z0-9_-]*$'`,
    ),
    check(
      'invitation_projects_lifecycle_check',
      sql`
        (
          ${table.status} = 'draft'
          AND ${table.publicationId} IS NULL
          AND ${table.publishedAt} IS NULL
          AND ${table.archivedAt} IS NULL
        )
        OR
        (
          ${table.status} = 'published'
          AND ${table.publicationId} IS NOT NULL
          AND ${table.publishedAt} IS NOT NULL
          AND ${table.archivedAt} IS NULL
        )
        OR
        (
          ${table.status} = 'archived'
          AND ${table.archivedAt} IS NOT NULL
          AND
          (
            (
              ${table.publicationId} IS NULL
              AND ${table.publishedAt} IS NULL
            )
            OR
            (
              ${table.publicationId} IS NOT NULL
              AND ${table.publishedAt} IS NOT NULL
            )
          )
        )
      `,
    ),
    check(
      'invitation_projects_updated_at_order_check',
      sql`${table.updatedAt} >= ${table.createdAt}`,
    ),
    check(
      'invitation_projects_published_at_order_check',
      sql`
        ${table.publishedAt} IS NULL
        OR
        (
          ${table.publishedAt} >= ${table.createdAt}
          AND ${table.publishedAt} <= ${table.updatedAt}
        )
      `,
    ),
    check(
      'invitation_projects_archived_at_order_check',
      sql`
        ${table.archivedAt} IS NULL
        OR
        (
          ${table.archivedAt} >= ${table.createdAt}
          AND ${table.archivedAt} <= ${table.updatedAt}
        )
      `,
    ),
    check(
      'invitation_projects_publication_archive_order_check',
      sql`
        ${table.publishedAt} IS NULL
        OR ${table.archivedAt} IS NULL
        OR ${table.publishedAt} <= ${table.archivedAt}
      `,
    ),
    index('invitation_projects_owner_status_updated_idx').on(
      table.ownerId,
      table.status,
      table.updatedAt,
    ),
    uniqueIndex('invitation_projects_publication_id_unique_idx').on(table.publicationId),
  ],
);

export type InvitationProjectRow = typeof invitationProjects.$inferSelect;

export type NewInvitationProjectRow = typeof invitationProjects.$inferInsert;
