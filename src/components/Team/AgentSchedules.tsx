import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, Phone, Mail, MoreVertical, Plus, Filter, Search, Download, Eye, Edit, Trash2, CheckCircle, AlertCircle, Calendar as CalendarIcon, Target, TrendingUp, Users, Award } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { unifiedDataService } from '../../services/unifiedDataService';

interface Agent {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  rating: number;
  availability: {
    monday: { start: string; end: string };
    tuesday: { start: string; end: string };
    wednesday: { start: string; end: string };
    thursday: { start: string; end: string };
    friday: { start: string; end: string };
    saturday: { start: string; end: string };
    sunday: { start: string; end: string };
  };
  appointments: Appointment[];
}

interface Appointment {
  id: string;
  title: string;
  type: 'showing' | 'meeting' | 'closing' | 'inspection';
  start: Date;
  end: Date;
  location: string;
  client: {
    name: string;
    phone: string;
    email: string;
  };
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

const AgentSchedules: React.FC = () => {
  const { t } = useTranslation();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Load agents from dataService and generate schedule data
  useEffect(() => {
    const loadAgents = () => {
      const agentsData = unifiedDataService.getAgents();
      const propertiesData = unifiedDataService.getProperties();
      const contactsData = unifiedDataService.getContacts();
      
             // Convert agents to schedule format with appointments
       const agentsWithSchedules = agentsData.map(agent => ({
         id: agent.id,
         name: `${agent.firstName} ${agent.lastName}`,
         role: agent.role || 'Agent',
         phone: agent.phone,
         email: agent.email,
         rating: 4.0 + Math.random() * 1.0, // Generate rating
        availability: {
          monday: { start: '09:00', end: '17:00' },
          tuesday: { start: '09:00', end: '17:00' },
          wednesday: { start: '09:00', end: '17:00' },
          thursday: { start: '09:00', end: '17:00' },
          friday: { start: '09:00', end: '17:00' },
          saturday: { start: '10:00', end: '15:00' },
          sunday: { start: '10:00', end: '15:00' }
        },
        appointments: generateAppointments(agent, propertiesData, contactsData)
      }));

      setAgents(agentsWithSchedules);
    };

    loadAgents();

    // Subscribe to data changes
    unifiedDataService.subscribe('agents', loadAgents);
    unifiedDataService.subscribe('properties', loadAgents);
    unifiedDataService.subscribe('contacts', loadAgents);

    return () => {
      unifiedDataService.unsubscribe('agents', loadAgents);
      unifiedDataService.unsubscribe('properties', loadAgents);
      unifiedDataService.unsubscribe('contacts', loadAgents);
    };
  }, []);

  // Generate appointments for agents based on real data
  const generateAppointments = (agent: any, properties: any[], contacts: any[]): Appointment[] => {
    const appointments: Appointment[] = [];
    const today = new Date();
    
    // Generate some appointments for the next 7 days
    for (let i = 0; i < 7; i++) {
      const appointmentDate = new Date(today);
      appointmentDate.setDate(today.getDate() + i);
      
      // Random chance of having appointments
      if (Math.random() > 0.6) {
        const randomProperty = properties[Math.floor(Math.random() * properties.length)];
        const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
        
        if (randomProperty && randomContact) {
          const startHour = 9 + Math.floor(Math.random() * 8); // 9 AM to 5 PM
          const start = new Date(appointmentDate);
          start.setHours(startHour, 0, 0, 0);
          
          const end = new Date(start);
          end.setHours(startHour + 1); // 1 hour appointments
          
          const appointmentTypes: Appointment['type'][] = ['showing', 'meeting', 'closing', 'inspection'];
          const type = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
          
          appointments.push({
            id: `apt_${agent.id}_${i}`,
            title: `${type === 'showing' ? 'Property Showing' : type === 'meeting' ? 'Client Meeting' : type === 'closing' ? 'Property Closing' : 'Property Inspection'}`,
            type,
            start,
            end,
            location: randomProperty.address,
            client: {
              name: `${randomContact.firstName} ${randomContact.lastName}`,
              phone: randomContact.phone,
              email: randomContact.email
            },
            status: 'scheduled',
            notes: `${type} for ${randomProperty.title}`
          });
        }
      }
    }
    
    return appointments;
  };

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCloseModal = () => {
    setSelectedAgent(null);
    setSelectedAppointment(null);
    setShowAddModal(false);
    setShowScheduleModal(false);
  };

  const handleAddAppointment = () => {
    setShowScheduleModal(true);
  };

  const handleScheduleAppointment = () => {
    // In a real app, this would save to the database
    // Success: Appointment scheduled successfully!
    setShowScheduleModal(false);
  };

  const getAppointmentTypeColor = (type: Appointment['type']) => {
    switch (type) {
      case 'showing':
        return 'bg-blue-100 text-blue-800';
      case 'meeting':
        return 'bg-green-100 text-green-800';
      case 'closing':
        return 'bg-purple-100 text-purple-800';
      case 'inspection':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter agents
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || agent.role.toLowerCase() === filterRole.toLowerCase();
    
    return matchesSearch && matchesRole;
  });

  if (agents.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Agents Found</h3>
            <p className="text-gray-600 mb-6">Add some agents to start managing schedules.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">{t(appContent.agentSchedules.title)}</h3>
          <p className="text-gray-600">{t(appContent.agentSchedules.manageAvailability)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setView('list')}
                  className={`px-4 py-2 rounded-lg ${
                    view === 'list'
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t(appContent.agentSchedules.listView)}
                </button>
                <button
                  onClick={() => setView('calendar')}
                  className={`px-4 py-2 rounded-lg ${
                    view === 'calendar'
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t(appContent.agentSchedules.calendarView)}
                </button>
              </div>
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-all">
                {t(appContent.agentSchedules.scheduleAppointment)}
              </button>
            </div>

            {view === 'list' ? (
              <div className="space-y-4">
                {filteredAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:border-amber-500 cursor-pointer transition-colors"
                    onClick={() => handleAgentClick(agent)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {agent.name}
                        </h4>
                        <p className="text-gray-600">{agent.role}</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-amber-500 mr-1" />
                        <span className="text-gray-600">{agent.rating}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {agent.phone}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {agent.email}
                      </div>
                    </div>
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-900 mb-2">
                        Today's Appointments
                      </h5>
                      <div className="space-y-2">
                        {agent.appointments
                          .filter(
                            (apt) =>
                              apt.start.toDateString() === new Date().toDateString()
                          )
                          .map((appointment) => (
                            <div
                              key={appointment.id}
                              className="p-2 bg-gray-50 rounded-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAppointmentClick(appointment);
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-900">
                                  {appointment.title}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getAppointmentTypeColor(
                                    appointment.type
                                  )}`}
                                >
                                  {appointment.type}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {appointment.start.toLocaleTimeString()} -{' '}
                                {appointment.end.toLocaleTimeString()}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[600px] bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 35 }, (_, i) => {
                      const date = i + 1;
                      const hasEvent = [5, 12, 18, 23, 28].includes(date);
                      return (
                        <div key={i} className={`aspect-square flex items-center justify-center text-sm rounded-lg cursor-pointer transition-colors ${
                          date <= 31 ? 'hover:bg-gray-100' : ''
                        } ${hasEvent ? 'bg-blue-100 text-blue-900 font-semibold' : 'text-gray-700'}`}>
                          {date <= 31 ? date : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Today's Schedule
            </h4>
            <div className="space-y-4">
              {filteredAgents
                .flatMap((agent) =>
                  agent.appointments.filter(
                    (apt) =>
                      apt.start.toDateString() === new Date().toDateString()
                  )
                )
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 bg-amber-50 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors"
                    onClick={() => handleAppointmentClick(appointment)}
                  >
                    <h5 className="font-semibold text-amber-900">
                      {appointment.title}
                    </h5>
                    <p className="text-amber-700 text-sm">
                      {appointment.start.toLocaleTimeString()} -{' '}
                      {appointment.end.toLocaleTimeString()}
                    </p>
                    <p className="text-amber-600 text-sm">
                      {appointment.location}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Agent Availability
            </h4>
            <div className="space-y-4">
              {filteredAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="p-4 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                  onClick={() => handleAgentClick(agent)}
                >
                  <h5 className="font-semibold text-orange-900">
                    {agent.name}
                  </h5>
                  <div className="mt-2 space-y-1">
                    <p className="text-orange-700 text-sm">
                      Mon-Fri: {agent.availability.monday.start} -{' '}
                      {agent.availability.monday.end}
                    </p>
                    <p className="text-orange-700 text-sm">
                      Sat-Sun: {agent.availability.saturday.start} -{' '}
                      {agent.availability.saturday.end}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Agent Details Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedAgent.name}
                </h3>
                <p className="text-gray-600">{selectedAgent.role}</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                <p className="text-gray-600">Phone: {selectedAgent.phone}</p>
                <p className="text-gray-600">Email: {selectedAgent.email}</p>
                <div className="flex items-center mt-2">
                  <Star className="w-4 h-4 text-amber-500 mr-1" />
                  <span className="text-gray-600">{selectedAgent.rating}/5</span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Availability</h4>
                <div className="space-y-1">
                  <p className="text-gray-600">
                    Monday - Friday: {selectedAgent.availability.monday.start} -{' '}
                    {selectedAgent.availability.monday.end}
                  </p>
                  <p className="text-gray-600">
                    Saturday - Sunday: {selectedAgent.availability.saturday.start} -{' '}
                    {selectedAgent.availability.saturday.end}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-4">Upcoming Appointments</h4>
              <div className="space-y-4">
                {selectedAgent.appointments
                  .filter((apt) => apt.start > new Date())
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleAppointmentClick(appointment)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium text-gray-900">
                          {appointment.title}
                        </h5>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getAppointmentTypeColor(
                            appointment.type
                          )}`}
                        >
                          {appointment.type}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {appointment.start.toLocaleDateString()}{' '}
                        {appointment.start.toLocaleTimeString()} -{' '}
                        {appointment.end.toLocaleTimeString()}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Location: {appointment.location}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
                Edit Availability
              </button>
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-all">
                Schedule Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedAppointment.title}
                </h3>
                <p className="text-gray-600">
                  {selectedAppointment.start.toLocaleDateString()}{' '}
                  {selectedAppointment.start.toLocaleTimeString()} -{' '}
                  {selectedAppointment.end.toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Client Information</h4>
                <p className="text-gray-600">
                  Name: {selectedAppointment.client.name}
                </p>
                <p className="text-gray-600">
                  Phone: {selectedAppointment.client.phone}
                </p>
                <p className="text-gray-600">
                  Email: {selectedAppointment.client.email}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                <p className="text-gray-600">
                  {selectedAppointment.location}
                </p>
              </div>
            </div>

            {selectedAppointment.notes && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                <p className="text-gray-600">{selectedAppointment.notes}</p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
                Reschedule
              </button>
              <button className="px-4 py-2 text-red-600 hover:text-red-800">
                Cancel
              </button>
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-all">
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentSchedules; 