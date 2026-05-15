-- MP&A Partner Intake Schema

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS submissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  role          TEXT,
  organisation  TEXT,
  geography     TEXT,
  legal_status  TEXT,

  -- Impact
  impact_delivered        TEXT,
  how_delivers_impact     TEXT,
  impact_measurement      TEXT,

  -- Organisation profile
  staff_size      TEXT,
  annual_budget   TEXT,
  strengths       TEXT,
  gaps            TEXT,

  -- Partnership intent
  interested_from_mpa     TEXT[],   -- multi-select
  ideal_deal              TEXT,
  what_you_offer          TEXT,
  timeline                TEXT,

  -- Culture
  culture_description         TEXT,
  junior_culture_description  TEXT,

  -- Sector
  admired_organisation    TEXT,
  preventing_work         TEXT,

  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id  UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  original_name  TEXT NOT NULL,
  stored_name    TEXT NOT NULL,
  mime_type      TEXT,
  file_size      BIGINT,
  uploaded_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
