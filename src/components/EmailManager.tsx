import React, { useState } from 'react';
import { EmailData } from '../types/dataTypes';
import { Mail, Search, Download, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface EmailManagerProps {
  emails: EmailData[];
  onEmailDelete: (id: string) => void;
  onEmailExport: (format: 'json' | 'csv') => void;
}

export const EmailManager: React.FC<EmailManagerProps> = ({
  emails,
  onEmailDelete,
  onEmailExport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('');
  const [filterValid, setFilterValid] = useState('');

  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = !filterDomain || email.domain === filterDomain;
    const matchesValid = !filterValid || email.isValid.toString() === filterValid;
    return matchesSearch && matchesDomain && matchesValid;
  });

  const uniqueDomains = Array.from(new Set(emails.map(email => email.domain)));
  const validEmails = emails.filter(email => email.isValid).length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Mail className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-800">Менеджер Email адресов</h2>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{emails.length}</div>
          <div className="text-sm text-blue-800">Всего email</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{validEmails}</div>
          <div className="text-sm text-green-800">Валидных</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{uniqueDomains.length}</div>
          <div className="text-sm text-purple-800">Доменов</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {emails.filter(email => email.verified).length}
          </div>
          <div className="text-sm text-orange-800">Проверенных</div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по email..."
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
          value={filterValid}
          onChange={(e) => setFilterValid(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Все</option>
          <option value="true">Валидные</option>
          <option value="false">Невалидные</option>
        </select>
        <button
          onClick={() => onEmailExport('json')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
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
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Домен</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Статус</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Источник</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Дата</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmails.map(email => (
              <tr key={email.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{email.email}</td>
                <td className="border border-gray-300 px-4 py-2">{email.domain}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex items-center gap-2">
                    {email.isValid ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className={email.isValid ? 'text-green-600' : 'text-red-600'}>
                      {email.isValid ? 'Валидный' : 'Невалидный'}
                    </span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">{email.source}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(email.timestamp).toLocaleString('ru-RU')}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => onEmailDelete(email.id)}
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