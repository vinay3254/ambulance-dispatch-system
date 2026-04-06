# Merged Feature Backlog

Stitched from the strongest repos. These are the features worth carrying forward.

## Core Dispatch

- Emergency intake with severity, symptoms, geolocation, and incident notes
- Best available ambulance assignment with driver and unit status checks
- End-to-end mission lifecycle:
  pending, acknowledged, dispatched, en route, on scene, transporting, at hospital, resolved
- Dispatcher dashboard with queue, map, and unit panel
- Driver dashboard with assignment, route, live location, and status updates
- Citizen or patient tracking view with ETA and assigned unit details

## Routing And Traffic

- Route optimization endpoint using OSRM, GraphHopper, or equivalent routing engine
- Traffic-aware ETA adjustment
- Alternative-route comparison for rerouting
- Green-corridor / signal-priority subsystem as a separate module
- Police or traffic-control dashboard for manual override when needed

## Hospital Allocation

- Nearby-hospital search by geospatial distance
- Real-time bed and ICU availability tracking
- Specialist or facility match by emergency type
- Hospital fallback logic if nearest appropriate hospital is full
- Allocation score combining:
  distance, travel time, bed availability, specialist match, urgency, and hospital capability

## Optimization Layer

- Background worker that recomputes assignments when resources or incidents change
- Constraint-based assignment model for ambulance-patient-hospital matching
- Urgency-weighted objective to prioritize critical cases
- Capacity-aware assignment rules
- Demand forecasting and ambulance repositioning as a later optimization phase

## Observability And Operations

- Audit logs for assignment and status changes
- Response-time analytics:
  call processing, travel time, on-scene time, transport time, total response time
- Reports and export
- System health and admin metrics

## Nice To Have Later

- AI-assisted sitrep and operator chat over live system state
- Predictive ICU or bed availability
- Voice symptom capture
- Electronic patient care report
- Offline-first mobile sync
