# Feature Matrix

Reusable features stitched from the filtered repo set.

| Area | Keep | Primary Repo | Secondary Repo | Avoid Early |
|---|---|---|---|---|
| Dispatch product shell | multi-role dashboards, incident queue, realtime updates, audit, analytics | `qppd/ambulance-dispatch-management-system` | `souravvoid/-rapid-response-ems` | overbuilding admin UX first |
| Emergency intake | GPS capture, symptoms, severity, incident notes, patient tracking | `qppd/ambulance-dispatch-management-system` | `souravvoid/-rapid-response-ems` | voice-first workflows |
| Ambulance assignment | best available unit, ETA-aware selection, state-aware filtering | `souravvoid/-rapid-response-ems` | `qppd/ambulance-dispatch-management-system` | nearest-unit-only logic |
| Routing | route optimization endpoint, ETA, alternatives, rerouting hooks | `hackathon-NareshIT/liferoute-ai-smart-emergency-ambulance-routing-system` | `ShubhamPhapale/dynamic-emergency-response-vehicle-routing-system` | custom routing from scratch |
| Traffic priority | green corridor concept, signal-priority hooks, traffic-control override | `SANJAY8125/VitalRoute` | `HariniCJ/Ambulance-Navigation-with-Hospital-Availability-and-Dynamic-Traffic-Routing` | hardware integration in MVP |
| Hospital recommendation | distance, travel time, beds, specialist match, fallback | `sweetylearner-max/emergency-hospital-rec-system` | `hackathon-NareshIT/liferoute-ai-smart-emergency-ambulance-routing-system` | distance-only hospital choice |
| Hospital optimization | ambulance-patient-hospital assignment under constraints | `dhcsousa/hospitopt` | `jamesypeng/Smarter-Emergency-Dispatch` | putting optimization logic in UI |
| Re-optimization | recompute on changes to beds, traffic, incidents, fleet | `dhcsousa/hospitopt` | `qppd/ambulance-dispatch-management-system` | manual-only reassignment |
| Driver workflow | assignment receipt, live location, status updates, handoff | `qppd/ambulance-dispatch-management-system` | `souravvoid/-rapid-response-ems` | extra polish before core reliability |
| Hospital coordination | pre-arrival alert, doctor prep, patient vitals handoff | `sweetylearner-max/emergency-hospital-rec-system` | `HariniCJ/Ambulance-Navigation-with-Hospital-Availability-and-Dynamic-Traffic-Routing` | full ERP sync |
| Forecasting | demand forecasting, zone trends, ambulance repositioning | `jamesypeng/Smarter-Emergency-Dispatch` | `ShubhamPhapale/dynamic-emergency-response-vehicle-routing-system` | shipping before MVP dispatch works |
| Observability | response-time analytics, utilization, exports, admin metrics | `qppd/ambulance-dispatch-management-system` | `jamesypeng/Smarter-Emergency-Dispatch` | vanity dashboards |
