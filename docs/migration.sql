-- ────────────────────────────────────────────────────────────────
-- SOrvReign MotoLift — Complete Database Schema
-- Paste this entire file into Supabase SQL Editor and run.
-- ────────────────────────────────────────────────────────────────

-- 1. ADMIN USERS (links to Supabase Auth users)
create table if not exists admin_users (
  id          uuid primary key default gen_random_uuid(),
  auth_id     uuid unique references auth.users(id) on delete cascade,
  full_name   text not null,
  email       text not null unique,
  role        text default 'admin',
  created_at  timestamptz default now()
);

-- 2. APPLICATIONS (from the website apply form)
create table if not exists applications (
  id              uuid primary key default gen_random_uuid(),
  full_name       text not null,
  phone           text not null,
  email           text,
  nationality     text,
  id_number       text,
  id_type         text,                       -- national_id | passport | alien_id
  applicant_type  text default 'refugee',     -- Refugee | Youth | YVC
  is_refugee      boolean default false,
  unhcr_number    text,                       -- refugee-specific
  youth_affiliation text,                     -- youth-specific
  is_yvc_member   boolean,                    -- YVC-specific
  motorcycle_type text,                       -- electric | petrol
  license_status  text,
  riding_experience text,                     -- none | <1 | 1-3 | 3+
  location        text,
  referral_code   text,
  preferred_bike  text,
  status          text default 'pending',     -- pending | approved | rejected
  staff_notes     text,
  created_at      timestamptz default now()
);

-- 3. BIKES (inventory)
create table if not exists bikes (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  type            text not null,              -- electric | petrol
  daily_rate      numeric not null,
  deposit         numeric not null,
  stock           int default 0,
  assigned        int default 0,
  status          text default 'active',      -- active | maintenance
  image_url       text,
  created_at      timestamptz default now()
);

-- 4. RIDERS (active financing agreements)
create table if not exists riders (
  id              uuid primary key default gen_random_uuid(),
  auth_id         uuid unique references auth.users(id) on delete cascade,
  full_name       text not null,
  phone           text not null unique,
  email           text,
  applicant_type  text default 'refugee',
  is_refugee      boolean default false,
  id_type         text,
  id_number       text,
  emergency_contact text,

  -- Financing
  bike_id         uuid references bikes(id),
  tier            text default 'standard',    -- starter | standard | plus | pro
  daily_rate      numeric not null,
  deposit_paid    numeric default 0,
  total_days      int default 540,
  days_paid       int default 0,
  phase           int default 1,
  balance         numeric default 0,
  start_date      date,
  due_date        date,

  -- Status
  status          text default 'active',      -- active | default | completed
  last_payment_at timestamptz,
  created_at      timestamptz default now()
);

-- 5. REPAYMENTS (payment records)
create table if not exists repayments (
  id              uuid primary key default gen_random_uuid(),
  rider_id        uuid references riders(id) on delete cascade,
  amount          numeric not null,
  method          text default 'mpesa',
  reference       text,
  status          text default 'completed',   -- completed | pending | failed
  recorded_at     timestamptz default now()
);

-- 6. RIDER PLATFORMS (delivery platform onboarding status)
create table if not exists rider_platforms (
  id              uuid primary key default gen_random_uuid(),
  rider_id        uuid references riders(id) on delete cascade,
  platform        text not null,              -- bolt | glovo | uber | faras
  status          text default 'not_started', -- not_started | pending | registered
  registered_at   timestamptz,
  unique(rider_id, platform)
);

-- ── Indexes ─────────────────────────────────────────────────────
create index if not exists idx_applications_status on applications(status);
create index if not exists idx_riders_status on riders(status);
create index if not exists idx_repayments_rider on repayments(rider_id);
create index if not exists idx_repayments_date on repayments(recorded_at);

-- ── Helper function: increment days_paid ────────────────────────
create or replace function increment_days_paid(p_rider_id uuid)
returns void language sql as $$
  update riders
  set days_paid = days_paid + 1,
      balance = balance - daily_rate
  where id = p_rider_id;
$$;

-- ── Helper function: calculate balance on insert ────────────────
create or replace function calculate_initial_balance()
returns trigger language plpgsql as $$
begin
  new.balance := new.daily_rate * new.total_days;
  return new;
end;
$$;

create or replace trigger trg_riders_balance
  before insert on riders
  for each row execute function calculate_initial_balance();

-- ── Row Level Security (optional, managed via API service_role) ──
alter table applications enable row level security;
alter table riders enable row level security;
alter table repayments enable row level security;
alter table bikes enable row level security;
alter table rider_platforms enable row level security;

-- ── Seed bikes ──────────────────────────────────────────────────
insert into bikes (name, type, daily_rate, deposit, stock, assigned) values
  ('Spiro M1 Ekon',    'electric', 350, 10000, 8, 32),
  ('Cheche TailG',     'electric', 350, 10000, 3,  2),
  ('Tankvolt T21',     'electric', 420, 15000, 5,  3),
  ('Enzi G5 RADI',     'electric', 450, 15000, 2,  1),
  ('Boxer',            'petrol',   380, 10000, 4,  6),
  ('TVS',              'petrol',   400, 10000, 6,  4),
  ('Hero',             'petrol',   380, 10000, 3,  2)
on conflict do nothing;
