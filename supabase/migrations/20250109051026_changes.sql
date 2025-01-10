drop policy "Users can delete notes if they are game players" on "public"."notes";

drop policy "Users can read notes if they are game players" on "public"."notes";

drop policy "Users can update notes if they are game players" on "public"."notes";

alter table "public"."notes" add column "game_id" uuid not null;

alter table "public"."notes" add constraint "notes_game_id_fkey" FOREIGN KEY (game_id) REFERENCES games(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notes" validate constraint "notes_game_id_fkey";

create policy "Users can delete notes if they are game players"
on "public"."notes"
as permissive
for delete
to authenticated
using (true);


create policy "Users can read notes if they are game players"
on "public"."notes"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (game_players
     JOIN note_folders ON ((note_folders.game_id = game_players.game_id)))
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (note_folders.id = notes.parent_folder_id)))));


create policy "Users can update notes if they are game players"
on "public"."notes"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM (game_players
     JOIN note_folders ON ((note_folders.game_id = game_players.game_id)))
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (note_folders.id = notes.parent_folder_id)))))
with check ((EXISTS ( SELECT 1
   FROM (game_players
     JOIN note_folders ON ((note_folders.game_id = game_players.game_id)))
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (note_folders.id = notes.parent_folder_id)))));



