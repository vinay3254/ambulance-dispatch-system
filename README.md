# EVERYTHING-AMBULANCE-FEATURES

Curated working pack for an ambulance dispatch system that needs:

- ambulance dispatch
- routing and traffic-aware response
- hospital allocation and bed awareness
- room to add AI later without rebuilding the whole stack

This folder was assembled from GitHub repo triage on 2026-04-05 using subagents plus direct repo checks.

This is a curation and stitching pack, not a merged codebase.

## Files

- `01-verified-shortlist.md` - repos worth checking first
- `02-stitched-features.md` - merged feature/workflow set across the best repos
- `03-watchlist-filter-later.md` - lower-confidence repos and why they are not first-tier
- `04-fastest-safe-start.md` - quickest practical way to combine the best ideas

Additional working notes were also generated into this folder during assembly:

- `ARCHITECTURE-STITCH.md`
- `feature-matrix.md`
- `MERGED-FEATURE-BACKLOG.md`
- `repo-index.md`
- `REPO-SHORTLIST.md`
- `stitched-blueprint.md`

Treat the numbered files as the main pack and the additional files as supporting notes.

## Best current recommendation

If the goal is "move fast without making obvious mistakes", start from:

1. `qppd/ambulance-dispatch-management-system` for the operational product shell
2. `dhcsousa/hospitopt` for hospital and ambulance allocation logic
3. `hackathon-NareshIT/liferoute-ai-smart-emergency-ambulance-routing-system` or `souravvoid/-rapid-response-ems` for route selection and nearest-hospital logic
4. `ShubhamPhapale/dynamic-emergency-response-vehicle-routing-system` only if you want simulation before hardening

## Important caution

None of the repos reviewed should be treated as production-ready EMS software without:

- reliability testing
- incident-state validation
- safety review
- fallback rules for routing and hospital selection
- audit logging
- human override at every critical step
