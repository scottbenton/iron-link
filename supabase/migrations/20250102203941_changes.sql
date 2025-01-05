alter table "public"."game_logs" alter column "game_id" set not null;

alter table "public"."game_logs" alter column "guides_only" set not null;

alter table "public"."game_logs" alter column "user_id" drop default;

alter table "public"."note_folders" add column "game_id" uuid not null;

alter table "public"."game_logs" add constraint "game_logs_character_id_fkey1" FOREIGN KEY (character_id) REFERENCES characters(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."game_logs" validate constraint "game_logs_character_id_fkey1";

alter table "public"."game_logs" add constraint "game_logs_game_id_fkey1" FOREIGN KEY (game_id) REFERENCES games(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."game_logs" validate constraint "game_logs_game_id_fkey1";

alter table "public"."game_logs" add constraint "game_logs_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."game_logs" validate constraint "game_logs_user_id_fkey1";

alter table "public"."note_folders" add constraint "note_folders_game_id_fkey" FOREIGN KEY (game_id) REFERENCES games(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."note_folders" validate constraint "note_folders_game_id_fkey";


