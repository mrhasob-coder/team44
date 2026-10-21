-- Story #37: refuse sign-ups from outside the university domain.
-- Run once in Supabase (SQL Editor -> New query -> Run). Safe to run again.
-- db/schema.sql already contains the same function for new projects.

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  -- Only university accounts (ku.edu.kw and its subdomains) may sign up (story #37).
  -- Raising here aborts the whole sign-up, so no auth user and no profile is kept.
  if new.email is null
     or lower(split_part(new.email, '@', 2)) !~ '(^|\.)ku\.edu\.kw$' then
    raise exception 'Only university email addresses (ku.edu.kw) can sign up'
      using errcode = 'check_violation';
  end if;

  insert into public.profiles (id, full_name, student_id, email)
  values (new.id,
          new.raw_user_meta_data ->> 'full_name',
          new.raw_user_meta_data ->> 'student_id',
          new.email);
  return new;
end;
$$;
