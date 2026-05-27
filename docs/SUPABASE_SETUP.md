# Supabase Setup — SOrvReign MotoLift

## 1. Create a project
Go to https://supabase.com → New Project → name it `motolift` → save the URL and `service_role` key → add to `api/.env`

## 2. Run this SQL in the Supabase SQL editor

```sql
-- Riders table
create table riders (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  phone       text not null unique,
  email       text,
  bike_id     text not null,
  is_refugee  boolean default false,
  status      text default 'active',   -- active | completed | defaulted
  days_paid   int default 0,
  created_at  timestamptz default now()
);

-- Applications table
create table applications (
  id           uuid primary key default gen_random_uuid(),
  full_name    text not null,
  nationality  text,
  id_number    text,
  phone        text not null,
  email        text,
  bike_id      text not null,
  is_refugee   boolean default false,
  status       text default 'pending',  -- pending | approved | rejected
  created_at   timestamptz default now()
);

-- Repayments table
create table repayments (
  id          uuid primary key default gen_random_uuid(),
  rider_id    uuid references riders(id),
  amount      numeric not null,
  method      text default 'mpesa',
  reference   text,
  recorded_at timestamptz default now()
);

-- Helper function: increment days_paid
create or replace function increment_days_paid(rider_id uuid)
returns void language sql as $$
  update riders set days_paid = days_paid + 1 where id = rider_id;
$$;

-- RLS: enable row-level security (configure per your auth setup)
alter table riders       enable row level security;
alter table applications enable row level security;
alter table repayments   enable row level security;
```

## 3. Storage bucket (for application documents)
Supabase → Storage → New bucket → name: `rider-docs` → set to private

## 4. Auth
Use Supabase Auth with phone OTP for rider login, email/password for admin.
