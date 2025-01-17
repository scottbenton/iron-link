create policy "All Game Players Can Delete"
on "public"."games"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM game_players
  WHERE ((game_players.game_id = games.id) AND (game_players.user_id = ( SELECT auth.uid() AS uid))))));



