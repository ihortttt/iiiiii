import React, { useState } from 'react';
import { CookieData } from '../types/dataTypes';
import { Cookie, Search, Download, Trash2, Shield, Clock } from 'lucide-react';

interface CookieManagerProps {
  cookies: CookieData[];
  onCookieDelete: (id: string) => void;
  onCookieExport: (format: 'json' | 'csv') => void;
}

export const CookieManager: React.FC<CookieManagerProps> = ({
  cookies,
  onCookieDelete,
  onCookieExport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('');
  const [filterSecure, setFilterSecure] = useState('');

  const filteredCookies = cookies.filter(cookie => {
    const matchesSearch = cookie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cookie.value.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = !filterDomain || cookie.domain === filterDomain;
    const matchesSecure = !filterSecure || cookie.secure.toString() === filterSecure;
    return matchesSearch && matchesDomain && matchesSecure;
  });

  const uniqueDomains = Array.from(new Set(cookies.map(cookie => cookie.domain)));
  const secureCookies = cookies.filter(cookie => cookie.secure).length;
  const httpOnlyCookies = cookies.filter(cookie => cookie.httpOnly).length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Cookie className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-800">Менеджер Cookies</h2>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{cookies.length}</div>
          <div className="text-sm text-orange-800">Всего cookies</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{secureCookies}</div>
          <div className="text-sm text-green-800">Безопасных</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{httpOnlyCookies}</div>
          <div className="text-sm text-blue-800">HttpOnly</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{uniqueDomains.length}</div>
          <div className="text-sm text-purple-800">Доменов</div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по имени или значению..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
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
        <select
          value={filterSecure}
          onChange={(e) => setFilterSecure(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Все</option>
          <option value="true">Безопасные</option>
          <option value="false">Небезопасные</option>
        </select>
        <button
          onClick={() => onCookieExport('json')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
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
              <th className="border border-gray-300 px-4 py-2 text-left">Имя</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Значение</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Домен</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Безопасность</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Истекает</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Источник</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredCookies.map(cookie => (
              <tr key={cookie.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-medium">{cookie.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <span className="truncate block max-w-xs" title={cookie.value}>
                    {cookie.value.length > 50 ? `${cookie.value.substring(0, 50)}...` : cookie.value}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2">{cookie.domain}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex gap-1">
                    {cookie.secure && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Secure
                      </span>
                    )}
                    {cookie.httpOnly && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        HttpOnly
                      </span>
                    )}
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {cookie.expires ? (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {new Date(cookie.expires).toLocaleDateString('ru-RU')}
                    </div>
                  ) : (
                    <span className="text-gray-500">Сессия</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">{cookie.source}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => onCookieDelete(cookie.id)}
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