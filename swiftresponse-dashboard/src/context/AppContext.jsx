import { createContext, useContext, useState, useCallback } from 'react';
import { incidents as mockIncidents, ambulances as mockAmbulances, hospitals as mockHospitals } from '../data/mockData';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [incidents, setIncidents] = useState(mockIncidents);
  const [ambulances, setAmbulances] = useState(mockAmbulances);
  const [hospitals] = useState(mockHospitals);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [toasts, setToasts] = useState([]);

  const selectIncident = useCallback((incident) => {
    setSelectedIncident(incident);
  }, []);

  const getFilteredIncidents = useCallback(() => {
    if (filter === 'ALL') return incidents;
    if (filter === 'ACTIVE') return incidents.filter(inc => inc.status === 'Active' || inc.status === 'Acknowledged');
    if (filter === 'PENDING') return incidents.filter(inc => inc.status === 'Pending');
    return incidents;
  }, [incidents, filter]);

  const addToast = useCallback((toast) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration || 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateAmbulancePosition = useCallback((ambulanceId, newCoords) => {
    setAmbulances(prev => prev.map(amb => 
      amb.id === ambulanceId ? { ...amb, coordinates: newCoords } : amb
    ));
  }, []);

  const dispatchAmbulance = useCallback((ambulanceId, incidentId) => {
    setAmbulances(prev => prev.map(amb => 
      amb.id === ambulanceId ? { ...amb, status: 'En Route', assignedIncident: incidentId } : amb
    ));
    setIncidents(prev => prev.map(inc =>
      inc.id === incidentId ? { ...inc, status: 'Active' } : inc
    ));
    addToast({ message: `${ambulanceId} dispatched to ${incidentId}`, severity: 'success' });
  }, [addToast]);

  const getAvailableAmbulances = useCallback(() => {
    return ambulances.filter(amb => amb.status === 'Available');
  }, [ambulances]);

  const getPendingCount = useCallback(() => {
    return incidents.filter(inc => inc.status === 'Pending').length;
  }, [incidents]);

  const getActiveCount = useCallback(() => {
    return incidents.filter(inc => inc.status === 'Active' || inc.status === 'Acknowledged').length;
  }, [incidents]);

  const value = {
    incidents,
    setIncidents,
    ambulances,
    setAmbulances,
    hospitals,
    selectedIncident,
    selectIncident,
    filter,
    setFilter,
    getFilteredIncidents,
    toasts,
    addToast,
    removeToast,
    updateAmbulancePosition,
    dispatchAmbulance,
    getAvailableAmbulances,
    getPendingCount,
    getActiveCount
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
