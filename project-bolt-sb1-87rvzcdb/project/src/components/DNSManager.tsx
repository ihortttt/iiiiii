import React, { useState } from 'react';
import { DNSConfig } from '../types/parser';
import { CheckCircle, XCircle, Plus, Trash2, RefreshCw } from 'lucide-react';

interface DNSManagerProps {
  dnsConfigs: DNSConfig[];
  onDNSAdd: (dns: Omit<DNSConfig, 'id'>) => void;
  onDNSDelete: (id: string) => void;
  onDNSToggle: (id: string) => void;
  onDNSCheck: (id: string) => void;
}

export const DNSManager: React.FC<DNSManagerProps> = ({
  dnsConfigs,
  onDNSAdd,
  onDNSDelete,
  onDNSToggle,
  onDNSCheck
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDNS, setNewDNS] = useState({
    name: '',
    primary: '',
    secondary: '',
    isActive: true,
    responseTime: 0,
    reliability: 100,
    provider: ''
  });

  const handleAddDNS = () => {
    onDNSAdd(newDNS);
    setNewDNS({
      name: '',
      primary: '',
      secondary: '',
      isActive: true,
      responseTime: 0,
      reliability: 100,
      provider: ''
    });
    setShowAddForm(false);
  };

  const popularDNS = [
    { name: 'Google DNS', primary: '8.8.8.8', secondary: '8.8.4.4', provider: 'Google' },
    { name: 'Cloudflare DNS', primary: '1.1.1.1', secondary: '1.0.0.1', provider: 'Cloudflare' },
    { name: 'OpenDNS', primary: '208.67.222.222', secondary: '208.67.220.220', provider: 'OpenDNS' },
    { name: 'Quad9', primary: '9.9.9.9', secondary: '149.112.112.112', provider: 'Quad9' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Управление DNS</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Добавить DNS
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Добавить DNS сервер</h3>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">Популярные DNS серверы:</h4>
            <div className="grid grid-cols-2 gap-2">
              {popularDNS.map((dns) => (
                <button
                  key={dns.name}
                  onClick={() => setNewDNS({
                    ...newDNS,
                    name: dns.name,
                    primary: dns.primary,
                    secondary: dns.secondary,
                    provider: dns.provider
                  })}
                  className="text-left p-2 border rounded hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium">{dns.name}</div>
                  <div className="text-sm text-gray-600">{dns.primary}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Название"
              value={newDNS.name}
              onChange={(e) => setNewDNS({ ...newDNS, name: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="text"
              placeholder="Провайдер"
              value={newDNS.provider}
              onChange={(e) => setNewDNS({ ...newDNS, provider: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="text"
              placeholder="Основной DNS"
              value={newDNS.primary}
              onChange={(e) => setNewDNS({ ...newDNS, primary: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="text"
              placeholder="Резервный DNS (опционально)"
              value={newDNS.secondary}
              onChange={(e) => setNewDNS({ ...newDNS, secondary: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddDNS}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Добавить
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {dnsConfigs.map((dns) => (
          <div key={dns.id} className="border rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={dns.isActive}
                onChange={() => onDNSToggle(dns.id)}
                className="w-5 h-5"
              />
              <div>
                <div className="font-semibold">{dns.name}</div>
                <div className="text-sm text-gray-600">
                  {dns.primary} {dns.secondary && `• ${dns.secondary}`}
                </div>
                <div className="text-xs text-gray-500">
                  {dns.provider} • {dns.responseTime}ms • {dns.reliability}% надежность
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {dns.reliability > 90 ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <button
                onClick={() => onDNSCheck(dns.id)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDNSDelete(dns.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};