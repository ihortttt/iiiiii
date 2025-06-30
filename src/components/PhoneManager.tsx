import React, { useState } from 'react';
import { PhoneData } from '../types/dataTypes';
import { Phone, Search, Download, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface PhoneManagerProps {
  phones: PhoneData[];
  onPhoneDelete: (id: string) => void;
  onPhoneExport: (format: 'json' | 'csv') => void;
}

export const PhoneManager: React.FC<PhoneManagerProps> = ({
  phones,
  onPhoneDelete,
  onPhoneExport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterType, setFilterType] = useState('');

  const filteredPhones = phones.filter(phone => {
    const matchesSearch = phone.phone.includes(searchTerm);
    const matchesCountry = !filterCountry || phone.country === filterCountry;
    const matchesType = !filterType || phone.type === filterType;
    return matchesSearch && matchesCountry && matchesType;
  });

  const uniqueCountries = Array.from(new Set(phones.map(phone => phone.country)));
  const validPhones = phones.filter(phone => phone.isValid).length;
  const mobilePhones = phones.filter(phone => phone.type === 'mobile').length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Phone className="w-6 h-6 text-green-500" />
        <h2 className="text-2xl font-bold text-gray-800">Менеджер телефонов</h2>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{phones.length}</div>
          <div className="text-sm text-green-800">Всего номеров</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{validPhones}</div>
          <div className="text-sm text-blue-800">Валидных</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{mobilePhones}</div>
          <div className="text-sm text-purple-800">Мобильных</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{uniqueCountries.length}</div>
          <div className="text-sm text-orange-800">Стран</div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по номеру..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <select
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Все страны</option>
          {uniqueCountries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Все типы</option>
          <option value="mobile">Мобильный</option>
          <option value="landline">Стационарный</option>
          <option value="voip">VoIP</option>
        </select>
        <button
          onClick={() => onPhoneExport('json')}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
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
              <th className="border border-gray-300 px-4 py-2 text-left">Номер</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Страна</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Регион</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Тип</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Оператор</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Статус</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Источник</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredPhones.map(phone => (
              <tr key={phone.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-mono">{phone.phone}</td>
                <td className="border border-gray-300 px-4 py-2">{phone.country}</td>
                <td className="border border-gray-300 px-4 py-2">{phone.region || '-'}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    phone.type === 'mobile' ? 'bg-blue-100 text-blue-800' :
                    phone.type === 'landline' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {phone.type === 'mobile' ? 'Мобильный' :
                     phone.type === 'landline' ? 'Стационарный' : 'VoIP'}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2">{phone.carrier || '-'}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex items-center gap-2">
                    {phone.isValid ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className={phone.isValid ? 'text-green-600' : 'text-red-600'}>
                      {phone.isValid ? 'Валидный' : 'Невалидный'}
                    </span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">{phone.source}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => onPhoneDelete(phone.id)}
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