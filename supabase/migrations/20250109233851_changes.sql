drop policy "Test" on "public"."notes";

drop policy "Users can delete notes if they are game players" on "public"."notes";

create policy "Users can insert notes if they are game players"
on "public"."notes"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM (game_players
     JOIN note_folders ON ((note_folders.game_id = game_players.game_id)))
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (note_folders.id = notes.parent_folder_id)))));


create policy "Users can delete notes if they are game players"
on "public"."notes"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM (game_players
     JOIN note_folders ON ((note_folders.game_id = game_players.game_id)))
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (note_folders.id = notes.parent_folder_id)))));



