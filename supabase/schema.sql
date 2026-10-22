-- Breiz: reader profiles and comments.
-- Paste this whole file into Supabase → SQL Editor → New query, then click "Run".
-- It is safe to run only once on a new project.

-- 1. Tables ------------------------------------------------------------------

-- The name each reader shows under their comments.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 2 and 40),
  created_at timestamptz not null default now()
);

-- People allowed to hide and delete any comment. Only you can add people here
-- (from the SQL Editor), never the readers themselves.
create table public.moderators (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create table public.comments (
  id bigint generated always as identity primary key,
  article_id text not null,
  user_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 2000),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index comments_article_idx on public.comments (article_id, created_at);

-- "Report this comment" clicks: one per reader per comment.
create table public.comment_reports (
  comment_id bigint not null references public.comments (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

-- 2. Helpers -----------------------------------------------------------------

create function public.is_moderator() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.moderators where user_id = (select auth.uid()));
$$;

-- Anti-spam: at most 5 comments per reader every 10 minutes.
create function public.limit_comment_rate() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.comments
      where user_id = new.user_id and created_at > now() - interval '10 minutes') >= 5 then
    raise exception 'too_many_comments';
  end if;
  return new;
end;
$$;

create trigger comments_rate_limit
  before insert on public.comments
  for each row execute function public.limit_comment_rate();

-- 3. Who can do what (row level security) ------------------------------------

alter table public.profiles enable row level security;
alter table public.moderators enable row level security;
alter table public.comments enable row level security;
alter table public.comment_reports enable row level security;

-- Profiles: names are public; each reader manages only their own.
create policy "Profiles are public" on public.profiles
  for select using (true);
create policy "Readers create their own profile" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);
create policy "Readers update their own profile" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
revoke update on public.profiles from anon, authenticated;
grant update (display_name) on public.profiles to authenticated;

-- Moderators: a reader can only check whether they are one.
create policy "Readers see their own moderator status" on public.moderators
  for select to authenticated using ((select auth.uid()) = user_id);

-- Comments: visible ones are public; readers write and delete their own;
-- moderators can hide, show again, and delete any comment.
create policy "Visible comments are public" on public.comments
  for select using (not hidden or public.is_moderator());
create policy "Readers write their own comments" on public.comments
  for insert to authenticated with check ((select auth.uid()) = user_id and not hidden);
create policy "Moderators hide comments" on public.comments
  for update to authenticated using (public.is_moderator()) with check (public.is_moderator());
create policy "Authors and moderators delete comments" on public.comments
  for delete to authenticated using ((select auth.uid()) = user_id or public.is_moderator());
revoke update on public.comments from anon, authenticated;
grant update (hidden) on public.comments to authenticated;

-- Reports: readers report as themselves; only moderators read reports.
create policy "Readers report comments" on public.comment_reports
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Moderators read reports" on public.comment_reports
  for select to authenticated using (public.is_moderator());
