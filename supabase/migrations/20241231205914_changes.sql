alter type "public"."note_read_permissions" rename to "note_read_permissions__old_version_to_be_dropped";

create type "public"."note_read_permissions" as enum ('only_author', 'only_guides', 'all_players', 'guides_and_author', 'public');

alter table "public"."note_folders" alter column read_permissions type "public"."note_read_permissions" using read_permissions::text::"public"."note_read_permissions";

alter table "public"."notes" alter column read_permissions type "public"."note_read_permissions" using read_permissions::text::"public"."note_read_permissions";

drop type "public"."note_read_permissions__old_version_to_be_dropped";

alter table "public"."notes" drop column "note_edit_permissions";

alter table "public"."notes" add column "edit_permissions" note_edit_permissions not null;

alter table "public"."notes" add column "order" numeric not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_user_details()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$DECLARE
    full_name text;
BEGIN
    INSERT INTO public.users (id, created_at)
    VALUES (
        NEW.id,
        now()
    );
    RETURN NEW;
END;$function$
;


