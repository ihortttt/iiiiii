import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ProxyManager } from './components/ProxyManager';
import { DNSManager } from './components/DNSManager';
import { SiteManager } from './components/SiteManager';
import { AIAssistantManager } from './components/AIAssistantManager';
import { DatabaseViewer } from './components/DatabaseViewer';
import { EmailManager } from './components/EmailManager';
import { CookieManager } from './components/CookieManager';
import { PhoneManager } from './components/PhoneManager';
import { AuthManager } from './components/AuthManager';
import { AddressManager } from './components/AddressManager';
import { CardManager } from './components/CardManager';
import { LicenseManager } from './components/LicenseManager';
import { DataDashboard } from './components/DataDashboard';
import { 
  ProxyConfig, 
  DNSConfig, 
  SiteConfig, 
  AIAssistant, 
  VoiceConfig,
  ParsedData,
  DatabaseStats
} from './types/parser';
import {
  EmailData,
  CookieData,
  PhoneData,
  AuthData,
  AddressData,
  CardData,
  LicenseData,
  DataStats
} from './types/dataTypes';
import { 
  Globe, 
  Database, 
  Bot, 
  Settings, 
  Shield, 
  Play, 
  Pause,
  Activity,
  Mail,
  Cookie,
  Phone,
  Key,
  MapPin,
  CreditCard,
  FileText,
  BarChart3
} from 'lucide-react';

function App() {
  const [proxies, setProxies] = useState<ProxyConfig[]>([]);
  const [dnsConfigs, setDNSConfigs] = useState<DNSConfig[]>([]);
  const [sites, setSites] = useState<SiteConfig[]>([]);
  const [assistants, setAssistants] = useState<AIAssistant[]>([]);
  const [voiceConfig, setVoiceConfig] = useState<VoiceConfig>({
    enabled: false,
    gender: 'female',
    voice: 'Алиса (Русский)',
    speed: 1.0,
    pitch: 1.0,
    volume: 0.8,
    language: 'ru-RU'
  });
  const [parsedData, setParsedData] = useState<ParsedData[]>([]);
  const [isParsingActive, setIsParsingActive] = useState(false);
  const [parsingStats, setParsingStats] = useState({
    totalSites: 0,
    activeSites: 0,
    successfulParsing: 0,
    failedParsing: 0
  });

  // Данные по типам
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [cookies, setCookies] = useState<CookieData[]>([]);
  const [phones, setPhones] = useState<PhoneData[]>([]);
  const [authData, setAuthData] = useState<AuthData[]>([]);
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [licenses, setLicenses] = useState<LicenseData[]>([]);

  const [databaseStats, setDatabaseStats] = useState<DatabaseStats>({
    totalRecords: 0,
    recordsByType: {},
    recordsBySite: {},
    recordsByDate: {},
    storageUsed: 0,
    lastUpdate: new Date()
  });

  const [dataStats, setDataStats] = useState<DataStats>({
    emails: 0,
    cookies: 0,
    webrtc: 0,
    fingerprints: 0,
    auth: 0,
    phones: 0,
    addresses: 0,
    cards: 0,
    licenses: 0,
    total: 0
  });

  // Initialize with default configurations and sample data
  useEffect(() => {
    // Default DNS configurations
    setDNSConfigs([
      {
        id: '1',
        name: 'Google DNS',
        primary: '8.8.8.8',
        secondary: '8.8.4.4',
        isActive: true,
        responseTime: 15,
        reliability: 99,
        provider: 'Google'
      },
      {
        id: '2',
        name: 'Cloudflare DNS',
        primary: '1.1.1.1',
        secondary: '1.0.0.1',
        isActive: false,
        responseTime: 12,
        reliability: 98,
        provider: 'Cloudflare'
      }
    ]);

    // Default AI Assistant
    setAssistants([
      {
        id: '1',
        name: 'Главный помощник',
        provider: 'free',
        model: 'huggingface-inference',
        isActive: true,
        permissions: {
          canModifyCode: true,
          canAccessDatabase: true,
          canManageProxies: true,
          canManageSites: true,
          canViewLogs: true
        },
        restrictions: {
          maxRequestsPerHour: 100,
          allowedDomains: [],
          forbiddenActions: []
        }
      }
    ]);

    // Sample data
    generateSampleData();
  }, []);

  const generateSampleData = () => {
    // Sample emails
    const sampleEmails: EmailData[] = [
      {
        id: '1',
        email: 'user@example.com',
        domain: 'example.com',
        isValid: true,
        source: 'site1.com',
        timestamp: new Date(),
        verified: true
      },
      {
        id: '2',
        email: 'admin@test.org',
        domain: 'test.org',
        isValid: true,
        source: 'site2.com',
        timestamp: new Date(),
        verified: false
      }
    ];

    // Sample cookies
    const sampleCookies: CookieData[] = [
      {
        id: '1',
        name: 'session_id',
        value: 'abc123def456',
        domain: 'example.com',
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        source: 'site1.com',
        timestamp: new Date()
      }
    ];

    // Sample phones
    const samplePhones: PhoneData[] = [
      {
        id: '1',
        phone: '+7 (999) 123-45-67',
        country: 'Россия',
        region: 'Москва',
        carrier: 'МТС',
        type: 'mobile',
        isValid: true,
        source: 'site1.com',
        timestamp: new Date()
      }
    ];

    setEmails(sampleEmails);
    setCookies(sampleCookies);
    setPhones(samplePhones);
  };

  useEffect(() => {
    updateStats();
    updateDataStats();
  }, [sites, parsedData, emails, cookies, phones, authData, addresses, cards, licenses]);

  const updateStats = () => {
    const activeSites = sites.filter(site => site.isActive).length;
    const successful = parsedData.filter(data => data.status === 'success').length;
    const failed = parsedData.filter(data => data.status === 'failed').length;

    setParsingStats({
      totalSites: sites.length,
      activeSites,
      successfulParsing: successful,
      failedParsing: failed
    });

    // Update database stats
    const recordsByType: { [key: string]: number } = {};
    const recordsBySite: { [key: string]: number } = {};
    const recordsByDate: { [key: string]: number } = {};

    parsedData.forEach(data => {
      recordsBySite[data.siteId] = (recordsBySite[data.siteId] || 0) + 1;
      const date = new Date(data.timestamp).toDateString();
      recordsByDate[date] = (recordsByDate[date] || 0) + 1;
      Object.keys(data.data).forEach(key => {
        recordsByType[key] = (recordsByType[key] || 0) + 1;
      });
    });

    setDatabaseStats({
      totalRecords: parsedData.length,
      recordsByType,
      recordsBySite,
      recordsByDate,
      storageUsed: JSON.stringify(parsedData).length,
      lastUpdate: new Date()
    });
  };

  const updateDataStats = () => {
    const total = emails.length + cookies.length + phones.length + authData.length + 
                 addresses.length + cards.length + licenses.length;
    
    setDataStats({
      emails: emails.length,
      cookies: cookies.length,
      webrtc: 0, // Placeholder
      fingerprints: 0, // Placeholder
      auth: authData.length,
      phones: phones.length,
      addresses: addresses.length,
      cards: cards.length,
      licenses: licenses.length,
      total
    });
  };

  // Proxy management
  const handleProxyAdd = (proxy: Omit<ProxyConfig, 'id'>) => {
    const newProxy: ProxyConfig = {
      ...proxy,
      id: Date.now().toString()
    };
    setProxies([...proxies, newProxy]);
  };

  const handleProxyDelete = (id: string) => {
    setProxies(proxies.filter(proxy => proxy.id !== id));
  };

  const handleProxyToggle = (id: string) => {
    setProxies(proxies.map(proxy =>
      proxy.id === id ? { ...proxy, isActive: !proxy.isActive } : proxy
    ));
  };

  const handleProxyCheck = (id: string) => {
    setProxies(proxies.map(proxy =>
      proxy.id === id ? { 
        ...proxy, 
        status: Math.random() > 0.3 ? 'working' : 'failed',
        responseTime: Math.floor(Math.random() * 1000) + 50,
        lastChecked: new Date()
      } : proxy
    ));
  };

  // DNS management
  const handleDNSAdd = (dns: Omit<DNSConfig, 'id'>) => {
    const newDNS: DNSConfig = {
      ...dns,
      id: Date.now().toString()
    };
    setDNSConfigs([...dnsConfigs, newDNS]);
  };

  const handleDNSDelete = (id: string) => {
    setDNSConfigs(dnsConfigs.filter(dns => dns.id !== id));
  };

  const handleDNSToggle = (id: string) => {
    setDNSConfigs(dnsConfigs.map(dns =>
      dns.id === id ? { ...dns, isActive: !dns.isActive } : dns
    ));
  };

  const handleDNSCheck = (id: string) => {
    setDNSConfigs(dnsConfigs.map(dns =>
      dns.id === id ? { 
        ...dns, 
        responseTime: Math.floor(Math.random() * 100) + 10,
        reliability: Math.floor(Math.random() * 20) + 80
      } : dns
    ));
  };

  // Site management
  const handleSiteAdd = (site: Omit<SiteConfig, 'id'>) => {
    const newSite: SiteConfig = {
      ...site,
      id: Date.now().toString()
    };
    setSites([...sites, newSite]);
  };

  const handleSiteDelete = (id: string) => {
    setSites(sites.filter(site => site.id !== id));
  };

  const handleSiteToggle = (id: string) => {
    setSites(sites.map(site =>
      site.id === id ? { ...site, isActive: !site.isActive } : site
    ));
  };

  const handleSiteUpdate = (id: string, updates: Partial<SiteConfig>) => {
    setSites(sites.map(site =>
      site.id === id ? { ...site, ...updates } : site
    ));
  };

  // AI Assistant management
  const handleAssistantAdd = (assistant: Omit<AIAssistant, 'id'>) => {
    const newAssistant: AIAssistant = {
      ...assistant,
      id: Date.now().toString()
    };
    setAssistants([...assistants, newAssistant]);
  };

  const handleAssistantUpdate = (id: string, updates: Partial<AIAssistant>) => {
    setAssistants(assistants.map(assistant =>
      assistant.id === id ? { ...assistant, ...updates } : assistant
    ));
  };

  const handleAssistantToggle = (id: string) => {
    setAssistants(assistants.map(assistant =>
      assistant.id === id ? { ...assistant, isActive: !assistant.isActive } : assistant
    ));
  };

  // Database management
  const handleDataDelete = (id: string) => {
    setParsedData(parsedData.filter(data => data.id !== id));
  };

  const handleDataExport = (format: 'json' | 'csv' | 'xml') => {
    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'json':
        content = JSON.stringify(parsedData, null, 2);
        filename = 'parsed_data.json';
        mimeType = 'application/json';
        break;
      case 'csv':
        const headers = ['id', 'url', 'timestamp', 'status', 'data'];
        const csvRows = [headers.join(',')];
        parsedData.forEach(item => {
          const row = [
            item.id,
            `"${item.url}"`,
            item.timestamp,
            item.status,
            `"${JSON.stringify(item.data).replace(/"/g, '""')}"`
          ];
          csvRows.push(row.join(','));
        });
        content = csvRows.join('\n');
        filename = 'parsed_data.csv';
        mimeType = 'text/csv';
        break;
      case 'xml':
        content = `<?xml version="1.0" encoding="UTF-8"?>
<parsedData>
${parsedData.map(item => `
  <record>
    <id>${item.id}</id>
    <url>${item.url}</url>
    <timestamp>${item.timestamp}</timestamp>
    <status>${item.status}</status>
    <data>${JSON.stringify(item.data)}</data>
  </record>`).join('')}
</parsedData>`;
        filename = 'parsed_data.xml';
        mimeType = 'application/xml';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Data type handlers
  const handleEmailDelete = (id: string) => {
    setEmails(emails.filter(email => email.id !== id));
  };

  const handleEmailExport = (format: 'json' | 'csv') => {
    const content = format === 'json' ? 
      JSON.stringify(emails, null, 2) :
      'email,domain,isValid,source,timestamp\n' + 
      emails.map(e => `${e.email},${e.domain},${e.isValid},${e.source},${e.timestamp}`).join('\n');
    
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emails.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCookieDelete = (id: string) => {
    setCookies(cookies.filter(cookie => cookie.id !== id));
  };

  const handleCookieExport = (format: 'json' | 'csv') => {
    const content = format === 'json' ? JSON.stringify(cookies, null, 2) : 'name,value,domain,source\n' + cookies.map(c => `${c.name},${c.value},${c.domain},${c.source}`).join('\n');
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cookies.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePhoneDelete = (id: string) => {
    setPhones(phones.filter(phone => phone.id !== id));
  };

  const handlePhoneExport = (format: 'json' | 'csv') => {
    const content = format === 'json' ? JSON.stringify(phones, null, 2) : 'phone,country,type,source\n' + phones.map(p => `${p.phone},${p.country},${p.type},${p.source}`).join('\n');
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phones.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAuthDelete = (id: string) => {
    setAuthData(authData.filter(auth => auth.id !== id));
  };

  const handleAuthExport = (format: 'json' | 'csv') => {
    const content = format === 'json' ? JSON.stringify(authData, null, 2) : 'type,username,domain,source\n' + authData.map(a => `${a.type},${a.username || ''},${a.domain},${a.source}`).join('\n');
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auth.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddressDelete = (id: string) => {
    setAddresses(addresses.filter(address => address.id !== id));
  };

  const handleAddressExport = (format: 'json' | 'csv') => {
    const content = format === 'json' ? JSON.stringify(addresses, null, 2) : 'fullAddress,city,country,source\n' + addresses.map(a => `"${a.fullAddress}",${a.city || ''},${a.country || ''},${a.source}`).join('\n');
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `addresses.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCardDelete = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const handleCardExport = (format: 'json' | 'csv') => {
    const content = format === 'json' ? JSON.stringify(cards, null, 2) : 'cardNumber,cardType,holderName,source\n' + cards.map(c => `${c.cardNumber},${c.cardType},${c.holderName || ''},${c.source}`).join('\n');
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cards.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLicenseDelete = (id: string) => {
    setLicenses(licenses.filter(license => license.id !== id));
  };

  const handleLicenseExport = (format: 'json' | 'csv') => {
    const content = format === 'json' ? JSON.stringify(licenses, null, 2) : 'licenseNumber,type,holderName,source\n' + licenses.map(l => `${l.licenseNumber},${l.type},${l.holderName || ''},${l.source}`).join('\n');
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `licenses.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleParsing = () => {
    setIsParsingActive(!isParsingActive);
    
    if (!isParsingActive) {
      const interval = setInterval(() => {
        const activeSites = sites.filter(site => site.isActive);
        if (activeSites.length > 0) {
          const randomSite = activeSites[Math.floor(Math.random() * activeSites.length)];
          const newData: ParsedData = {
            id: Date.now().toString(),
            siteId: randomSite.id,
            url: randomSite.url,
            timestamp: new Date(),
            data: {
              title: `Заголовок с ${randomSite.name}`,
              links: Math.floor(Math.random() * 50) + 1,
              images: Math.floor(Math.random() * 20) + 1,
              text: `Текстовые данные с сайта ${randomSite.name}`
            },
            status: Math.random() > 0.2 ? 'success' : 'failed',
            processingTime: Math.floor(Math.random() * 2000) + 500
          };
          setParsedData(prev => [newData, ...prev.slice(0, 99)]);
        }
      }, 5000);

      (window as any).parsingInterval = interval;
    } else {
      if ((window as any).parsingInterval) {
        clearInterval((window as any).parsingInterval);
      }
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-8">
                <h1 className="text-xl font-bold text-gray-800">AI Parser Pro</h1>
                <div className="flex gap-6">
                  <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Activity className="w-4 h-4" />
                    Дашборд
                  </Link>
                  <Link to="/sites" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Globe className="w-4 h-4" />
                    Сайты
                  </Link>
                  <Link to="/database" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Database className="w-4 h-4" />
                    База данных
                  </Link>
                  <Link to="/data-stats" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <BarChart3 className="w-4 h-4" />
                    Статистика
                  </Link>
                  <Link to="/emails" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Mail className="w-4 h-4" />
                    Email
                  </Link>
                  <Link to="/cookies" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Cookie className="w-4 h-4" />
                    Cookies
                  </Link>
                  <Link to="/phones" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Phone className="w-4 h-4" />
                    Телефоны
                  </Link>
                  <Link to="/auth" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Key className="w-4 h-4" />
                    Авторизация
                  </Link>
                  <Link to="/addresses" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <MapPin className="w-4 h-4" />
                    Адреса
                  </Link>
                  <Link to="/cards" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <CreditCard className="w-4 h-4" />
                    Карты
                  </Link>
                  <Link to="/licenses" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <FileText className="w-4 h-4" />
                    Лицензии
                  </Link>
                  <Link to="/ai" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Bot className="w-4 h-4" />
                    ИИ
                  </Link>
                  <Link to="/settings" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Settings className="w-4 h-4" />
                    Настройки
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleParsing}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isParsingActive 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isParsingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isParsingActive ? 'Остановить' : 'Запустить'}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{parsingStats.totalSites}</div>
                        <div className="text-sm text-gray-600">Всего сайтов</div>
                      </div>
                      <Globe className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-green-600">{parsingStats.activeSites}</div>
                        <div className="text-sm text-gray-600">Активных</div>
                      </div>
                      <Activity className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{parsingStats.successfulParsing}</div>
                        <div className="text-sm text-gray-600">Успешно</div>
                      </div>
                      <Shield className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-red-600">{parsingStats.failedParsing}</div>
                        <div className="text-sm text-gray-600">Ошибок</div>
                      </div>
                      <Database className="w-8 h-8 text-red-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">Последняя активность</h2>
                  <div className="space-y-3">
                    {parsedData.slice(0, 5).map((data) => (
                      <div key={data.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium">{data.url}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(data.timestamp).toLocaleString('ru-RU')}
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          data.status === 'success' ? 'bg-green-100 text-green-800' :
                          data.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {data.status === 'success' ? 'Успешно' :
                           data.status === 'partial' ? 'Частично' : 'Ошибка'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            } />
            
            <Route path="/sites" element={
              <SiteManager
                sites={sites}
                onSiteAdd={handleSiteAdd}
                onSiteDelete={handleSiteDelete}
                onSiteToggle={handleSiteToggle}
                onSiteUpdate={handleSiteUpdate}
              />
            } />
            
            <Route path="/database" element={
              <DatabaseViewer
                stats={databaseStats}
                data={parsedData}
                onDataDelete={handleDataDelete}
                onDataExport={handleDataExport}
              />
            } />

            <Route path="/data-stats" element={
              <DataDashboard stats={dataStats} />
            } />
            
            <Route path="/emails" element={
              <EmailManager
                emails={emails}
                onEmailDelete={handleEmailDelete}
                onEmailExport={handleEmailExport}
              />
            } />

            <Route path="/cookies" element={
              <CookieManager
                cookies={cookies}
                onCookieDelete={handleCookieDelete}
                onCookieExport={handleCookieExport}
              />
            } />

            <Route path="/phones" element={
              <PhoneManager
                phones={phones}
                onPhoneDelete={handlePhoneDelete}
                onPhoneExport={handlePhoneExport}
              />
            } />

            <Route path="/auth" element={
              <AuthManager
                authData={authData}
                onAuthDelete={handleAuthDelete}
                onAuthExport={handleAuthExport}
              />
            } />

            <Route path="/addresses" element={
              <AddressManager
                addresses={addresses}
                onAddressDelete={handleAddressDelete}
                onAddressExport={handleAddressExport}
              />
            } />

            <Route path="/cards" element={
              <CardManager
                cards={cards}
                onCardDelete={handleCardDelete}
                onCardExport={handleCardExport}
              />
            } />

            <Route path="/licenses" element={
              <LicenseManager
                licenses={licenses}
                onLicenseDelete={handleLicenseDelete}
                onLicenseExport={handleLicenseExport}
              />
            } />
            
            <Route path="/ai" element={
              <AIAssistantManager
                assistants={assistants}
                onAssistantAdd={handleAssistantAdd}
                onAssistantUpdate={handleAssistantUpdate}
                onAssistantToggle={handleAssistantToggle}
                voiceConfig={voiceConfig}
                onVoiceConfigUpdate={setVoiceConfig}
              />
            } />
            
            <Route path="/settings" element={
              <div className="space-y-6">
                <ProxyManager
                  proxies={proxies}
                  onProxyAdd={handleProxyAdd}
                  onProxyDelete={handleProxyDelete}
                  onProxyToggle={handleProxyToggle}
                  onProxyCheck={handleProxyCheck}
                />
                <DNSManager
                  dnsConfigs={dnsConfigs}
                  onDNSAdd={handleDNSAdd}
                  onDNSDelete={handleDNSDelete}
                  onDNSToggle={handleDNSToggle}
                  onDNSCheck={handleDNSCheck}
                />
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;