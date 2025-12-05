-- Migration: Create pomodoro_sessions table
-- This table stores Pomodoro timer session history for tracking and statistics

create table if not exists pomodoro_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  task_id text,
  session_type text not null check (session_type in ('focus', 'short-break', 'long-break')),
  duration_minutes integer not null,
  completed_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now()
);

-- Create indexes for better query performance
create index if not exists idx_pomodoro_sessions_user_id on pomodoro_sessions(user_id);
create index if not exists idx_pomodoro_sessions_completed_at on pomodoro_sessions(completed_at);
create index if not exists idx_pomodoro_sessions_task_id on pomodoro_sessions(task_id);

-- Enable Row Level Security
alter table pomodoro_sessions enable row level security;

-- Create RLS policies
-- Users can only view their own sessions
create policy "Users can view own pomodoro sessions"
  on pomodoro_sessions for select
  using (auth.uid() = user_id);

-- Users can only insert their own sessions
create policy "Users can insert own pomodoro sessions"
  on pomodoro_sessions for insert
  with check (auth.uid() = user_id);

-- Users can update their own sessions
create policy "Users can update own pomodoro sessions"
  on pomodoro_sessions for update
  using (auth.uid() = user_id);

-- Users can delete their own sessions
create policy "Users can delete own pomodoro sessions"
  on pomodoro_sessions for delete
  using (auth.uid() = user_id);
