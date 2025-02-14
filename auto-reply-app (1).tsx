import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { 
  MessageSquare, 
  Send, 
  Settings, 
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  Clock,
  LogIn,
  LogOut,
  BarChart,
  Filter,
  User,
  PieChart
} from 'lucide-react';

// Simulated AI API client
const aiClient = {
  generateResponse: async (message, context) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `AI-generated response based on: ${message} (Using ${context.model})`;
  }
};

// Login Form Component
const LoginForm = ({ loginForm, setLoginForm, error, handleLogin }) => (
  <Card className="max-w-md mx-auto mt-20">
    <CardHeader>
      <CardTitle>Login to Auto-Reply Dashboard</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            value={loginForm.email}
            onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <Input
            type="password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
          />
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button className="w-full" onClick={handleLogin}>
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Filter Panel Component
const FilterPanel = ({ filters, setFilters, categories }) => (
  <div className="flex space-x-4 mb-4">
    <Select
      value={filters.status}
      onValueChange={(value) => setFilters({...filters, status: value})}
    >
      <SelectTrigger>
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="answered">Answered</SelectItem>
      </SelectContent>
    </Select>

    <Select
      value={filters.category}
      onValueChange={(value) => setFilters({...filters, category: value})}
    >
      <SelectTrigger>
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories.map(category => (
          <SelectItem key={category} value={category}>{category}</SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Select
      value={filters.dateRange}
      onValueChange={(value) => setFilters({...filters, dateRange: value})}
    >
      <SelectTrigger>
        <SelectValue placeholder="Date Range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Time</SelectItem>
        <SelectItem value="today">Today</SelectItem>
        <SelectItem value="week">This Week</SelectItem>
        <SelectItem value="month">This Month</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

// Analytics Dashboard Component
const AnalyticsDashboard = ({ analytics }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Response Time Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <LineChart data={analytics.responseTime} width={600} height={200}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="time" stroke="#8884d8" />
          </LineChart>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Main App Component
const App = () => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    loading: false
  });

  const [businessInfo, setBusinessInfo] = useState({
    name: "Sample Business",
    hours: "9:00 AM - 5:00 PM",
    aiSettings: {
      model: "gpt-4",
      temperature: 0.7,
      maxTokens: 150
    },
    commonResponses: [
      {
        id: 1,
        trigger: "pricing",
        response: "Our pricing starts at $99/month. Would you like to see our detailed pricing guide?"
      },
      {
        id: 2,
        trigger: "hours",
        response: "We're open Monday-Friday, 9:00 AM - 5:00 PM. How can we help you today?"
      }
    ],
    categories: ["General", "Sales", "Support", "Technical", "Billing"]
  });

  const [messages, setMessages] = useState([
    {
      id: 1,
      customer: "john@example.com",
      message: "What are your business hours?",
      status: "answered",
      category: "General",
      timestamp: "2024-02-14T10:00:00",
      response: "We're open Monday-Friday, 9:00 AM - 5:00 PM. How can we help you today?",
      sentiment: "neutral"
    },
    {
      id: 2,
      customer: "sarah@example.com",
      message: "Can you tell me about your pricing?",
      status: "pending",
      category: "Sales",
      timestamp: "2024-02-14T11:30:00",
      sentiment: "positive"
    }
  ]);

  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    dateRange: 'all'
  });

  const [analytics, setAnalytics] = useState({
    responseTime: [],
    categoryDistribution: {},
    sentimentAnalysis: {},
    dailyMessages: []
  });

  const [activeTab, setActiveTab] = useState('messages');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAuth({
        isAuthenticated: true,
        user: { email: loginForm.email, role: 'admin' },
        loading: false
      });
      setError(null);
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    setAuth({
      isAuthenticated: false,
      user: null,
      loading: false
    });
  };

  const handleAutoReply = async (messageId) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    const aiResponse = await aiClient.generateResponse(message.message, {
      model: businessInfo.aiSettings.model,
      category: message.category
    });
    
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          status: "answered",
          response: aiResponse,
          responseTime: new Date().toISOString()
        };
      }
      return msg;
    }));
  };

  if (!auth.isAuthenticated) {
    return (
      <LoginForm 
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        error={error}
        handleLogin={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>AI Auto-Reply Dashboard</span>
              <div className="space-x-2">
                <Button 
                  variant={activeTab === 'messages' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('messages')}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
                </Button>
                <Button 
                  variant={activeTab === 'analytics' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('analytics')}
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
                <Button 
                  variant={activeTab === 'settings' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {activeTab === 'messages' && (
          <>
            <FilterPanel 
              filters={filters}
              setFilters={setFilters}
              categories={businessInfo.categories}
            />
            <div className="space-y-4">
              {messages.map(message => (
                <Card key={message.id} className="w-full">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium">{message.customer}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(message.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge 
                        variant={message.status === 'answered' ? 'default' : 'secondary'}
                      >
                        {message.status === 'answered' ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <Clock className="mr-1 h-3 w-3" />
                        )}
                        {message.status}
                      </Badge>
                    </div>

                    <p className="mb-4">{message.message}</p>

                    {message.status === 'answered' ? (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">{message.response}</p>
                      </div>
                    ) : (
                      <Button onClick={() => handleAutoReply(message.id)}>
                        <Send className="mr-2 h-4 w-4" />
                        Send Auto-Reply
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard analytics={analytics} />
        )}
      </div>
    </div>
  );
};

export default App;
