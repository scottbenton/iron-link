alter table "public"."game_tracks" add column "progress_track_type" progress_track_type not null default 'vow'::progress_track_type;

alter table "public"."game_tracks" add column "total_clock_segments" smallint not null default '0'::smallint;

-- add our table to the realtime publication
alter publication supabase_realtime add table assets;
alter publication supabase_realtime add table characters;
alter publication supabase_realtime add table game_logs;
alter publication supabase_realtime add table game_players;
alter publication supabase_realtime add table game_tracks;
alter publication supabase_realtime add table games;
alter publication supabase_realtime add table note_folders;
alter publication supabase_realtime add table notes;
alter publication supabase_realtime add table users;
