import React, { useState } from 'react';
import { AddressData } from '../types/dataTypes';
import { MapPin, Search, Download, Trash2, Globe } from 'lucide-react';

interface AddressManagerProps {
  addresses: AddressData[];
  onAddressDelete: (id: string) => void;
  onAddressExport: (format: 'json' | 'csv') => void;
}

export const AddressManager: React.FC<AddressManagerProps> = ({
  addresses,
  onAddressDelete,
  onAddressExport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterCity, setFilterCity] = useState('');

  const filteredAddresses = addresses.filter(address => {
    const matchesSearch = address.fullAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !filterCountry || address.country === filterCountry;
    const matchesCity = !filterCity || address.city === filterCity;
    return matchesSearch && matchesCountry && matchesCity;
  });

  const uniqueCountries = Array.from(new Set(addresses.map(addr => addr.country).filter(Boolean)));
  const uniqueCities = Array.from(new Set(addresses.map(addr => addr.city).filter(Boolean)));
  const withCoordinates = addresses.filter(addr => addr.coordinates).length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="w-6 h-6 text-red-500" />
        <h2 className="text-2xl font-bold text-gray-800">Менеджер адресов</h2>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{addresses.length}</div>
          <div className="text-sm text-red-800">Всего адресов</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{withCoordinates}</div>
          <div className="text-sm text-blue-800">С координатами</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{uniqueCountries.length}</div>
          <div className="text-sm text-green-800">Стран</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{uniqueCities.length}</div>
          <div className="text-sm text-purple-800">Городов</div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по адресу..."
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
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Все города</option>
          {uniqueCities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <button
          onClick={() => onAddressExport('json')}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
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
              <th className="border border-gray-300 px-4 py-2 text-left">Полный адрес</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Город</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Регион</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Страна</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Индекс</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Координаты</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Источник</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredAddresses.map(address => (
              <tr key={address.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{address.fullAddress}</td>
                <td className="border border-gray-300 px-4 py-2">{address.city || '-'}</td>
                <td className="border border-gray-300 px-4 py-2">{address.region || '-'}</td>
                <td className="border border-gray-300 px-4 py-2">{address.country || '-'}</td>
                <td className="border border-gray-300 px-4 py-2">{address.postalCode || '-'}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {address.coordinates ? (
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-mono">
                        {address.coordinates.lat.toFixed(4)}, {address.coordinates.lng.toFixed(4)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">{address.source}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => onAddressDelete(address.id)}
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