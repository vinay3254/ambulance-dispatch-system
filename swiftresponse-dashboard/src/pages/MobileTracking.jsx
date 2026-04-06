import React, { useState, useEffect, useRef } from 'react';
import { Battery, MapPin, Navigation, Play, Pause, Download, Search, Filter, RefreshCw, Check } from 'lucide-react';

const mockAmbulances = [
  { id: 'AMB-101', driver: 'Rajesh Kumar', status: 'Available', battery: 87, signal: 3, speed: 0, coords: { lat: 28.6139, lng: 77.2090 }, location: 'Connaught Place', incident: null },
  { id: 'AMB-102', driver: 'Priya Sharma', status: 'En Route', battery: 65, signal: 2, speed: 58, coords: { lat: 28.5355, lng: 77.3910 }, location: 'Noida Sector 18', incident: 'INC-2047' },
  { id: 'AMB-103', driver: 'Anil Verma', status: 'On Scene', battery: 43, signal: 3, speed: 0, coords: { lat: 28.4595, lng: 77.0266 }, location: 'Gurugram Cyber City', incident: 'INC-2051' },
  { id: 'AMB-104', driver: 'Meera Desai', status: 'En Route', battery: 92, signal: 3, speed: 72, coords: { lat: 28.7041, lng: 77.1025 }, location: 'GTB Nagar', incident: 'INC-2053' },
  { id: 'AMB-105', driver: 'Suresh Reddy', status: 'Available', battery: 18, signal: 1, speed: 0, coords: { lat: 28.6692, lng: 77.4538 }, location: 'Ghaziabad', incident: null },
  { id: 'AMB-106', driver: 'Kavita Singh', status: 'Returning', battery: 55, signal: 2, speed: 45, coords: { lat: 28.6304, lng: 77.2177 }, location: 'Kashmere Gate', incident: null },
];

const initialDeviceHealth = [
  { unit: 'AMB-101', driver: 'Rajesh Kumar', device: 'Samsung A52', os: 'Android 13', appVer: '2.4.1', lastPing: new Date(Date.now() - 2 * 60000), signal: 3, battery: 87, status: 'Active' },
  { unit: 'AMB-102', driver: 'Priya Sharma', device: 'iPhone 12', os: 'iOS 17.2', appVer: '2.4.1', lastPing: new Date(Date.now() - 1 * 60000), signal: 2, battery: 65, status: 'Active' },
  { unit: 'AMB-103', driver: 'Anil Verma', device: 'OnePlus 9', os: 'Android 14', appVer: '2.4.0', lastPing: new Date(Date.now() - 8 * 60000), signal: 3, battery: 43, status: 'Active' },
  { unit: 'AMB-104', driver: 'Meera Desai', device: 'Samsung S21', os: 'Android 13', appVer: '2.4.1', lastPing: new Date(Date.now() - 30000), signal: 3, battery: 92, status: 'Active' },
  { unit: 'AMB-105', driver: 'Suresh Reddy', device: 'Xiaomi 11', os: 'Android 12', appVer: '2.3.8', lastPing: new Date(Date.now() - 18 * 60000), signal: 1, battery: 18, status: 'Warning' },
  { unit: 'AMB-106', driver: 'Kavita Singh', device: 'iPhone 13', os: 'iOS 17.1', appVer: '2.4.1', lastPing: new Date(Date.now() - 4 * 60000), signal: 2, battery: 55, status: 'Active' },
];

const initialLogs = [
  { time: '14:23:15', unit: 'AMB-102', event: 'entered Zone 4', type: 'zone' },
  { time: '14:23:42', unit: 'AMB-104', event: 'speed 72km/h on NH-48', type: 'speed' },
  { time: '14:24:08', unit: 'AMB-105', event: 'battery critical at 18%', type: 'battery' },
  { time: '14:24:35', unit: 'AMB-103', event: 'status changed to On Scene', type: 'status' },
  { time: '14:25:12', unit: 'AMB-101', event: 'GPS signal restored', type: 'zone' },
  { time: '14:25:48', unit: 'AMB-102', event: 'speed 58km/h on Noida Link Road', type: 'speed' },
  { time: '14:26:19', unit: 'AMB-106', event: 'status changed to Returning', type: 'status' },
  { time: '14:26:51', unit: 'AMB-104', event: 'entered Zone 2', type: 'zone' },
  { time: '14:27:23', unit: 'AMB-103', event: 'battery at 43%', type: 'battery' },
  { time: '14:27:55', unit: 'AMB-105', event: 'GPS signal weak', type: 'battery' },
  { time: '14:28:27', unit: 'AMB-102', event: 'approaching destination', type: 'status' },
  { time: '14:28:59', unit: 'AMB-101', event: 'speed 0km/h at Connaught Place', type: 'speed' },
  { time: '14:29:31', unit: 'AMB-106', event: 'speed 45km/h on Ring Road', type: 'speed' },
  { time: '14:30:03', unit: 'AMB-104', event: 'battery at 92%', type: 'battery' },
  { time: '14:30:35', unit: 'AMB-103', event: 'GPS accuracy improved', type: 'zone' },
  { time: '14:31:07', unit: 'AMB-102', event: 'entered Zone 3', type: 'zone' },
  { time: '14:31:39', unit: 'AMB-105', event: 'status changed to Available', type: 'status' },
  { time: '14:32:11', unit: 'AMB-106', event: 'speed 45km/h on NH-1', type: 'speed' },
  { time: '14:32:43', unit: 'AMB-101', event: 'battery at 87%', type: 'battery' },
  { time: '14:33:15', unit: 'AMB-104', event: 'speed 72km/h on Outer Ring Road', type: 'speed' },
];

const eventTemplates = [
  { template: 'entered Zone {zone}', type: 'zone' },
  { template: 'speed {speed}km/h on {road}', type: 'speed' },
  { template: 'battery at {battery}%', type: 'battery' },
  { template: 'battery critical at {battery}%', type: 'battery' },
  { template: 'status changed to {status}', type: 'status' },
  { template: 'GPS signal {signal}', type: 'zone' },
  { template: 'approaching destination', type: 'status' },
  { template: 'GPS accuracy improved', type: 'zone' },
];

const roads = ['NH-48', 'Ring Road', 'Outer Ring Road', 'Noida Link Road', 'NH-1', 'MG Road', 'DND Flyway'];
const zones = ['1', '2', '3', '4', '5', '6'];
const signals = ['restored', 'weak', 'strong'];
const statuses = ['Available', 'En Route', 'On Scene', 'Returning'];

function MobileTracking() {
  const [ambulances, setAmbulances] = useState(mockAmbulances);
  const [deviceHealth, setDeviceHealth] = useState(initialDeviceHealth);
  const [activityLogs, setActivityLogs] = useState(initialLogs);
  const [isPaused, setIsPaused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [syncingUnits, setSyncingUnits] = useState({});
  const [flashingUnit, setFlashingUnit] = useState(null);
  const feedRef = useRef(null);

  useEffect(() => {
    if (feedRef.current && !isPaused) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [activityLogs, isPaused]);

  useEffect(() => {
    if (isPaused) return;
    
    const logInterval = setInterval(() => {
      const randomUnit = mockAmbulances[Math.floor(Math.random() * mockAmbulances.length)];
      const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
      
      let event = template.template;
      event = event.replace('{zone}', zones[Math.floor(Math.random() * zones.length)]);
      event = event.replace('{speed}', Math.floor(Math.random() * 80 + 20));
      event = event.replace('{battery}', Math.floor(Math.random() * 100));
      event = event.replace('{road}', roads[Math.floor(Math.random() * roads.length)]);
      event = event.replace('{signal}', signals[Math.floor(Math.random() * signals.length)]);
      event = event.replace('{status}', statuses[Math.floor(Math.random() * statuses.length)]);
      
      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 8);
      
      setActivityLogs(prev => [...prev, {
        time: timeStr,
        unit: randomUnit.id,
        event: event,
        type: template.type
      }]);
    }, 4000);

    return () => clearInterval(logInterval);
  }, [isPaused]);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * ambulances.length);
      
      setAmbulances(prev => prev.map((amb, idx) => {
        if (idx === randomIndex) {
          return {
            ...amb,
            speed: amb.status === 'Available' ? 0 : Math.floor(Math.random() * 80 + 20),
            battery: Math.max(10, amb.battery - Math.floor(Math.random() * 3)),
            coords: {
              lat: amb.coords.lat + (Math.random() - 0.5) * 0.01,
              lng: amb.coords.lng + (Math.random() - 0.5) * 0.01
            }
          };
        }
        return amb;
      }));

      setFlashingUnit(ambulances[randomIndex].id);
      setTimeout(() => setFlashingUnit(null), 1000);
    }, 5000);

    return () => clearInterval(updateInterval);
  }, [ambulances]);

  const getBatteryColor = (battery) => {
    if (battery > 50) return 'bg-green-500';
    if (battery > 20) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Available': 'bg-green-500',
      'En Route': 'bg-amber-500',
      'On Scene': 'bg-blue-500',
      'Returning': 'bg-purple-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getLogColor = (type) => {
    const colors = {
      'speed': 'text-amber-400',
      'battery': 'text-red-400',
      'zone': 'text-cyan-400',
      'status': 'text-green-400'
    };
    return colors[type] || 'text-gray-400';
  };

  const getPingTint = (lastPing) => {
    const minutesAgo = (Date.now() - lastPing.getTime()) / 60000;
    if (minutesAgo > 15) return 'bg-red-900/20';
    if (minutesAgo > 5) return 'bg-amber-900/20';
    return '';
  };

  const handleSync = (unit) => {
    setSyncingUnits(prev => ({ ...prev, [unit]: 'syncing' }));
    setTimeout(() => {
      setSyncingUnits(prev => ({ ...prev, [unit]: 'done' }));
      setTimeout(() => {
        setSyncingUnits(prev => {
          const newState = { ...prev };
          delete newState[unit];
          return newState;
        });
      }, 2000);
    }, 2000);
  };

  const exportCSV = () => {
    const headers = ['Unit', 'Driver', 'Device', 'OS', 'App Version', 'Last Ping', 'Signal', 'Battery', 'Status'];
    const rows = filteredDeviceHealth.map(d => [
      d.unit,
      d.driver,
      d.device,
      d.os,
      d.appVer,
      d.lastPing.toLocaleString(),
      d.signal,
      `${d.battery}%`,
      d.status
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `device-health-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredDeviceHealth = deviceHealth.filter(d => {
    const matchesSearch = d.unit.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         d.driver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <style>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 0 rgba(34, 211, 238, 0); }
          50% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.6); }
        }
        .flash-glow {
          animation: glow 1s ease-in-out;
        }
      `}</style>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-cyan-400 mb-2">Mobile Tracking</h1>
        <p className="text-gray-400">Real-time fleet monitoring and device health</p>
      </div>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Section 1: Fleet Grid */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-300">Fleet Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ambulances.map((amb) => (
                <div
                  key={amb.id}
                  className={`bg-gray-900 rounded-lg p-4 border border-gray-800 ${
                    amb.status === 'En Route' ? 'border-l-4 border-l-amber-500' : ''
                  } ${flashingUnit === amb.id ? 'flash-glow' : ''}`}
                >
                  {/* Row 1: Unit ID + Status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-lg text-cyan-400 font-semibold">{amb.id}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(amb.status)}`}>
                      {amb.status}
                    </span>
                  </div>

                  {/* Row 2: Driver */}
                  <div className="mb-3">
                    <p className="text-gray-300" style={{ fontFamily: 'Sora, sans-serif' }}>{amb.driver}</p>
                  </div>

                  {/* Row 3: Battery Bar */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <Battery className="w-4 h-4 text-gray-400" />
                      <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${getBatteryColor(amb.battery)} transition-all duration-300`}
                          style={{ width: `${amb.battery}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-300 font-medium">{amb.battery}%</span>
                    </div>
                  </div>

                  {/* Row 4: GPS Signal + Coords */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((dot) => (
                          <div
                            key={dot}
                            className={`w-2 h-2 rounded-full ${
                              dot <= amb.signal ? 'bg-green-500' : 'bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {amb.coords.lat.toFixed(4)}, {amb.coords.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  {/* Row 5: Speed + Location */}
                  <div className="mb-3 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-300">
                      <Navigation className="w-4 h-4" />
                      <span className="font-medium">{amb.speed} km/h</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <MapPin className="w-3 h-3" />
                      <span className="text-xs">{amb.location}</span>
                    </div>
                  </div>

                  {/* Row 6: Incident */}
                  <div>
                    {amb.incident ? (
                      <span className="inline-block bg-amber-900/30 text-amber-400 px-2 py-1 rounded text-xs font-medium border border-amber-700">
                        {amb.incident}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">Unassigned</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Device Health Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-300">Device Health</h2>
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search unit or driver..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-cyan-500 appearance-none"
                  >
                    <option>All</option>
                    <option>Active</option>
                    <option>Warning</option>
                    <option>Offline</option>
                  </select>
                </div>

                {/* Export CSV */}
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="px-4 py-3 text-left">Unit</th>
                      <th className="px-4 py-3 text-left">Driver</th>
                      <th className="px-4 py-3 text-left">Device</th>
                      <th className="px-4 py-3 text-left">OS</th>
                      <th className="px-4 py-3 text-left">App Ver</th>
                      <th className="px-4 py-3 text-left">Last Ping</th>
                      <th className="px-4 py-3 text-center">Signal</th>
                      <th className="px-4 py-3 text-center">Battery</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filteredDeviceHealth.map((device) => (
                      <tr
                        key={device.unit}
                        className={`border-t border-gray-800 hover:bg-gray-800/50 transition-colors ${getPingTint(device.lastPing)}`}
                      >
                        <td className="px-4 py-3 font-mono text-cyan-400">{device.unit}</td>
                        <td className="px-4 py-3 text-gray-300">{device.driver}</td>
                        <td className="px-4 py-3 text-gray-400">{device.device}</td>
                        <td className="px-4 py-3 text-gray-400">{device.os}</td>
                        <td className="px-4 py-3 text-gray-400">{device.appVer}</td>
                        <td className="px-4 py-3 text-gray-400">
                          {Math.floor((Date.now() - device.lastPing.getTime()) / 60000)}m ago
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex gap-1 justify-center">
                            {[1, 2, 3].map((dot) => (
                              <div
                                key={dot}
                                className={`w-2 h-2 rounded-full ${
                                  dot <= device.signal ? 'bg-green-500' : 'bg-gray-700'
                                }`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-medium ${
                            device.battery > 50 ? 'text-green-400' : 
                            device.battery > 20 ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            {device.battery}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            device.status === 'Active' ? 'bg-green-900/30 text-green-400 border border-green-700' :
                            device.status === 'Warning' ? 'bg-amber-900/30 text-amber-400 border border-amber-700' :
                            'bg-red-900/30 text-red-400 border border-red-700'
                          }`}>
                            {device.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleSync(device.unit)}
                              disabled={syncingUnits[device.unit]}
                              className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50"
                            >
                              {syncingUnits[device.unit] === 'syncing' && (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              )}
                              {syncingUnits[device.unit] === 'done' && (
                                <Check className="w-3 h-3 text-green-400" />
                              )}
                              {!syncingUnits[device.unit] && 'Sync'}
                              {syncingUnits[device.unit] === 'syncing' && 'Syncing'}
                              {syncingUnits[device.unit] === 'done' && 'Synced'}
                            </button>
                            <button className="bg-cyan-900/30 hover:bg-cyan-900/50 text-cyan-400 px-3 py-1 rounded text-xs font-medium transition-colors border border-cyan-700">
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Live Activity Feed - Right Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-gray-900 rounded-lg border border-gray-800 h-[calc(100vh-200px)] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-gray-300">Live Feed</h2>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm transition-colors"
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                )}
              </button>
            </div>

            <div
              ref={feedRef}
              className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs"
            >
              {activityLogs.map((log, idx) => (
                <div key={idx} className="text-gray-400">
                  <span className="text-gray-600">[{log.time}]</span>{' '}
                  <span className="text-cyan-400">{log.unit}</span>{' '}
                  <span className="text-gray-500">—</span>{' '}
                  <span className={getLogColor(log.type)}>{log.event}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileTracking;
