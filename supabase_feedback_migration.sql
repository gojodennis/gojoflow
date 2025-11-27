-- Create the feedback table
create table feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  message text not null,
  user_email text,
  created_at timestamp with time zone default now(),
  metadata jsonb
);

-- Enable Row Level Security
alter table feedback enable row level security;

-- Policy: Users can insert their own feedback
create policy "Users can insert own feedback"
  on feedback for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Policy: Service role can read all feedback (for admin review)
create policy "Service role can read all feedback"
  on feedback for select
  to service_role
  using (true);

-- Add index for faster queries by user_id
create index feedback_user_id_idx on feedback(user_id);

-- Add index for faster queries by created_at
create index feedback_created_at_idx on feedback(created_at desc);
