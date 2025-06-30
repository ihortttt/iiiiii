import React, { useState, useEffect } from 'react';
import { DatabaseStats, ParsedData } from '../types/parser';
import { Database, Download, Filter, Search, Trash2 } from 'lucide-react';

interface DatabaseViewerProps {
  stats: DatabaseStats;
  data: ParsedData[];
  onDataDelete: (id: string) => void;
  onDataExport: (format: 'json' | 'csv' | 'xml') => void;
}

export const DatabaseViewer: React.FC<DatabaseViewerProps> = ({
  stats,
  data,
  onDataDelete,
  onDataExport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSite, setFilterSite] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        JSON.stringify(item.data).toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.url.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterSite) {
      filtered = filtered.filter(item => item.siteId === filterSite);
    }

    if (filterStatus) {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    setFilteredData(filtered);
  }, [data, searchTerm, filterSite, filterStatus]);

  const uniqueSites = Array.from(new Set(data.map(item => item.siteId)));

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-800">База данных</h2>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.totalRecords}</div>
          <div className="text-sm text-blue-800">Всего записей</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {Object.keys(stats.recordsBySite).length}
          </div>
          <div className="text-sm text-green-800">Сайтов</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {Object.keys(stats.recordsByType).length}
          </div>
          <div className="text-sm text-purple-800">Типов данных</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {formatBytes(stats.storageUsed)}
          </div>
          <div className="text-sm text-orange-800">Использовано</div>
        </div>
      </div>

      {/* Data breakdown */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold mb-3">По типам данных:</h3>
          <div className="space-y-2">
            {Object.entries(stats.recordsByType).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="capitalize">{type}</span>
                <span className="bg-gray-100 px-2 py-1 rounded text-sm">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-3">По сайтам:</h3>
          <div className="space-y-2">
            {Object.entries(stats.recordsBySite).map(([site, count]) => (
              <div key={site} className="flex justify-between items-center">
                <span className="truncate">{site}</span>
                <span className="bg-gray-100 px-2 py-1 rounded text-sm">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по данным..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <select
          value={filterSite}
          onChange={(e) => setFilterSite(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Все сайты</option>
          {uniqueSites.map((site) => (
            <option key={site} value={site}>{site}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Все статусы</option>
          <option value="success">Успешно</option>
          <option value="partial">Частично</option>
          <option value="failed">Ошибка</option>
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => onDataExport('json')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            JSON
          </button>
          <button
            onClick={() => onDataExport('csv')}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button
            onClick={() => onDataExport('xml')}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            XML
          </button>
        </div>
      </div>

      {/* Data table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-2 text-left">Дата</th>
              <th className="border border-gray-300 px-4 py-2 text-left">URL</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Статус</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Данные</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Время</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(item.timestamp).toLocaleString('ru-RU')}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline truncate block max-w-xs"
                  >
                    {item.url}
                  </a>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.status === 'success' ? 'bg-green-100 text-green-800' :
                    item.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status === 'success' ? 'Успешно' :
                     item.status === 'partial' ? 'Частично' : 'Ошибка'}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="max-w-xs overflow-hidden">
                    <details>
                      <summary className="cursor-pointer text-blue-500">
                        {Object.keys(item.data).length} полей
                      </summary>
                      <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto max-h-32">
                        {JSON.stringify(item.data, null, 2)}
                      </pre>
                    </details>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.processingTime}ms
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => onDataDelete(item.id)}
                    className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Нет данных для отображения
        </div>
      )}
    </div>
  );
};