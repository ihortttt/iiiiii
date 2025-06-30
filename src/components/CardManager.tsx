import React, { useState } from 'react';
import { CardData } from '../types/dataTypes';
import { CreditCard, Search, Download, Trash2, Shield, AlertTriangle } from 'lucide-react';

interface CardManagerProps {
  cards: CardData[];
  onCardDelete: (id: string) => void;
  onCardExport: (format: 'json' | 'csv') => void;
}

export const CardManager: React.FC<CardManagerProps> = ({
  cards,
  onCardDelete,
  onCardExport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterValid, setFilterValid] = useState('');

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.cardNumber.includes(searchTerm) ||
                         (card.holderName && card.holderName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !filterType || card.cardType === filterType;
    const matchesValid = !filterValid || card.isValid.toString() === filterValid;
    return matchesSearch && matchesType && matchesValid;
  });

  const validCards = cards.filter(card => card.isValid).length;
  const visaCards = cards.filter(card => card.cardType === 'visa').length;
  const mastercardCards = cards.filter(card => card.cardType === 'mastercard').length;

  const getCardTypeColor = (type: string) => {
    switch (type) {
      case 'visa': return 'bg-blue-100 text-blue-800';
      case 'mastercard': return 'bg-red-100 text-red-800';
      case 'amex': return 'bg-green-100 text-green-800';
      case 'discover': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="w-6 h-6 text-indigo-500" />
        <h2 className="text-2xl font-bold text-gray-800">Менеджер банковских карт</h2>
        <AlertTriangle className="w-5 h-5 text-yellow-500" title="Конфиденциальные данные" />
      </div>

      {/* Предупреждение */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-yellow-600" />
          <span className="font-medium text-yellow-800">
            Внимание: Данные банковских карт являются конфиденциальными и должны обрабатываться согласно требованиям безопасности
          </span>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-indigo-600">{cards.length}</div>
          <div className="text-sm text-indigo-800">Всего карт</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{validCards}</div>
          <div className="text-sm text-green-800">Валидных</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{visaCards}</div>
          <div className="text-sm text-blue-800">Visa</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{mastercardCards}</div>
          <div className="text-sm text-red-800">Mastercard</div>
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
          <option value="visa">Visa</option>
          <option value="mastercard">Mastercard</option>
          <option value="amex">American Express</option>
          <option value="discover">Discover</option>
          <option value="other">Другие</option>
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
          onClick={() => onCardExport('json')}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
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
              <th className="border border-gray-300 px-4 py-2 text-left">Номер карты</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Тип</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Владелец</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Срок действия</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Статус</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Источник</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Дата</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredCards.map(card => (
              <tr key={card.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-mono">{card.cardNumber}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs ${getCardTypeColor(card.cardType)}`}>
                    {card.cardType.toUpperCase()}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2">{card.holderName || '-'}</td>
                <td className="border border-gray-300 px-4 py-2">{card.expiryDate || '-'}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    card.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {card.isValid ? 'Валидная' : 'Невалидная'}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2">{card.source}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(card.timestamp).toLocaleString('ru-RU')}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => onCardDelete(card.id)}
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