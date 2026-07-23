-- Divine Awakening Leadership Portal — Supabase Schema
-- Run this in Supabase SQL Editor (Project > SQL Editor > New Query)

create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('admin','coach','participant')) default 'participant',
  participant_name text,
  created_at timestamp with time zone default now()
);

create table if not exists roster (
  id uuid primary key default uuid_generate_v4(),
  participant text unique not null,
  cohort_start date,
  mentor text,
  rotation text,
  stage text default 'Apprentice',
  active_status text default 'Active',
  created_at timestamp with time zone default now()
);

create table if not exists non_negotiables (
  id uuid primary key default uuid_generate_v4(),
  participant text not null references roster(participant),
  quarter text not null,
  month_label text,
  ritual_compliance numeric,
  wheel_of_life text,
  meeting_attendance numeric,
  deadline_compliance numeric,
  exception_context text,
  coach_verified text default 'No',
  created_at timestamp with time zone default now()
);

create table if not exists milestones (
  id uuid primary key default uuid_generate_v4(),
  participant text not null references roster(participant),
  milestone text not null,
  target_quarter text,
  status text default 'Not Started',
  completion_date date,
  evidence_notes text,
  coach_verified text default 'No',
  mandatory boolean default true,
  created_at timestamp with time zone default now()
);

create table if not exists quarterly_assessments (
  id uuid primary key default uuid_generate_v4(),
  participant text not null references roster(participant),
  quarter text not null,
  self_leadership_self int, self_leadership_peer int, self_leadership_coach int,
  learning_self int, learning_peer int, learning_coach int,
  facilitation_self int, facilitation_peer int, facilitation_coach int,
  transformation_self int, transformation_peer int, transformation_coach int,
  operations_self int, operations_peer int, operations_coach int,
  retreat_self int, retreat_peer int, retreat_coach int,
  culture_self int, culture_peer int, culture_coach int,
  contribution_self int, contribution_peer int, contribution_coach int,
  all_non_negotiables_met text default 'No',
  culture_gate_clear text default 'No',
  evidence_complete text default 'No',
  remediation_active text default 'No',
  notes text,
  composite numeric,
  status text,
  head_coach_consideration text,
  created_at timestamp with time zone default now(),
  unique (participant, quarter)
);

create table if not exists facilitation_observations (
  id uuid primary key default uuid_generate_v4(),
  participant text not null references roster(participant),
  observation_date date,
  quarter text,
  session_module text,
  observer text,
  preparation int, presence int, clarity int, engagement int,
  listening int, safety int, flow int,
  approved_independent text default 'No',
  created_at timestamp with time zone default now()
);

create table if not exists participant_impact (
  id uuid primary key default uuid_generate_v4(),
  participant text not null references roster(participant),
  impact_date date,
  quarter text,
  activity text,
  evidence_type text,
  source text,
  rating int,
  summary text,
  created_at timestamp with time zone default now()
);

create table if not exists business_retreat_log (
  id uuid primary key default uuid_generate_v4(),
  participant text not null references roster(participant),
  log_date date,
  quarter text,
  log_type text,
  deliverable text,
  reliability int, initiative int, problem_solving int, communication int, handover int,
  lead_feedback text,
  verified text default 'No',
  created_at timestamp with time zone default now()
);

create table if not exists remediation_plans (
  id uuid primary key default uuid_generate_v4(),
  participant text not null references roster(participant),
  quarter text,
  trigger_area text,
  required_standard text,
  corrective_actions text,
  owner text,
  due_date date,
  evidence_required text,
  review_outcome text default 'Open',
  eligibility_effect text default 'No Effect',
  closed_date date,
  created_at timestamp with time zone default now()
);

create table if not exists head_coach_panel (
  id uuid primary key default uuid_generate_v4(),
  participant text unique not null references roster(participant),
  panel_demonstration numeric default 0,
  rationale text,
  panel_decision text,
  updated_at timestamp with time zone default now()
);

insert into roster (participant, stage, active_status)
values
 ('Rhea','Apprentice','Active'),('Rakesh','Apprentice','Active'),('Vijay','Apprentice','Active'),
 ('Shakti','Apprentice','Active'),('Priyanka','Apprentice','Active'),('Namita','Apprentice','Active'),
 ('Vivek','Apprentice','Active'),('Divya','Apprentice','Active'),('Neelam','Apprentice','Active'),
 ('Mandar','Apprentice','Active')
on conflict (participant) do nothing;

insert into head_coach_panel (participant) select participant from roster
on conflict (participant) do nothing;

alter table profiles enable row level security;
alter table roster enable row level security;
alter table non_negotiables enable row level security;
alter table milestones enable row level security;
alter table quarterly_assessments enable row level security;
alter table facilitation_observations enable row level security;
alter table participant_impact enable row level security;
alter table business_retreat_log enable row level security;
alter table remediation_plans enable row level security;
alter table head_coach_panel enable row level security;

create policy "profiles_self_select" on profiles for select using (auth.uid() = id);
create policy "profiles_self_update" on profiles for update using (auth.uid() = id);

create or replace function is_admin_or_coach() returns boolean as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('admin','coach'));
$$ language sql security definer;

create policy "roster_admin_all" on roster for all using (is_admin_or_coach()) with check (is_admin_or_coach());
create policy "roster_self_select" on roster for select using (
  exists (select 1 from profiles where id = auth.uid() and participant_name = roster.participant)
);

create policy "nonneg_admin_all" on non_negotiables for all using (is_admin_or_coach()) with check (is_admin_or_coach());
create policy "nonneg_self_select" on non_negotiables for select using (
  exists (select 1 from profiles where id = auth.uid() and participant_name = non_negotiables.participant)
);

create policy "milestones_admin_all" on milestones for all using (is_admin_or_coach()) with check (is_admin_or_coach());
create policy "milestones_self_select" on milestones for select using (
  exists (select 1 from profiles where id = auth.uid() and participant_name = milestones.participant)
);

create policy "assessments_admin_all" on quarterly_assessments for all using (is_admin_or_coach()) with check (is_admin_or_coach());
create policy "assessments_self_select" on quarterly_assessments for select using (
  exists (select 1 from profiles where id = auth.uid() and participant_name = quarterly_assessments.participant)
);

create policy "facilitation_admin_all" on facilitation_observations for all using (is_admin_or_coach()) with check (is_admin_or_coach());
create policy "facilitation_self_select" on facilitation_observations for select using (
  exists (select 1 from profiles where id = auth.uid() and participant_name = facilitation_observations.participant)
);

create policy "impact_admin_all" on participant_impact for all using (is_admin_or_coach()) with check (is_admin_or_coach());
create policy "impact_self_select" on participant_impact for select using (
  exists (select 1 from profiles where id = auth.uid() and participant_name = participant_impact.participant)
);

create policy "brl_admin_all" on business_retreat_log for all using (is_admin_or_coach()) with check (is_admin_or_coach());
create policy "brl_self_select" on business_retreat_log for select using (
  exists (select 1 from profiles where id = auth.uid() and participant_name = business_retreat_log.participant)
);

create policy "remediation_admin_all" on remediation_plans for all using (is_admin_or_coach()) with check (is_admin_or_coach());
create policy "remediation_self_select" on remediation_plans for select using (
  exists (select 1 from profiles where id = auth.uid() and participant_name = remediation_plans.participant)
);

create policy "headcoach_admin_all" on head_coach_panel for all using (is_admin_or_coach()) with check (is_admin_or_coach());
