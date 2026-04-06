import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { useAppContext } from '../context/AppContext';

const MapView = () => {
  const { incidents, ambulances, hospitals, selectedIncident, dispatchAmbulance, updateAmbulancePosition } = useAppContext();
  const [filters, setFilters] = useState({ Critical: true, High: true, Medium: true });
  const [liveAmbulances, setLiveAmbulances] = useState(ambulances);
  const [selectedAmbulanceForIncident, setSelectedAmbulanceForIncident] = useState({});

  useEffect(() => {
    setLiveAmbulances(ambulances);
  }, [ambulances]);

  // Live simulation - move AMB-002 toward INC-002
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveAmbulances(prev => prev.map(amb => {
        if (amb.id === 'AMB-002' && amb.status === 'En Route') {
          const incident = incidents.find(inc => inc.id === 'INC-002');
          if (incident) {
            const [currentLat, currentLng] = amb.coordinates;
            const [targetLat, targetLng] = incident.coordinates;
            
            // Interpolate 5% toward target
            const newLat = currentLat + (targetLat - currentLat) * 0.05;
            const newLng = currentLng + (targetLng - currentLng) * 0.05;
            
            return { ...amb, coordinates: [newLat, newLng] };
          }
        }
        return amb;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [incidents]);

  // Custom ambulance icon
  const createAmbulanceIcon = (status) => {
    const colorMap = {
      'Available': '#10b981',
      'En Route': '#f59e0b',
      'At Scene': '#ef4444'
    };
    const color = colorMap[status] || '#6b7280';
    const pulseClass = status === 'En Route' ? 'animate-pulse' : '';

    return L.divIcon({
      html: `
        <div class="${pulseClass}" style="position: relative;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5">
            <path d="M3 6h18v12H3z"/>
            <path d="M9 3h6v3H9z"/>
            <circle cx="8" cy="20" r="2"/>
            <circle cx="16" cy="20" r="2"/>
            <path d="M10 10h4M12 8v4" stroke-width="2"/>
          </svg>
        </div>
      `,
      className: 'custom-ambulance-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });
  };

  // Custom hospital icon
  const createHospitalIcon = () => {
    return L.divIcon({
      html: `
        <div style="position: relative;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#3b82f6" stroke="white" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 12h6M12 9v6" stroke-width="2.5"/>
          </svg>
        </div>
      `,
      className: 'custom-hospital-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });
  };

  // Filter incidents by severity
  const filteredIncidents = incidents.filter(inc => filters[inc.severity]);

  // Stats calculation
  const activeAmbulances = liveAmbulances.filter(a => a.status !== 'Available').length;
  const availableAmbulances = liveAmbulances.filter(a => a.status === 'Available').length;

  const handleDispatch = (ambulanceId, incidentId) => {
    dispatchAmbulance(ambulanceId, incidentId);
    setSelectedAmbulanceForIncident({});
  };

  const handleAssignAmbulance = (incidentId, ambulanceId) => {
    dispatchAmbulance(ambulanceId, incidentId);
    setSelectedAmbulanceForIncident({});
  };

  return (
    <div className="relative h-[calc(100vh-64px)] w-full bg-gray-950">
      {/* Map Container */}
      <MapContainer
        center={[28.6139, 77.2090]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Ambulance Markers */}
        {liveAmbulances.map(ambulance => (
          <Marker
            key={ambulance.id}
            position={ambulance.coordinates}
            icon={createAmbulanceIcon(ambulance.status)}
          >
            <Popup>
              <div className="min-w-[200px] text-gray-900">
                <div className="font-bold text-lg mb-2">{ambulance.id}</div>
                <div className="space-y-1 text-sm">
                  <div><span className="font-semibold">Driver:</span> {ambulance.driver}</div>
                  <div>
                    <span className="font-semibold">Status:</span>{' '}
                    <span className={`font-medium ${
                      ambulance.status === 'Available' ? 'text-green-600' :
                      ambulance.status === 'En Route' ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {ambulance.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Battery:</span>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full ${
                          ambulance.battery > 50 ? 'bg-green-600' :
                          ambulance.battery > 20 ? 'bg-amber-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${ambulance.battery}%` }}
                      ></div>
                    </div>
                  </div>
                  {ambulance.assignedIncident && (
                    <div><span className="font-semibold">Assigned:</span> {ambulance.assignedIncident}</div>
                  )}
                  {ambulance.status === 'Available' && (
                    <button
                      onClick={() => handleDispatch(ambulance.id, selectedIncident?.id || 'INC-001')}
                      className="mt-2 w-full bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Dispatch
                    </button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route Lines for En Route Ambulances */}
        {liveAmbulances
          .filter(amb => amb.status === 'En Route' && amb.assignedIncident)
          .map(ambulance => {
            const incident = incidents.find(inc => inc.id === ambulance.assignedIncident);
            if (!incident) return null;

            return (
              <Polyline
                key={`route-${ambulance.id}`}
                positions={[ambulance.coordinates, incident.coordinates]}
                color="#ef4444"
                weight={3}
                dashArray="10, 10"
                opacity={0.7}
              />
            );
          })}

        {/* Incident Markers */}
        {filteredIncidents.map(incident => {
          const colorMap = {
            'Critical': '#ef4444',
            'High': '#f59e0b',
            'Medium': '#10b981'
          };
          const color = colorMap[incident.severity] || '#6b7280';
          const nearestHospital = hospitals[0]; // Simplified: first hospital

          return (
            <CircleMarker
              key={incident.id}
              center={incident.coordinates}
              radius={12}
              fillColor={color}
              color="white"
              weight={2}
              fillOpacity={incident.severity === 'Critical' ? 0.9 : 0.7}
              className={incident.severity === 'Critical' ? 'animate-pulse' : ''}
            >
              <Popup>
                <div className="min-w-[220px] text-gray-900">
                  <div className="font-bold text-lg mb-2">{incident.id}</div>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-semibold">Type:</span> {incident.type}</div>
                    <div>
                      <span className="font-semibold">Severity:</span>{' '}
                      <span className={`font-medium ${
                        incident.severity === 'Critical' ? 'text-red-600' :
                        incident.severity === 'High' ? 'text-amber-600' :
                        'text-green-600'
                      }`}>
                        {incident.severity}
                      </span>
                    </div>
                    <div><span className="font-semibold">Location:</span> {incident.location}</div>
                    <div><span className="font-semibold">Time:</span> {incident.time}</div>
                    {nearestHospital && (
                      <div className="mt-2 pt-2 border-t border-gray-300">
                        <div className="text-xs font-semibold text-blue-600">
                          Nearest: {nearestHospital.name}
                        </div>
                      </div>
                    )}
                    <div className="mt-2">
                      <label className="block text-xs font-semibold mb-1">Assign Ambulance:</label>
                      <select
                        value={selectedAmbulanceForIncident[incident.id] || ''}
                        onChange={(e) => setSelectedAmbulanceForIncident({
                          ...selectedAmbulanceForIncident,
                          [incident.id]: e.target.value
                        })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="">Select...</option>
                        {liveAmbulances
                          .filter(amb => amb.status === 'Available')
                          .map(amb => (
                            <option key={amb.id} value={amb.id}>
                              {amb.id} - {amb.driver}
                            </option>
                          ))}
                      </select>
                      {selectedAmbulanceForIncident[incident.id] && (
                        <button
                          onClick={() => handleAssignAmbulance(incident.id, selectedAmbulanceForIncident[incident.id])}
                          className="mt-1 w-full bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          Confirm Assignment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Hospital Markers */}
        {hospitals.map(hospital => (
          <Marker
            key={hospital.id}
            position={hospital.coordinates}
            icon={createHospitalIcon()}
          >
            <Popup>
              <div className="min-w-[200px] text-gray-900">
                <div className="font-bold text-lg mb-2">{hospital.name}</div>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-semibold">Specialties:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {hospital.specialties.map((spec, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="font-semibold">Available Beds:</span>{' '}
                    <span className={`font-medium ${
                      hospital.bedsAvailable > 10 ? 'text-green-600' :
                      hospital.bedsAvailable > 5 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {hospital.bedsAvailable}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Filter Controls */}
      <div className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-md rounded-lg shadow-lg p-4 z-[1000]">
        <div className="text-white font-semibold mb-3 text-sm">Filter by Severity</div>
        <div className="space-y-2">
          {['Critical', 'High', 'Medium'].map(severity => (
            <label key={severity} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters[severity]}
                onChange={(e) => setFilters({ ...filters, [severity]: e.target.checked })}
                className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
              />
              <span className={`text-sm ${
                severity === 'Critical' ? 'text-red-400' :
                severity === 'High' ? 'text-amber-400' :
                'text-green-400'
              }`}>
                {severity}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-[rgba(6,11,20,0.85)] backdrop-blur-md text-white px-6 py-3 z-[1000] border-t border-gray-800">
        <div className="flex items-center justify-around max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">{activeAmbulances}</div>
            <div className="text-xs text-gray-400">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{availableAmbulances}/{liveAmbulances.length}</div>
            <div className="text-xs text-gray-400">Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">8.5m</div>
            <div className="text-xs text-gray-400">Avg ETA</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{hospitals.length}</div>
            <div className="text-xs text-gray-400">Hospitals</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
