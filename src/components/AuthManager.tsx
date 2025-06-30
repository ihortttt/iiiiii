import React, { useState } from 'react';
import { AuthData } from '../types/dataTypes';
import { Key, Search, Download, Trash2, Shield, Eye, EyeOff } from 'lucide-react';

interface AuthManagerProps {
  authData: AuthData[];
  onAuthDelete: (id: string) => void;
  onAuthExport: (format: 'json' | 'csv') => void;
}

export const AuthManager: React.FC<AuthManagerProps> = ({
  authData,
  onAuthDelete,
  onAuthExport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDomain, setFilterDomain] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  const filteredAuth = authData.filter(auth => {
    const matchesSearch = auth.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (auth.username && auth.username.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !filterType || auth.type === filterType;
    const matchesDomain = !filterDomain || auth.domain === filterDomain;
    return matchesSearch && matchesType && matchesDomain;
  });

  const uniqueDomains = Array.from(new Set(authData.map(auth => auth.domain)));
  const passwords = authData.filter(auth => auth.type === 'password');
  const tokens = authData.filter(auth => auth.type === 'token');
  const logins = authData.filter(auth => auth.type === 'login');

  const getStrengthColor = (strength?: string) => {
    switch (strength) {
      case 'strong': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'weak': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Key className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-gray-800">Менеджер авторизации</h2>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{authData.length}</div>
          <div className="text-sm text-purple-800">Всего записей</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{passwords.length}</div>
          <div className="text-sm text-blue-800">Паролей</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{tokens.length}</div>
          <div className="text-sm text-green-800">Токенов</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{logins.length}</div>
          <div className="text-sm text-orange-800">Логинов</div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по логину или значению..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Все типы</option>
          <option value="login">Логины</option>
          <option value="password">Пароли</option>
          <option value="token">Токены</option>
        </select>
        <select
          value={filterDomain}
          onChange={(e) => setFilterDomain(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Все домены</option>
          {uniqueDomains.map(domain => (
            <option key={domain} value={domain}>{domain}</option>
          ))}
        </select>
        <button
          onClick={() => setShowPasswords(!showPasswords)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showPasswords ? 'Скрыть' : 'Показать'}
        </button>
        <button
          onClick={() => onAuthExport('json')}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Экспорт
        </button>
      </div>

      {/* Таблица */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-2 text-left">Тип</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Логин</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Значение</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Домен</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Сила</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Источник</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Дата</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredAuth.map(auth => (
              <tr key={auth.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    auth.type === 'login' ? 'bg-blue-100 text-blue-800' :
                    auth.type === 'password' ? 'bg-red-100 text-red-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {auth.type === 'login' ? 'Логин' :
                     auth.type === 'password' ? 'Пароль' : 'Токен'}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2">{auth.username || '-'}</td>
                <td className="border border-gray-300 px-4 py-2 font-mono">
                  {auth.type === 'password' && !showPasswords ? 
                    '••••••••' : 
                    (auth.value.length > 30 ? `${auth.value.substring(0, 30)}...` : auth.value)
                  }
                </td>
                <td className="border border-gray-300 px-4 py-2">{auth.domain}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {auth.strength && (
                    <span className={`px-2 py-1 rounded text-xs ${getStrengthColor(auth.strength)}`}>
                      {auth.strength === 'strong' ? 'Сильный' :
                       auth.strength === 'medium' ? 'Средний' : 'Слабый'}
                    </span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">{auth.source}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(auth.timestamp).toLocaleString('ru-RU')}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => onAuthDelete(auth.id)}
                    className="text-red-500 hover:bg-red-50 p-1 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};