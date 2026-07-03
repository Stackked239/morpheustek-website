-- Allow 'flagged' status: suspected-bot submissions (filled honeypot) are
-- quarantined in the log instead of dropped, and skip the HubSpot sync.
alter table submissions drop constraint if exists submissions_status_check;
alter table submissions add constraint submissions_status_check
  check (status in ('pending', 'synced', 'failed', 'flagged'));
