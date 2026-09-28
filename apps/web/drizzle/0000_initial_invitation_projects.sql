CREATE TYPE "public"."invitation_project_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."invitation_theme" AS ENUM('lavender', 'champagne', 'midnight');--> statement-breakpoint
CREATE TABLE "invitation_projects" (
	"project_id" varchar(128) PRIMARY KEY NOT NULL,
	"owner_id" varchar(128) NOT NULL,
	"event_title" varchar(80) NOT NULL,
	"event_date" date,
	"location" varchar(120) NOT NULL,
	"message" varchar(280) NOT NULL,
	"theme" "invitation_theme" NOT NULL,
	"status" "invitation_project_status" NOT NULL,
	"created_at" timestamp (3) with time zone NOT NULL,
	"updated_at" timestamp (3) with time zone NOT NULL,
	"publication_id" varchar(128),
	"published_at" timestamp (3) with time zone,
	"archived_at" timestamp (3) with time zone,
	CONSTRAINT "invitation_projects_project_id_format_check" CHECK ("invitation_projects"."project_id" ~ '^[A-Za-z0-9][A-Za-z0-9_-]*$'),
	CONSTRAINT "invitation_projects_owner_id_format_check" CHECK ("invitation_projects"."owner_id" ~ '^[A-Za-z0-9][A-Za-z0-9_-]*$'),
	CONSTRAINT "invitation_projects_publication_id_format_check" CHECK ("invitation_projects"."publication_id" IS NULL OR "invitation_projects"."publication_id" ~ '^[A-Za-z0-9][A-Za-z0-9_-]*$'),
	CONSTRAINT "invitation_projects_lifecycle_check" CHECK (
        (
          "invitation_projects"."status" = 'draft'
          AND "invitation_projects"."publication_id" IS NULL
          AND "invitation_projects"."published_at" IS NULL
          AND "invitation_projects"."archived_at" IS NULL
        )
        OR
        (
          "invitation_projects"."status" = 'published'
          AND "invitation_projects"."publication_id" IS NOT NULL
          AND "invitation_projects"."published_at" IS NOT NULL
          AND "invitation_projects"."archived_at" IS NULL
        )
        OR
        (
          "invitation_projects"."status" = 'archived'
          AND "invitation_projects"."archived_at" IS NOT NULL
          AND
          (
            (
              "invitation_projects"."publication_id" IS NULL
              AND "invitation_projects"."published_at" IS NULL
            )
            OR
            (
              "invitation_projects"."publication_id" IS NOT NULL
              AND "invitation_projects"."published_at" IS NOT NULL
            )
          )
        )
      ),
	CONSTRAINT "invitation_projects_updated_at_order_check" CHECK ("invitation_projects"."updated_at" >= "invitation_projects"."created_at"),
	CONSTRAINT "invitation_projects_published_at_order_check" CHECK (
        "invitation_projects"."published_at" IS NULL
        OR
        (
          "invitation_projects"."published_at" >= "invitation_projects"."created_at"
          AND "invitation_projects"."published_at" <= "invitation_projects"."updated_at"
        )
      ),
	CONSTRAINT "invitation_projects_archived_at_order_check" CHECK (
        "invitation_projects"."archived_at" IS NULL
        OR
        (
          "invitation_projects"."archived_at" >= "invitation_projects"."created_at"
          AND "invitation_projects"."archived_at" <= "invitation_projects"."updated_at"
        )
      ),
	CONSTRAINT "invitation_projects_publication_archive_order_check" CHECK (
        "invitation_projects"."published_at" IS NULL
        OR "invitation_projects"."archived_at" IS NULL
        OR "invitation_projects"."published_at" <= "invitation_projects"."archived_at"
      )
);
--> statement-breakpoint
CREATE INDEX "invitation_projects_owner_status_updated_idx" ON "invitation_projects" USING btree ("owner_id","status","updated_at");--> statement-breakpoint
CREATE UNIQUE INDEX "invitation_projects_publication_id_unique_idx" ON "invitation_projects" USING btree ("publication_id");