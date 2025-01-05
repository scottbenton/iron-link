drop policy "Users can create notes if they are game players" on "public"."notes";

drop policy "Tracks can be deleted by game players" on "public"."game_tracks";

drop policy "Tracks can be inserted by game players" on "public"."game_tracks";

drop policy "Tracks can be updated by game players" on "public"."game_tracks";

drop policy "Users can create note folders if they are game players" on "public"."note_folders";

drop policy "Users can delete note folders if they are game players" on "public"."note_folders";

drop policy "Users can read note folders if they are game players" on "public"."note_folders";

drop policy "Users can update note folders if they are game players" on "public"."note_folders";

drop policy "Users can delete notes if they are game players" on "public"."notes";

drop policy "Users can read notes if they are game players" on "public"."notes";

drop policy "Users can update notes if they are game players" on "public"."notes";

create policy "Test"
on "public"."notes"
as permissive
for insert
to authenticated
with check (true);


create policy "Tracks can be deleted by game players"
on "public"."game_tracks"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = game_players.game_id)))));


create policy "Tracks can be inserted by game players"
on "public"."game_tracks"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = game_players.game_id)))));


create policy "Tracks can be updated by game players"
on "public"."game_tracks"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = game_players.game_id)))))
with check ((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = game_players.game_id)))));


create policy "Users can create note folders if they are game players"
on "public"."note_folders"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = auth.uid()) AND (game_players.game_id = note_folders.game_id)))));


create policy "Users can delete note folders if they are game players"
on "public"."note_folders"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = game_players.game_id)))));


create policy "Users can read note folders if they are game players"
on "public"."note_folders"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = game_players.game_id)))));


create policy "Users can update note folders if they are game players"
on "public"."note_folders"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = auth.uid()) AND (game_players.game_id = note_folders.game_id)))))
with check ((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.user_id = auth.uid()) AND (game_players.game_id = note_folders.game_id)))));


create policy "Users can delete notes if they are game players"
on "public"."notes"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM (game_players
     JOIN note_folders ON ((note_folders.id = note_folders.parent_folder_id)))
  WHERE ((game_players.user_id = auth.uid()) AND (game_players.game_id = note_folders.game_id)))));


create policy "Users can read notes if they are game players"
on "public"."notes"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (game_players
     JOIN note_folders ON ((note_folders.id = notes.parent_folder_id)))
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = note_folders.game_id)))));


create policy "Users can update notes if they are game players"
on "public"."notes"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM (game_players
     JOIN note_folders ON ((note_folders.id = notes.parent_folder_id)))
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = note_folders.game_id)))))
with check ((EXISTS ( SELECT 1
   FROM (game_players
     JOIN note_folders ON ((note_folders.id = notes.parent_folder_id)))
  WHERE ((game_players.user_id = ( SELECT auth.uid() AS uid)) AND (game_players.game_id = note_folders.game_id)))));



