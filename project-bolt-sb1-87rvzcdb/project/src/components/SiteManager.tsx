import React, { useState } from 'react';
import { SiteConfig, ParsingRule } from '../types/parser';
import { Plus, Trash2, Settings, CheckCircle, XCircle } from 'lucide-react';

interface SiteManagerProps {
  sites: SiteConfig[];
  onSiteAdd: (site: Omit<SiteConfig, 'id'>) => void;
  onSiteDelete: (id: string) => void;
  onSiteToggle: (id: string) => void;
  onSiteUpdate: (id: string, site: Partial<SiteConfig>) => void;
}

export const SiteManager: React.FC<SiteManagerProps> = ({
  sites,
  onSiteAdd,
  onSiteDelete,
  onSiteToggle,
  onSiteUpdate
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSite, setEditingSite] = useState<string | null>(null);
  const [newSite, setNewSite] = useState({
    url: '',
    name: '',
    isActive: true,
    parsingRules: [] as ParsingRule[],
    customHeaders: {},
    delay: 1000,
    retryCount: 3,
    timeout: 30000,
    followRedirects: true,
    validateSSL: true
  });

  const [newRule, setNewRule] = useState({
    name: '',
    selector: '',
    attribute: '',
    regex: '',
    isEnabled: true,
    dataType: 'text' as const,
    required: false,
    description: ''
  });

  const handleAddSite = () => {
    onSiteAdd(newSite);
    setNewSite({
      url: '',
      name: '',
      isActive: true,
      parsingRules: [],
      customHeaders: {},
      delay: 1000,
      retryCount: 3,
      timeout: 30000,
      followRedirects: true,
      validateSSL: true
    });
    setShowAddForm(false);
  };

  const handleAddRule = () => {
    const rule: ParsingRule = {
      ...newRule,
      id: Date.now().toString()
    };
    setNewSite({
      ...newSite,
      parsingRules: [...newSite.parsingRules, rule]
    });
    setNewRule({
      name: '',
      selector: '',
      attribute: '',
      regex: '',
      isEnabled: true,
      dataType: 'text',
      required: false,
      description: ''
    });
  };

  const commonSelectors = [
    { name: 'Заголовок страницы', selector: 'title', dataType: 'text' },
    { name: 'Все ссылки', selector: 'a', attribute: 'href', dataType: 'link' },
    { name: 'Все изображения', selector: 'img', attribute: 'src', dataType: 'image' },
    { name: 'Email адреса', selector: '[href^="mailto:"]', attribute: 'href', dataType: 'email' },
    { name: 'Телефоны', selector: '[href^="tel:"]', attribute: 'href', dataType: 'phone' },
    { name: 'Цены', selector: '.price, [class*="price"]', dataType: 'price' },
    { name: 'Описания', selector: '.description, [class*="desc"]', dataType: 'text' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Управление сайтами</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Добавить сайт
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Добавить новый сайт</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <input
              type="url"
              placeholder="URL сайта"
              value={newSite.url}
              onChange={(e) => setNewSite({ ...newSite, url: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="text"
              placeholder="Название сайта"
              value={newSite.name}
              onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="number"
              placeholder="Задержка (мс)"
              value={newSite.delay}
              onChange={(e) => setNewSite({ ...newSite, delay: parseInt(e.target.value) })}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="number"
              placeholder="Количество попыток"
              value={newSite.retryCount}
              onChange={(e) => setNewSite({ ...newSite, retryCount: parseInt(e.target.value) })}
              className="border rounded-lg px-3 py-2"
            />
          </div>

          <div className="mb-6">
            <h4 className="font-semibold mb-3">Правила парсинга</h4>
            
            <div className="mb-4">
              <h5 className="font-medium mb-2">Быстрые шаблоны:</h5>
              <div className="grid grid-cols-3 gap-2">
                {commonSelectors.map((template) => (
                  <button
                    key={template.name}
                    onClick={() => setNewRule({
                      ...newRule,
                      name: template.name,
                      selector: template.selector,
                      attribute: template.attribute || '',
                      dataType: template.dataType as any
                    })}
                    className="text-left p-2 border rounded hover:bg-blue-50 transition-colors text-sm"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Название правила"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="CSS селектор"
                value={newRule.selector}
                onChange={(e) => setNewRule({ ...newRule, selector: e.target.value })}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Атрибут (опционально)"
                value={newRule.attribute}
                onChange={(e) => setNewRule({ ...newRule, attribute: e.target.value })}
                className="border rounded-lg px-3 py-2"
              />
              <select
                value={newRule.dataType}
                onChange={(e) => setNewRule({ ...newRule, dataType: e.target.value as any })}
                className="border rounded-lg px-3 py-2"
              >
                <option value="text">Текст</option>
                <option value="link">Ссылка</option>
                <option value="image">Изображение</option>
                <option value="email">Email</option>
                <option value="phone">Телефон</option>
                <option value="price">Цена</option>
                <option value="date">Дата</option>
              </select>
              <input
                type="text"
                placeholder="Регулярное выражение"
                value={newRule.regex}
                onChange={(e) => setNewRule({ ...newRule, regex: e.target.value })}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Описание"
                value={newRule.description}
                onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                className="border rounded-lg px-3 py-2"
              />
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newRule.isEnabled}
                  onChange={(e) => setNewRule({ ...newRule, isEnabled: e.target.checked })}
                />
                Включено
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newRule.required}
                  onChange={(e) => setNewRule({ ...newRule, required: e.target.checked })}
                />
                Обязательное
              </label>
            </div>

            <button
              onClick={handleAddRule}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Добавить правило
            </button>

            {newSite.parsingRules.length > 0 && (
              <div className="mt-4">
                <h5 className="font-medium mb-2">Добавленные правила:</h5>
                <div className="space-y-2">
                  {newSite.parsingRules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between bg-white p-2 rounded border">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={rule.isEnabled}
                          onChange={(e) => {
                            const updatedRules = newSite.parsingRules.map(r =>
                              r.id === rule.id ? { ...r, isEnabled: e.target.checked } : r
                            );
                            setNewSite({ ...newSite, parsingRules: updatedRules });
                          }}
                        />
                        <span className="font-medium">{rule.name}</span>
                        <span className="text-sm text-gray-600">{rule.selector}</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {rule.dataType}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const updatedRules = newSite.parsingRules.filter(r => r.id !== rule.id);
                          setNewSite({ ...newSite, parsingRules: updatedRules });
                        }}
                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddSite}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Добавить сайт
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
        {sites.map((site) => (
          <div key={site.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={site.isActive}
                  onChange={() => onSiteToggle(site.id)}
                  className="w-5 h-5"
                />
                <div>
                  <div className="font-semibold">{site.name}</div>
                  <div className="text-sm text-gray-600">{site.url}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {site.parsingRules.filter(r => r.isEnabled).length} правил активно
                </span>
                <button
                  onClick={() => setEditingSite(editingSite === site.id ? null : site.id)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onSiteDelete(site.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {editingSite === site.id && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Правила парсинга:</h4>
                <div className="space-y-2">
                  {site.parsingRules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between bg-white p-3 rounded border">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={rule.isEnabled}
                          onChange={(e) => {
                            const updatedRules = site.parsingRules.map(r =>
                              r.id === rule.id ? { ...r, isEnabled: e.target.checked } : r
                            );
                            onSiteUpdate(site.id, { parsingRules: updatedRules });
                          }}
                          className="w-4 h-4"
                        />
                        <div>
                          <div className="font-medium">{rule.name}</div>
                          <div className="text-sm text-gray-600">
                            {rule.selector} {rule.attribute && `[${rule.attribute}]`}
                          </div>
                          {rule.description && (
                            <div className="text-xs text-gray-500">{rule.description}</div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {rule.dataType}
                          </span>
                          {rule.required && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              обязательное
                            </span>
                          )}
                        </div>
                      </div>
                      {rule.isEnabled ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};