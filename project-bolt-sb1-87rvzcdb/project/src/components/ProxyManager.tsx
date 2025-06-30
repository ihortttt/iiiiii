import React, { useState, useEffect } from 'react';
import { ProxyConfig } from '../types/parser';
import { CheckCircle, XCircle, Clock, Plus, Trash2, RefreshCw } from 'lucide-react';

interface ProxyManagerProps {
  proxies: ProxyConfig[];
  onProxyAdd: (proxy: Omit<ProxyConfig, 'id'>) => void;
  onProxyDelete: (id: string) => void;
  onProxyToggle: (id: string) => void;
  onProxyCheck: (id: string) => void;
}

export const ProxyManager: React.FC<ProxyManagerProps> = ({
  proxies,
  onProxyAdd,
  onProxyDelete,
  onProxyToggle,
  onProxyCheck
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProxy, setNewProxy] = useState({
    host: '',
    port: 8080,
    username: '',
    password: '',
    protocol: 'http' as const,
    isActive: true,
    status: 'checking' as const,
    responseTime: 0,
    country: '',
    anonymityLevel: 'anonymous' as const,
    lastChecked: new Date()
  });

  const handleAddProxy = () => {
    onProxyAdd(newProxy);
    setNewProxy({
      host: '',
      port: 8080,
      username: '',
      password: '',
      protocol: 'http',
      isActive: true,
      status: 'checking',
      responseTime: 0,
      country: '',
      anonymityLevel: 'anonymous',
      lastChecked: new Date()
    });
    setShowAddForm(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Управление прокси</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Добавить прокси
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Добавить новый прокси</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Хост"
              value={newProxy.host}
              onChange={(e) => setNewProxy({ ...newProxy, host: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="number"
              placeholder="Порт"
              value={newProxy.port}
              onChange={(e) => setNewProxy({ ...newProxy, port: parseInt(e.target.value) })}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="text"
              placeholder="Логин (опционально)"
              value={newProxy.username}
              onChange={(e) => setNewProxy({ ...newProxy, username: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="password"
              placeholder="Пароль (опционально)"
              value={newProxy.password}
              onChange={(e) => setNewProxy({ ...newProxy, password: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <select
              value={newProxy.protocol}
              onChange={(e) => setNewProxy({ ...newProxy, protocol: e.target.value as any })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="http">HTTP</option>
              <option value="https">HTTPS</option>
              <option value="socks4">SOCKS4</option>
              <option value="socks5">SOCKS5</option>
            </select>
            <select
              value={newProxy.anonymityLevel}
              onChange={(e) => setNewProxy({ ...newProxy, anonymityLevel: e.target.value as any })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="transparent">Прозрачный</option>
              <option value="anonymous">Анонимный</option>
              <option value="elite">Элитный</option>
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddProxy}
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
        {proxies.map((proxy) => (
          <div key={proxy.id} className="border rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={proxy.isActive}
                onChange={() => onProxyToggle(proxy.id)}
                className="w-5 h-5"
              />
              <div>
                <div className="font-semibold">
                  {proxy.protocol.toUpperCase()}://{proxy.host}:{proxy.port}
                </div>
                <div className="text-sm text-gray-600">
                  {proxy.country && `${proxy.country} • `}
                  {proxy.anonymityLevel} • {proxy.responseTime}ms
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(proxy.status)}
              <button
                onClick={() => onProxyCheck(proxy.id)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => onProxyDelete(proxy.id)}
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