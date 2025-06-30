import React, { useState } from 'react';
import { LicenseData } from '../types/dataTypes';
import { FileText, Search, Download, Trash2, Calendar, User } from 'lucide-react';

interface LicenseManagerProps {
  licenses: LicenseData[];
  onLicenseDelete: (id: string) => void;
  onLicenseExport: (format: 'json' | 'csv') => void;
}

export const LicenseManager: React.FC<LicenseManagerProps> = ({
  licenses,
  onLicenseDelete,
  onLicenseExport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterRegion, setFilterRegion] = useState('');

  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = license.licenseNumber.includes(searchTerm) ||
                         (license.holderName && license.holderName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !filterType || license.type === filterType;
    const matchesRegion = !filterRegion || license.region === filterRegion;
    return matchesSearch && matchesType && matchesRegion;
  });

  const uniqueRegions = Array.from(new Set(licenses.map(license => license.region).filter(Boolean)));
  const driverLicenses = licenses.filter(license => license.type === 'driver').length;
  const businessLicenses = licenses.filter(license => license.type === 'business').length;
  const expiredLicenses = licenses.filter(license => 
    license.expiryDate && new Date(license.expiryDate) < new Date()
  ).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'driver': return 'bg-blue-100 text-blue-800';
      case 'business': return 'bg-green-100 text-green-800';
      case 'professional': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpired = (expiryDate?: Date) => {
    return expiryDate && new Date(expiryDate) < new Date();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-teal-500" />
        <h2 className="text-2xl font-bold text-gray-800">Менеджер лицензий</h2>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-teal-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-teal-600">{licenses.length}</div>
          <div className="text-sm text-teal-800">Всего лицензий</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{driverLicenses}</div>
          <div className="text-sm text-blue-800">Водительских</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{businessLicenses}</div>
          <div className="text-sm text-green-800">Бизнес</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{expiredLicenses}</div>
          <div className="text-sm text-red-800">Просроченных</div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по номеру или владельцу..."
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
          <option value="driver">Водительские</option>
          <option value="business">Бизнес</option>
          <option value="professional">Профессиональные</option>
          <option value="other">Другие</option>
        </select>
        <select
          value={filterRegion}
          onChange={(e) => setFilterRegion(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Все регионы</option>
          {uniqueRegions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
        <button
          onClick={() => onLicenseExport('json')}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
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
              <th className="border border-gray-300 px-4 py-2 text-left">Номер лицензии</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Тип</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Владелец</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Выдавший орган</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Регион</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Срок действия</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Источник</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredLicenses.map(license => (
              <tr key={license.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-mono">{license.licenseNumber}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs ${getTypeColor(license.type)}`}>
                    {license.type === 'driver' ? 'Водительские' :
                     license.type === 'business' ? 'Бизнес' :
                     license.type === 'professional' ? 'Профессиональные' : 'Другие'}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {license.holderName ? (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4 text-gray-400" />
                      {license.holderName}
                    </div>
                  ) : '-'}
                </td>
                <td className="border border-gray-300 px-4 py-2">{license.issuer || '-'}</td>
                <td className="border border-gray-300 px-4 py-2">{license.region || '-'}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {license.expiryDate ? (
                    <div className={`flex items-center gap-1 ${isExpired(license.expiryDate) ? 'text-red-600' : ''}`}>
                      <Calendar className="w-4 h-4" />
                      {new Date(license.expiryDate).toLocaleDateString('ru-RU')}
                      {isExpired(license.expiryDate) && (
                        <span className="text-xs bg-red-100 text-red-800 px-1 rounded">Просрочена</span>
                      )}
                    </div>
                  ) : '-'}
                </td>
                <td className="border border-gray-300 px-4 py-2">{license.source}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => onLicenseDelete(license.id)}
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