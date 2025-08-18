create extension if not exists pgcrypto;

create sequence if not exists policy_number_seq start 100000000000; -- 12-digit

create type party_type as enum (
    'PERSON',
    'ORGANIZATION'
);

create type claim_status as enum (
    'OPEN',
    'CLOSED',
    'IN_REVIEW',
    'DENIED',
    'SETTLED'
);

create type policy_status as enum (
    'ACTIVE',
    'INACTIVE',
    'PENDING',
    'CANCELLED'
);

create type policy_party_role as enum (
    'NAMED_INSURED',
    'ADDITIONAL_INSURED',
    'DRIVER',
    'EXCLUDED',
    'CONTACT',
    'BENEFICIARY'
);

create type vehicle_use as enum (
    'PERSONAL',
    'COMMERCIAL',
    'FARM',
    'RECREATIONAL'
);


create type vehicle_party_role as enum (
    'PRIMARY_DRIVER',
    'ADDITIONAL_DRIVER',
    'EXCLUDED_DRIVER',
    'OWNER',
    'LIENHOLDER',
    'LESSOR',
    'LESSEE',
    'CONTACT'
);

create type claimant_role as enum (
    'CLAIMANT',
    'WITNESS',
    'POLICE_OFFICER',
    'ADJUSTER',
    'OTHER'
);


CREATE TABLE policies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_number BIGINT UNIQUE DEFAULT nextval('policy_number_seq'),
    status policy_status not null default 'PENDING',
    effective_at timestamptz not null,
    expires_at   timestamptz not null,
    currency char(3) not null default 'USD',
    state char(2) not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

CREATE TABLE parties (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text not null,
    display_name text not null,
    created_at timestamptz not null default now()
);

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text not null unique,
    password_hash text not null,
    first_name text not null,
    last_name text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

CREATE TABLE people (
    party_id uuid PRIMARY KEY REFERENCES parties(id) ON DELETE CASCADE,
    first_name text not null,
    last_name text not null,
    user_id uuid REFERENCES users(id) ON DELETE SET NULL,
    email text not null unique,
    license_number text unique,
    license_state char(2) not null,
    phone text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

CREATE TABLE vehicles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id uuid NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    primary_use vehicle_use not null,
    vin char(17) not null unique,
    make text not null,
    model text not null,
    year int not null,
    garaging_address jsonb not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table policy_parties (
    policy_id uuid not null references policies(id) on delete cascade,
    party_id uuid not null references parties(id) on delete restrict,
    role policy_party_role not null,
    effective_at timestamptz not null,
    expires_at timestamptz not null,
    primary key (policy_id, party_id, role, effective_at)
);
create table vehicle_parties (
    vehicle_id uuid not null references vehicles(id) on delete cascade,
    party_id uuid not null references parties(id) on delete restrict,
    role vehicle_party_role not null,
    effective_at timestamptz not null,
    expires_at timestamptz not null,
    primary key (vehicle_id, party_id, role, effective_at)
);

create table claims (
    id uuid primary key default gen_random_uuid(),
    policy_id uuid not null references policies(id) on delete cascade,
    reported_at timestamptz not null default now(),
    incident_at timestamptz not null,
    description text,
    amount numeric(12,2) not null,
    status claim_status not null default 'OPEN',
    coverage_snapshot jsonb not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

CREATE TABLE claim_vehicle (
  claim_id   uuid REFERENCES claims(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES vehicles(id),   
  PRIMARY KEY (claim_id, vehicle_id)
);


CREATE TABLE claim_party (
  id uuid PRIMARY KEY,
  claim_id  uuid REFERENCES claims(id) ON DELETE CASCADE,
  party_type text NOT NULL,         
  person_id uuid NULL,   
  name  text,
  phone text,
  email  text
);

CREATE TABLE coverage_types (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    scope TEXT NOT NULL CHECK (scope IN ('POLICY', 'VEHICLE')),
    unit TEXT NOT NULL CHECK (unit IN ('USD', 'PERCENT', 'RENTAL_DAYS', 'RENTAL_FLAT')),
    description TEXT
);

CREATE TABLE coverage_selection (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id uuid NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    vehicle_id uuid NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    coverage_code TEXT NOT NULL REFERENCES coverage_types(code) ON DELETE RESTRICT,
    amount_cents BIGINT NOT NULL,
    numeric_value NUMERIC(12,2) NULL,
    effective_at timestamptz NOT NULL,
    expires_at timestamptz NOT NULL,
    CHECK (
        ((amount_cents IS NOT NULL) AND numeric_value IS NULL) OR
        ((amount_cents IS NULL) AND (numeric_value IS NOT NULL))
    ),
    CHECK ( -- ensure vehicle-specific coverages have a vehicle_id and policy-wide coverages do not
    (vehicle_id IS NULL AND coverage_code IN (
      'BI_PP','BI_PA','PD_PA','CSL','UMBI_PP','UMBI_PA','PIP_PP'
    ))
    OR
    (vehicle_id IS NOT NULL AND coverage_code IN (
      'COLL_DED','COMP_DED','RENTAL_PD','RENTAL_MAXDAYS','GLASS_DED'
    ))
  )
);

create index on policy_parties (policy_id, role);
create index on vehicle_parties (vehicle_id, role);
create index on policies (status, expires_at);
create index on vehicles(policy_id);

create unique index if not exists vehicle_one_primary_driver
    on vehicle_parties(vehicle_id, role)
    where role = 'PRIMARY_DRIVER';