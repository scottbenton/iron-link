create type "public"."character_initiative_status" as enum ('has_initiative', 'no_initiative', 'out_of_combat');

create type "public"."clock_oracle_key" as enum ('almost_certain', 'likely', 'fifty_fifty', 'unlikely', 'small_chance');

create type "public"."game_log_type" as enum ('stat_roll', 'oracle_table_roll', 'track_progress_roll', 'special_track_progress_roll', 'clock_progression_roll');

create type "public"."game_type" as enum ('solo', 'co-op', 'guided');

create type "public"."note_edit_permissions" as enum ('only_author', 'only_guides', 'guides_and_author', 'all_players');

create type "public"."note_read_permissions" as enum ('only_author', 'only_guides', 'all_players', 'guidse_and_author', 'public');

create type "public"."player_role" as enum ('guide', 'player');

create type "public"."progress_track_difficulty" as enum ('troublesome', 'dangerous', 'formidable', 'extreme', 'epic');

create type "public"."progress_track_type" as enum ('vow', 'journey', 'combat');

create type "public"."track_type" as enum ('progress_track', 'scene_challenge', 'clock');

create table "public"."assets" (
    "id" uuid not null default gen_random_uuid(),
    "game_id" uuid,
    "datasworn_asset_id" character varying not null,
    "enabled_abilities" jsonb not null default '{}'::jsonb,
    "option_values" jsonb not null default '{}'::jsonb,
    "control_values" jsonb not null default '{}'::jsonb,
    "order" numeric not null,
    "created_at" timestamp with time zone not null default now(),
    "character_id" uuid
);


alter table "public"."assets" enable row level security;

create table "public"."characters" (
    "uid" uuid not null,
    "game_id" uuid,
    "name" character varying not null,
    "stat_values" jsonb not null default '{}'::jsonb,
    "condition_meter_values" jsonb not null default '{}'::jsonb,
    "initiative_status" character_initiative_status not null default 'out_of_combat'::character_initiative_status,
    "special_track_values" jsonb not null default '{}'::jsonb,
    "impact_values" jsonb not null default '{}'::jsonb,
    "momentum" smallint not null default '0'::smallint,
    "adds" smallint not null default '0'::smallint,
    "unspent_experience" smallint not null default '0'::smallint,
    "color_scheme" character varying,
    "portrait_filename" character varying,
    "portrait_position_x" numeric,
    "portrait_position_y" numeric,
    "portrait_scale" numeric,
    "created_at" timestamp with time zone not null default now(),
    "id" uuid not null default gen_random_uuid()
);


alter table "public"."characters" enable row level security;

create table "public"."game_logs" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid default gen_random_uuid(),
    "character_id" uuid,
    "type" game_log_type not null,
    "guides_only" boolean default false,
    "log_data" jsonb not null default '{}'::jsonb,
    "created_at" timestamp with time zone not null default now(),
    "game_id" uuid
);


alter table "public"."game_logs" enable row level security;

create table "public"."game_players" (
    "user_id" uuid not null,
    "game_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "role" player_role not null default 'player'::player_role
);


alter table "public"."game_players" enable row level security;

create table "public"."game_tracks" (
    "id" uuid not null default gen_random_uuid(),
    "game_id" uuid not null default gen_random_uuid(),
    "label" character varying not null,
    "type" track_type not null,
    "description" character varying,
    "completed_ticks" smallint not null default '0'::smallint,
    "is_completed" boolean not null default false,
    "completed_clock_segments" smallint not null default '0'::smallint,
    "track_difficulty" progress_track_difficulty not null,
    "clock_oracle_key" clock_oracle_key not null default 'likely'::clock_oracle_key,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."game_tracks" enable row level security;

create table "public"."games" (
    "id" uuid not null default gen_random_uuid(),
    "name" character varying not null,
    "game_type" game_type not null,
    "condition_meter_values" jsonb not null default '{}'::jsonb,
    "special_track_values" jsonb not null default '{}'::jsonb,
    "rulesets" jsonb not null default '{}'::jsonb,
    "expansions" jsonb not null default '{}'::jsonb,
    "color_scheme" character varying,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."games" enable row level security;

create table "public"."note_folders" (
    "id" uuid not null default gen_random_uuid(),
    "author_id" uuid not null,
    "is_root_player_folder" boolean not null default false,
    "parent_folder_id" uuid default gen_random_uuid(),
    "name" character varying,
    "order" numeric not null,
    "read_permissions" note_read_permissions not null,
    "edit_permissions" note_edit_permissions not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."note_folders" enable row level security;

create table "public"."notes" (
    "id" uuid not null default gen_random_uuid(),
    "author_id" uuid not null,
    "parent_folder_id" uuid not null,
    "title" character varying,
    "read_permissions" note_read_permissions not null,
    "note_edit_permissions" note_edit_permissions not null,
    "created_at" timestamp with time zone not null default now(),
    "note_content_text" character varying,
    "note_content_bytes" bytea
);


alter table "public"."notes" enable row level security;

create table "public"."users" (
    "id" uuid not null,
    "display_name" character varying,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX assets_pkey ON public.assets USING btree (id);

CREATE UNIQUE INDEX characters_pkey ON public.characters USING btree (id);

CREATE UNIQUE INDEX game_logs_pkey ON public.game_logs USING btree (id);

CREATE UNIQUE INDEX game_players_pkey ON public.game_players USING btree (user_id, game_id);

CREATE UNIQUE INDEX game_tracks_pkey ON public.game_tracks USING btree (id);

CREATE UNIQUE INDEX games_pkey ON public.games USING btree (id);

CREATE UNIQUE INDEX note_folders_pkey ON public.note_folders USING btree (id);

CREATE UNIQUE INDEX notes_pkey ON public.notes USING btree (id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."assets" add constraint "assets_pkey" PRIMARY KEY using index "assets_pkey";

alter table "public"."characters" add constraint "characters_pkey" PRIMARY KEY using index "characters_pkey";

alter table "public"."game_logs" add constraint "game_logs_pkey" PRIMARY KEY using index "game_logs_pkey";

alter table "public"."game_players" add constraint "game_players_pkey" PRIMARY KEY using index "game_players_pkey";

alter table "public"."game_tracks" add constraint "game_tracks_pkey" PRIMARY KEY using index "game_tracks_pkey";

alter table "public"."games" add constraint "games_pkey" PRIMARY KEY using index "games_pkey";

alter table "public"."note_folders" add constraint "note_folders_pkey" PRIMARY KEY using index "note_folders_pkey";

alter table "public"."notes" add constraint "notes_pkey" PRIMARY KEY using index "notes_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."assets" add constraint "assets_character_id_fkey" FOREIGN KEY (character_id) REFERENCES characters(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."assets" validate constraint "assets_character_id_fkey";

alter table "public"."assets" add constraint "assets_game_id_fkey" FOREIGN KEY (game_id) REFERENCES games(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."assets" validate constraint "assets_game_id_fkey";

alter table "public"."characters" add constraint "characters_game_id_fkey" FOREIGN KEY (game_id) REFERENCES games(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."characters" validate constraint "characters_game_id_fkey";

alter table "public"."characters" add constraint "characters_uid_fkey" FOREIGN KEY (uid) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."characters" validate constraint "characters_uid_fkey";

alter table "public"."game_logs" add constraint "game_logs_character_id_fkey" FOREIGN KEY (character_id) REFERENCES characters(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."game_logs" validate constraint "game_logs_character_id_fkey";

alter table "public"."game_logs" add constraint "game_logs_game_id_fkey" FOREIGN KEY (game_id) REFERENCES games(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."game_logs" validate constraint "game_logs_game_id_fkey";

alter table "public"."game_logs" add constraint "game_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."game_logs" validate constraint "game_logs_user_id_fkey";

alter table "public"."game_players" add constraint "game_players_game_id_fkey" FOREIGN KEY (game_id) REFERENCES games(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."game_players" validate constraint "game_players_game_id_fkey";

alter table "public"."game_players" add constraint "game_players_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."game_players" validate constraint "game_players_user_id_fkey";

alter table "public"."game_tracks" add constraint "game_tracks_game_id_fkey" FOREIGN KEY (game_id) REFERENCES games(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."game_tracks" validate constraint "game_tracks_game_id_fkey";

alter table "public"."note_folders" add constraint "note_folders_author_id_fkey" FOREIGN KEY (author_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."note_folders" validate constraint "note_folders_author_id_fkey";

alter table "public"."note_folders" add constraint "note_folders_parent_folder_id_fkey" FOREIGN KEY (parent_folder_id) REFERENCES note_folders(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."note_folders" validate constraint "note_folders_parent_folder_id_fkey";

alter table "public"."notes" add constraint "notes_author_id_fkey" FOREIGN KEY (author_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notes" validate constraint "notes_author_id_fkey";

alter table "public"."notes" add constraint "notes_parent_folder_id_fkey" FOREIGN KEY (parent_folder_id) REFERENCES note_folders(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notes" validate constraint "notes_parent_folder_id_fkey";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_user_details()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    full_name text;
BEGIN
    -- Construct the display_name based on the presence of first_name and last_name
    full_name := CASE
        WHEN NEW.first_name IS NOT NULL AND NEW.last_name IS NOT NULL THEN
            CONCAT(NEW.first_name, ' ', NEW.last_name)
        WHEN NEW.first_name IS NOT NULL THEN
            NEW.first_name
        WHEN NEW.last_name IS NOT NULL THEN
            NEW.last_name
        ELSE
            NULL  -- or you can set it to an empty string if preferred
    END;

    INSERT INTO public.user (id, display_name, created_at)
    VALUES (
        NEW.id,
        full_name,  -- Use the constructed full_name
        now()
    );
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."assets" to "anon";

grant insert on table "public"."assets" to "anon";

grant references on table "public"."assets" to "anon";

grant select on table "public"."assets" to "anon";

grant trigger on table "public"."assets" to "anon";

grant truncate on table "public"."assets" to "anon";

grant update on table "public"."assets" to "anon";

grant delete on table "public"."assets" to "authenticated";

grant insert on table "public"."assets" to "authenticated";

grant references on table "public"."assets" to "authenticated";

grant select on table "public"."assets" to "authenticated";

grant trigger on table "public"."assets" to "authenticated";

grant truncate on table "public"."assets" to "authenticated";

grant update on table "public"."assets" to "authenticated";

grant delete on table "public"."assets" to "service_role";

grant insert on table "public"."assets" to "service_role";

grant references on table "public"."assets" to "service_role";

grant select on table "public"."assets" to "service_role";

grant trigger on table "public"."assets" to "service_role";

grant truncate on table "public"."assets" to "service_role";

grant update on table "public"."assets" to "service_role";

grant delete on table "public"."characters" to "anon";

grant insert on table "public"."characters" to "anon";

grant references on table "public"."characters" to "anon";

grant select on table "public"."characters" to "anon";

grant trigger on table "public"."characters" to "anon";

grant truncate on table "public"."characters" to "anon";

grant update on table "public"."characters" to "anon";

grant delete on table "public"."characters" to "authenticated";

grant insert on table "public"."characters" to "authenticated";

grant references on table "public"."characters" to "authenticated";

grant select on table "public"."characters" to "authenticated";

grant trigger on table "public"."characters" to "authenticated";

grant truncate on table "public"."characters" to "authenticated";

grant update on table "public"."characters" to "authenticated";

grant delete on table "public"."characters" to "service_role";

grant insert on table "public"."characters" to "service_role";

grant references on table "public"."characters" to "service_role";

grant select on table "public"."characters" to "service_role";

grant trigger on table "public"."characters" to "service_role";

grant truncate on table "public"."characters" to "service_role";

grant update on table "public"."characters" to "service_role";

grant delete on table "public"."game_logs" to "anon";

grant insert on table "public"."game_logs" to "anon";

grant references on table "public"."game_logs" to "anon";

grant select on table "public"."game_logs" to "anon";

grant trigger on table "public"."game_logs" to "anon";

grant truncate on table "public"."game_logs" to "anon";

grant update on table "public"."game_logs" to "anon";

grant delete on table "public"."game_logs" to "authenticated";

grant insert on table "public"."game_logs" to "authenticated";

grant references on table "public"."game_logs" to "authenticated";

grant select on table "public"."game_logs" to "authenticated";

grant trigger on table "public"."game_logs" to "authenticated";

grant truncate on table "public"."game_logs" to "authenticated";

grant update on table "public"."game_logs" to "authenticated";

grant delete on table "public"."game_logs" to "service_role";

grant insert on table "public"."game_logs" to "service_role";

grant references on table "public"."game_logs" to "service_role";

grant select on table "public"."game_logs" to "service_role";

grant trigger on table "public"."game_logs" to "service_role";

grant truncate on table "public"."game_logs" to "service_role";

grant update on table "public"."game_logs" to "service_role";

grant delete on table "public"."game_players" to "anon";

grant insert on table "public"."game_players" to "anon";

grant references on table "public"."game_players" to "anon";

grant select on table "public"."game_players" to "anon";

grant trigger on table "public"."game_players" to "anon";

grant truncate on table "public"."game_players" to "anon";

grant update on table "public"."game_players" to "anon";

grant delete on table "public"."game_players" to "authenticated";

grant insert on table "public"."game_players" to "authenticated";

grant references on table "public"."game_players" to "authenticated";

grant select on table "public"."game_players" to "authenticated";

grant trigger on table "public"."game_players" to "authenticated";

grant truncate on table "public"."game_players" to "authenticated";

grant update on table "public"."game_players" to "authenticated";

grant delete on table "public"."game_players" to "service_role";

grant insert on table "public"."game_players" to "service_role";

grant references on table "public"."game_players" to "service_role";

grant select on table "public"."game_players" to "service_role";

grant trigger on table "public"."game_players" to "service_role";

grant truncate on table "public"."game_players" to "service_role";

grant update on table "public"."game_players" to "service_role";

grant delete on table "public"."game_tracks" to "anon";

grant insert on table "public"."game_tracks" to "anon";

grant references on table "public"."game_tracks" to "anon";

grant select on table "public"."game_tracks" to "anon";

grant trigger on table "public"."game_tracks" to "anon";

grant truncate on table "public"."game_tracks" to "anon";

grant update on table "public"."game_tracks" to "anon";

grant delete on table "public"."game_tracks" to "authenticated";

grant insert on table "public"."game_tracks" to "authenticated";

grant references on table "public"."game_tracks" to "authenticated";

grant select on table "public"."game_tracks" to "authenticated";

grant trigger on table "public"."game_tracks" to "authenticated";

grant truncate on table "public"."game_tracks" to "authenticated";

grant update on table "public"."game_tracks" to "authenticated";

grant delete on table "public"."game_tracks" to "service_role";

grant insert on table "public"."game_tracks" to "service_role";

grant references on table "public"."game_tracks" to "service_role";

grant select on table "public"."game_tracks" to "service_role";

grant trigger on table "public"."game_tracks" to "service_role";

grant truncate on table "public"."game_tracks" to "service_role";

grant update on table "public"."game_tracks" to "service_role";

grant delete on table "public"."games" to "anon";

grant insert on table "public"."games" to "anon";

grant references on table "public"."games" to "anon";

grant select on table "public"."games" to "anon";

grant trigger on table "public"."games" to "anon";

grant truncate on table "public"."games" to "anon";

grant update on table "public"."games" to "anon";

grant delete on table "public"."games" to "authenticated";

grant insert on table "public"."games" to "authenticated";

grant references on table "public"."games" to "authenticated";

grant select on table "public"."games" to "authenticated";

grant trigger on table "public"."games" to "authenticated";

grant truncate on table "public"."games" to "authenticated";

grant update on table "public"."games" to "authenticated";

grant delete on table "public"."games" to "service_role";

grant insert on table "public"."games" to "service_role";

grant references on table "public"."games" to "service_role";

grant select on table "public"."games" to "service_role";

grant trigger on table "public"."games" to "service_role";

grant truncate on table "public"."games" to "service_role";

grant update on table "public"."games" to "service_role";

grant delete on table "public"."note_folders" to "anon";

grant insert on table "public"."note_folders" to "anon";

grant references on table "public"."note_folders" to "anon";

grant select on table "public"."note_folders" to "anon";

grant trigger on table "public"."note_folders" to "anon";

grant truncate on table "public"."note_folders" to "anon";

grant update on table "public"."note_folders" to "anon";

grant delete on table "public"."note_folders" to "authenticated";

grant insert on table "public"."note_folders" to "authenticated";

grant references on table "public"."note_folders" to "authenticated";

grant select on table "public"."note_folders" to "authenticated";

grant trigger on table "public"."note_folders" to "authenticated";

grant truncate on table "public"."note_folders" to "authenticated";

grant update on table "public"."note_folders" to "authenticated";

grant delete on table "public"."note_folders" to "service_role";

grant insert on table "public"."note_folders" to "service_role";

grant references on table "public"."note_folders" to "service_role";

grant select on table "public"."note_folders" to "service_role";

grant trigger on table "public"."note_folders" to "service_role";

grant truncate on table "public"."note_folders" to "service_role";

grant update on table "public"."note_folders" to "service_role";

grant delete on table "public"."notes" to "anon";

grant insert on table "public"."notes" to "anon";

grant references on table "public"."notes" to "anon";

grant select on table "public"."notes" to "anon";

grant trigger on table "public"."notes" to "anon";

grant truncate on table "public"."notes" to "anon";

grant update on table "public"."notes" to "anon";

grant delete on table "public"."notes" to "authenticated";

grant insert on table "public"."notes" to "authenticated";

grant references on table "public"."notes" to "authenticated";

grant select on table "public"."notes" to "authenticated";

grant trigger on table "public"."notes" to "authenticated";

grant truncate on table "public"."notes" to "authenticated";

grant update on table "public"."notes" to "authenticated";

grant delete on table "public"."notes" to "service_role";

grant insert on table "public"."notes" to "service_role";

grant references on table "public"."notes" to "service_role";

grant select on table "public"."notes" to "service_role";

grant trigger on table "public"."notes" to "service_role";

grant truncate on table "public"."notes" to "service_role";

grant update on table "public"."notes" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

create policy "Allow character asset deletion"
on "public"."assets"
as permissive
for delete
to authenticated
using (((character_id IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = assets.character_id) AND (characters.uid = ( SELECT auth.uid() AS uid)))))));


create policy "Allow character asset insertion"
on "public"."assets"
as permissive
for insert
to authenticated
with check (((character_id IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = assets.character_id) AND (characters.uid = ( SELECT auth.uid() AS uid)))))));


create policy "Allow character asset modification"
on "public"."assets"
as permissive
for update
to authenticated
using (((character_id IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = assets.character_id) AND (characters.uid = ( SELECT auth.uid() AS uid)))))))
with check (((character_id IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM characters
  WHERE ((characters.id = assets.character_id) AND (characters.uid = ( SELECT auth.uid() AS uid)))))));


create policy "Allow game asset deletion"
on "public"."assets"
as permissive
for delete
to authenticated
using (((game_id IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.game_id = assets.game_id) AND (game_players.user_id = ( SELECT auth.uid() AS uid)))))));


create policy "Allow game asset insertion"
on "public"."assets"
as permissive
for insert
to authenticated
with check (((game_id IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.game_id = assets.game_id) AND (game_players.user_id = ( SELECT auth.uid() AS uid)))))));


create policy "Allow game asset modification"
on "public"."assets"
as permissive
for update
to authenticated
using (((game_id IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.game_id = assets.game_id) AND (game_players.user_id = ( SELECT auth.uid() AS uid)))))))
with check (((game_id IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.game_id = assets.game_id) AND (game_players.user_id = ( SELECT auth.uid() AS uid)))))));


create policy "Enable read access for all users"
on "public"."assets"
as permissive
for select
to public
using (true);


create policy "Prevent invalid asset insertion"
on "public"."assets"
as permissive
for insert
to authenticated
with check ((((game_id IS NOT NULL) AND (character_id IS NULL)) OR ((game_id IS NULL) AND (character_id IS NOT NULL))));


create policy "Prevent invalid asset modification"
on "public"."assets"
as permissive
for update
to authenticated
using ((((game_id IS NOT NULL) AND (character_id IS NULL)) OR ((game_id IS NULL) AND (character_id IS NOT NULL))))
with check ((((game_id IS NOT NULL) AND (character_id IS NULL)) OR ((game_id IS NULL) AND (character_id IS NOT NULL))));


create policy "Any user can view characters"
on "public"."characters"
as permissive
for select
to authenticated, anon
using (true);


create policy "User can delete their own character"
on "public"."characters"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = uid));


create policy "User can insert their own character"
on "public"."characters"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = uid));


create policy "User or guide can update character"
on "public"."characters"
as permissive
for update
to authenticated
using (((( SELECT auth.uid() AS uid) = uid) OR (( SELECT auth.uid() AS uid) IN ( SELECT game_players.user_id
   FROM game_players
  WHERE ((game_players.game_id = characters.game_id) AND (game_players.role = 'guide'::player_role))))))
with check (((( SELECT auth.uid() AS uid) = uid) OR (( SELECT auth.uid() AS uid) IN ( SELECT game_players.user_id
   FROM game_players
  WHERE ((game_players.game_id = characters.game_id) AND (game_players.role = 'guide'::player_role))))));


create policy "Non guide-only logs are visible to any user, guide-only logs ca"
on "public"."game_logs"
as permissive
for select
to authenticated, anon
using (((guides_only = false) OR (EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = game_logs.game_id) AND (game_players.role = 'guide'::player_role))))));


create policy "Users can delete their own logs, guides can delete any log"
on "public"."game_logs"
as permissive
for delete
to authenticated
using (((user_id = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = game_logs.game_id) AND (game_players.role = 'guide'::player_role))))));


create policy "Users can insert logs if they are part of the game, guides can "
on "public"."game_logs"
as permissive
for insert
to authenticated
with check (((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = game_logs.game_id)))) AND ((guides_only = false) OR ((guides_only = true) AND (EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = game_logs.game_id) AND (game_players.role = 'guide'::player_role))))))));


create policy "Users can update logs if they are part of the game, guides can "
on "public"."game_logs"
as permissive
for update
to authenticated
using (((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = game_logs.game_id)))) AND ((guides_only = false) OR ((guides_only = true) AND (EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = game_logs.game_id) AND (game_players.role = 'guide'::player_role))))))))
with check (((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = game_logs.game_id)))) AND ((guides_only = false) OR ((guides_only = true) AND (EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = game_logs.game_id) AND (game_players.role = 'guide'::player_role))))))));


create policy "Enable deletes for users on their own records or by guides"
on "public"."game_players"
as permissive
for delete
to authenticated
using (((( SELECT auth.uid() AS uid) = user_id) OR (EXISTS ( SELECT 1
   FROM game_players gp
  WHERE ((gp.game_id = game_players.game_id) AND (gp.user_id = ( SELECT auth.uid() AS uid)) AND (gp.role = 'guide'::player_role))))));


create policy "Enable insert for users based on user_id"
on "public"."game_players"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable read access for all users"
on "public"."game_players"
as permissive
for select
to public
using (true);


create policy "Enable updates for users on their own records or by guides"
on "public"."game_players"
as permissive
for update
to authenticated
using (((( SELECT auth.uid() AS uid) = user_id) OR (EXISTS ( SELECT 1
   FROM game_players gp
  WHERE ((gp.game_id = game_players.game_id) AND (gp.user_id = ( SELECT auth.uid() AS uid)) AND (gp.role = 'guide'::player_role))))))
with check (((( SELECT auth.uid() AS uid) = user_id) OR (EXISTS ( SELECT 1
   FROM game_players gp
  WHERE ((gp.game_id = game_players.game_id) AND (gp.user_id = ( SELECT auth.uid() AS uid)) AND (gp.role = 'guide'::player_role))))));


create policy "Tracks are viewable by everyone"
on "public"."game_tracks"
as permissive
for select
to authenticated, anon
using (true);


create policy "Tracks can be deleted by game players"
on "public"."game_tracks"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = game_tracks.game_id)))));


create policy "Tracks can be inserted by game players"
on "public"."game_tracks"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = game_tracks.game_id)))));


create policy "Tracks can be updated by game players"
on "public"."game_tracks"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = game_tracks.game_id)))))
with check ((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = game_tracks.game_id)))));


create policy "Allow updates for users who are players in the game"
on "public"."games"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.game_id = games.id) AND (game_players.user_id = ( SELECT auth.uid() AS uid))))))
with check ((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.game_id = games.id) AND (game_players.user_id = ( SELECT auth.uid() AS uid))))));


create policy "Enable insert for authenticated users only"
on "public"."games"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."games"
as permissive
for select
to public
using (true);


create policy "Users can create note folders if they are game players"
on "public"."note_folders"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = note_folders.parent_folder_id)))));


create policy "Users can delete note folders if they are game players"
on "public"."note_folders"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = note_folders.parent_folder_id)))));


create policy "Users can read note folders if they are game players"
on "public"."note_folders"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = note_folders.parent_folder_id)))));


create policy "Users can update note folders if they are game players"
on "public"."note_folders"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = note_folders.parent_folder_id)))))
with check ((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = note_folders.parent_folder_id)))));


create policy "Users can create notes if they are game players"
on "public"."notes"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM (game_players
     JOIN note_folders ON ((note_folders.id = notes.parent_folder_id)))
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = note_folders.parent_folder_id)))));


create policy "Users can delete notes if they are game players"
on "public"."notes"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM (game_players
     JOIN note_folders ON ((note_folders.id = notes.parent_folder_id)))
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = note_folders.parent_folder_id)))));


create policy "Users can read notes if they are game players"
on "public"."notes"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (game_players
     JOIN note_folders ON ((note_folders.id = notes.parent_folder_id)))
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = note_folders.parent_folder_id)))));


create policy "Users can update notes if they are game players"
on "public"."notes"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM (game_players
     JOIN note_folders ON ((note_folders.id = notes.parent_folder_id)))
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = note_folders.parent_folder_id)))))
with check ((EXISTS ( SELECT 1
   FROM (game_players
     JOIN note_folders ON ((note_folders.id = notes.parent_folder_id)))
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = note_folders.parent_folder_id)))));


create policy "Enable read access for all users"
on "public"."users"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on id"
on "public"."users"
as permissive
for update
to authenticated
using (true)
with check ((( SELECT auth.uid() AS uid) = id));



