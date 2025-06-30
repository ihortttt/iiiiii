import React from 'react';
import { DataStats } from '../types/dataTypes';
import { 
  Mail, 
  Cookie, 
  Phone, 
  Key, 
  MapPin, 
  CreditCard, 
  FileText,
  Wifi,
  Fingerprint,
  Database
} from 'lucide-react';

interface DataDashboardProps {
  stats: DataStats;
}

export const DataDashboard: React.FC<DataDashboardProps> = ({ stats }) => {
  const dataTypes = [
    { 
      key: 'emails', 
      label: 'Email адреса', 
      icon: Mail, 
      color: 'blue',
      count: stats.emails 
    },
    { 
      key: 'cookies', 
      label: 'Cookies', 
      icon: Cookie, 
      color: 'orange',
      count: stats.cookies 
    },
    { 
      key: 'phones', 
      label: 'Телефоны', 
      icon: Phone, 
      color: 'green',
      count: stats.phones 
    },
    { 
      key: 'auth', 
      label: 'Авторизация', 
      icon: Key, 
      color: 'purple',
      count: stats.auth 
    },
    { 
      key: 'addresses', 
      label: 'Адреса', 
      icon: MapPin, 
      color: 'red',
      count: stats.addresses 
    },
    { 
      key: 'cards', 
      label: 'Банк. карты', 
      icon: CreditCard, 
      color: 'indigo',
      count: stats.cards 
    },
    { 
      key: 'licenses', 
      label: 'Лицензии', 
      icon: FileText, 
      color: 'teal',
      count: stats.licenses 
    },
    { 
      key: 'webrtc', 
      label: 'WebRTC', 
      icon: Wifi, 
      color: 'cyan',
      count: stats.webrtc 
    },
    { 
      key: 'fingerprints', 
      label: 'Отпечатки', 
      icon: Fingerprint, 
      color: 'pink',
      count: stats.fingerprints 
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      red: 'bg-red-50 text-red-600 border-red-200',
      indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      teal: 'bg-teal-50 text-teal-600 border-teal-200',
      cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200',
      pink: 'bg-pink-50 text-pink-600 border-pink-200'
    };
    return colorMap[color] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Общая статистика */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-6 h-6 text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-800">Общая статистика данных</h2>
        </div>
        
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-gray-800 mb-2">{stats.total.toLocaleString()}</div>
          <div className="text-lg text-gray-600">Всего записей в базе данных</div>
        </div>
      </div>

      {/* Детальная статистика по типам */}
      <div className="grid grid-cols-3 gap-6">
        {dataTypes.map(({ key, label, icon: Icon, color, count }) => (
          <div 
            key={key} 
            className={`border rounded-lg p-6 transition-all hover:shadow-md ${getColorClasses(color)}`}
          >
            <div className="flex items-center justify-between mb-4">
              <Icon className="w-8 h-8" />
              <div className="text-right">
                <div className="text-2xl font-bold">{count.toLocaleString()}</div>
                <div className="text-sm opacity-75">записей</div>
              </div>
            </div>
            <div className="font-medium">{label}</div>
            <div className="text-sm opacity-75 mt-1">
              {((count / stats.total) * 100).toFixed(1)}% от общего объема
            </div>
          </div>
        ))}
      </div>

      {/* Диаграмма распределения */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Распределение данных</h3>
        <div className="space-y-3">
          {dataTypes.filter(type => type.count > 0).map(({ key, label, color, count }) => {
            const percentage = (count / stats.total) * 100;
            return (
              <div key={key} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium">{label}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                  <div 
                    className={`h-3 rounded-full bg-${color}-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-16 text-sm text-right">
                  {count.toLocaleString()}
                </div>
                <div className="w-12 text-sm text-gray-500 text-right">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};