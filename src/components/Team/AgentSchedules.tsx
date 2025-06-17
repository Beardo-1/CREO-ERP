import React, { useState } from 'react';
import { Calendar, Clock, User, MapPin, Phone, Mail, Star } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

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

const mockAgents: Agent[] = [
  {
    id: 'a1',
    name: 'Emma Wilson',
    role: 'Senior Agent',
    phone: '(555) 123-4567',
    email: 'emma.wilson@creo.com',
    rating: 4.8,
    availability: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' },
      saturday: { start: '10:00', end: '15:00' },
      sunday: { start: '10:00', end: '15:00' }
    },
    appointments: [
      {
        id: 'apt1',
        title: 'Property Showing',
        type: 'showing',
        start: new Date(2024, 2, 15, 14, 0),
        end: new Date(2024, 2, 15, 15, 0),
        location: '123 Oak Street',
        client: {
          name: 'John Smith',
          phone: '(555) 987-6543',
          email: 'john.smith@email.com'
        },
        status: 'scheduled',
        notes: 'Client interested in backyard space'
      }
    ]
  },
  {
    id: 'a2',
    name: 'Michael Brown',
    role: 'Agent',
    phone: '(555) 234-5678',
    email: 'michael.brown@creo.com',
    rating: 4.5,
    availability: {
      monday: { start: '10:00', end: '18:00' },
      tuesday: { start: '10:00', end: '18:00' },
      wednesday: { start: '10:00', end: '18:00' },
      thursday: { start: '10:00', end: '18:00' },
      friday: { start: '10:00', end: '18:00' },
      saturday: { start: '11:00', end: '16:00' },
      sunday: { start: '11:00', end: '16:00' }
    },
    appointments: []
  }
];

const AgentSchedules: React.FC = () => {
  const { t } = useTranslation();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCloseModal = () => {
    setSelectedAgent(null);
    setSelectedAppointment(null);
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
                {mockAgents.map((agent) => (
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
                <p className="text-gray-500">Calendar view coming soon</p>
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
              {mockAgents
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
              {mockAgents.map((agent) => (
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