import { useState, useEffect, useRef } from 'react';
import { Bot, Send, RefreshCw, ChevronDown, ChevronUp, AlertTriangle, TrendingUp, Zap } from 'lucide-react';

const SYSTEM_PROMPT = `You are SwiftResponse AI, an emergency dispatch intelligence system for Delhi-NCR region.
Current status: 5 active incidents, 3 ambulances available (AMB-001, AMB-004, AMB-005), 2 deployed.
Active incidents: INC-001 Trauma/Critical at India Gate (14min pending), INC-002 Cardiac/Critical at Connaught Place (AMB-002 en route, ETA 3min), INC-003 Respiratory/High at Karol Bagh (AMB-003 on scene), INC-004 Accident/High at Sector 18 Noida (19min pending), INC-005 Medical/Medium at DLF Gurugram (29min pending).
WARNING: AMB-005 battery at 12% — critical. AMB-003 signal weak.
Average fleet response time today: 8.5 minutes. Target: 8 minutes.
Respond concisely in 2-4 sentences. Be tactical and data-driven. If asked for recommendations, give specific unit IDs and reasoning.`;

const QUICK_ACTIONS = [
  "Summarize active incidents",
  "Best unit for INC-004?",
  "Predict next 2hr demand",
  "Optimal hospital for INC-001",
  "AMB-005 risk assessment",
  "Dispatch priority order"
];

export default function AIInsights() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [recommendations, setRecommendations] = useState({ dispatch: null, risks: null, forecast: null });
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [activityLog, setActivityLog] = useState([]);
  const [logExpanded, setLogExpanded] = useState(true);
  const messagesEndRef = useRef(null);
  const streamTimeoutRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  useEffect(() => {
    fetchRecommendations();
    
    const welcomeMessage = {
      role: 'assistant',
      content: 'SwiftResponse AI online. I\'m monitoring 5 active incidents across Delhi-NCR. How can I assist with dispatch operations?'
    };
    setMessages([welcomeMessage]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addActivityLog = (action, confidence) => {
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 8);
    setActivityLog(prev => [{ time: timeStr, action, confidence }, ...prev].slice(0, 20));
  };

  const streamResponse = (text) => {
    setStreamingText('');
    let index = 0;
    
    const stream = () => {
      if (index < text.length) {
        setStreamingText(prev => prev + text[index]);
        index++;
        streamTimeoutRef.current = setTimeout(stream, 15);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: text }]);
        setStreamingText('');
      }
    };
    
    stream();
  };

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim() || isLoading) return;
    
    setIsLoading(true);
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || 'YOUR_API_KEY_HERE',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(msg => ({ role: msg.role, content: msg.content }))
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.content[0].text;
      
      streamResponse(aiResponse);
      addActivityLog('Chat response generated', 95);
    } catch (error) {
      console.error('API Error:', error);
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'Error connecting to AI system. Please check API key configuration.' 
      }]);
      addActivityLog('Chat error occurred', 0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    sendMessage(input);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (action) => {
    sendMessage(action);
  };

  const fetchRecommendations = async () => {
    setLoadingRecs(true);
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || 'YOUR_API_KEY_HERE';
    
    const callAPI = async (prompt, type) => {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4',
            max_tokens: 1500,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: prompt }]
          })
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        
        const data = await response.json();
        const text = data.content[0].text;
        
        const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        return null;
      } catch (error) {
        console.error(`${type} API Error:`, error);
        return null;
      }
    };

    const [dispatch, risks, forecast] = await Promise.all([
      callAPI(
        'Given current incidents and units, return JSON array of objects with: incidentId, recommendedUnit, confidence (0-100), reasoning. Include INC-001, INC-004, INC-005. Format: [{"incidentId":"INC-001","recommendedUnit":"AMB-004","confidence":92,"reasoning":"Closest available unit"}]',
        'Dispatch'
      ),
      callAPI(
        'Return JSON array of risk alerts with: severity ("critical"|"warning"|"info"), unitOrZone, alert, action. Include AMB-005 battery, AMB-003 signal, INC-001 wait time. Format: [{"severity":"critical","unitOrZone":"AMB-005","alert":"Battery at 12%","action":"Return to base immediately"}]',
        'Risk'
      ),
      callAPI(
        'Return JSON with demand forecast: {nextHour: number, next2Hours: number, hotZones: [string], peakTime: string}. Format: {"nextHour":7,"next2Hours":12,"hotZones":["Central Delhi","Noida Sector 18"],"peakTime":"18:30"}',
        'Forecast'
      )
    ]);

    setRecommendations({ dispatch, risks, forecast });
    setLoadingRecs(false);
    
    if (dispatch) addActivityLog('Dispatch recommendations updated', 89);
    if (risks) addActivityLog('Risk analysis completed', 94);
    if (forecast) addActivityLog('Demand forecast generated', 87);
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'border-l-red-500 bg-red-500/5';
      case 'warning': return 'border-l-amber-500 bg-amber-500/5';
      default: return 'border-l-blue-500 bg-blue-500/5';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'bg-green-500';
    if (confidence >= 70) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getLogConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 70) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f] text-white overflow-hidden">
      {/* Main Content: 60/40 Split */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        
        {/* LEFT PANEL - AI Chat (60%) */}
        <div className="w-[60%] flex flex-col bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          {/* Chat Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <Bot className="w-6 h-6 text-cyan-400" />
            <div className="flex-1">
              <h2 className="font-semibold text-lg">SwiftResponse AI</h2>
              <div className="flex items-center gap-2 text-xs text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Intelligence Active
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-white/6 rounded-tr-sm' 
                    : 'bg-cyan-500/6 border-l-4 border-cyan-400 font-mono text-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {/* Streaming Message */}
            {streamingText && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-cyan-500/6 border-l-4 border-cyan-400 font-mono text-sm">
                  {streamingText}
                  <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse"></span>
                </div>
              </div>
            )}
            
            {/* Typing Indicator */}
            {isLoading && !streamingText && (
              <div className="flex justify-start">
                <div className="bg-cyan-500/6 border-l-4 border-cyan-400 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 pb-3">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20">
              {QUICK_ACTIONS.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action)}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/20 rounded-full whitespace-nowrap transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                placeholder="Ask SwiftResponse AI..."
                className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-cyan-400 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Recommendations (40%) */}
        <div className="w-[40%] flex flex-col gap-4 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4">
            <h2 className="font-semibold text-lg">AI Recommendations</h2>
            <button
              onClick={fetchRecommendations}
              disabled={loadingRecs}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loadingRecs ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Dispatch Recommendations */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-cyan-400" />
              <h3 className="font-semibold">Dispatch Recommendations</h3>
            </div>
            
            {loadingRecs ? (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="h-24 bg-white/5 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : recommendations.dispatch ? (
              <div className="space-y-3">
                {recommendations.dispatch.map((rec, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded">{rec.incidentId}</span>
                      <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded font-mono">{rec.recommendedUnit}</span>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-white/60">Confidence</span>
                        <span className="text-white/80">{rec.confidence}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getConfidenceColor(rec.confidence)} transition-all`}
                          style={{ width: `${rec.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-xs text-white/70">{rec.reasoning}</p>
                  </div>
                ))}
              </div>
            ) : (
              <button
                onClick={fetchRecommendations}
                className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-sm transition-colors"
              >
                Retry Loading
              </button>
            )}
          </div>

          {/* Risk Alerts */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="font-semibold">Risk Alerts</h3>
            </div>
            
            {loadingRecs ? (
              <div className="space-y-3">
                {[1,2].map(i => (
                  <div key={i} className="h-20 bg-white/5 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : recommendations.risks ? (
              <div className="space-y-3">
                {recommendations.risks.map((risk, idx) => (
                  <div key={idx} className={`border-l-4 rounded-lg p-3 ${getSeverityColor(risk.severity)}`}>
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-mono text-sm text-white/90">{risk.unitOrZone}</span>
                      <span className={`text-xs px-2 py-0.5 rounded uppercase ${
                        risk.severity === 'critical' ? 'bg-red-500/20 text-red-300' :
                        risk.severity === 'warning' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {risk.severity}
                      </span>
                    </div>
                    <p className="text-sm mb-2 text-white/80">{risk.alert}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-white/60">{risk.action}</p>
                      <button className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors">
                        Acknowledge
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <button
                onClick={fetchRecommendations}
                className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-sm transition-colors"
              >
                Retry Loading
              </button>
            )}
          </div>

          {/* Demand Forecast */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h3 className="font-semibold">Demand Forecast</h3>
            </div>
            
            {loadingRecs ? (
              <div className="h-32 bg-white/5 rounded-lg animate-pulse"></div>
            ) : recommendations.forecast ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-2xl font-bold text-cyan-400">{recommendations.forecast.nextHour}</div>
                    <div className="text-xs text-white/60">Next Hour</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-2xl font-bold text-amber-400">{recommendations.forecast.next2Hours}</div>
                    <div className="text-xs text-white/60">Next 2 Hours</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-white/60 mb-2">Hot Zones</div>
                  <div className="flex flex-wrap gap-2">
                    {recommendations.forecast.hotZones?.map((zone, idx) => (
                      <span key={idx} className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded">
                        {zone}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Peak Time</span>
                  <span className="text-white/90 font-mono">{recommendations.forecast.peakTime}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={fetchRecommendations}
                className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-sm transition-colors"
              >
                Retry Loading
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AI Activity Log (Bottom, Collapsible) */}
      <div className={`border-t border-white/10 bg-white/5 backdrop-blur-sm transition-all ${logExpanded ? 'h-48' : 'h-12'}`}>
        <button
          onClick={() => setLogExpanded(!logExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">AI Decision Log</h3>
            <span className="text-xs text-white/50">({activityLog.length} entries)</span>
          </div>
          {logExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>
        
        {logExpanded && (
          <div className="px-4 pb-4 h-[calc(100%-48px)] overflow-y-auto">
            <div className="space-y-1 font-mono text-xs">
              {activityLog.map((log, idx) => (
                <div key={idx} className="flex items-center gap-3 text-white/70 py-1">
                  <span className="text-white/50">[{log.time}]</span>
                  <span className="flex-1">{log.action}</span>
                  <span className={getLogConfidenceColor(log.confidence)}>
                    {log.confidence > 0 ? `${log.confidence}%` : 'FAIL'}
                  </span>
                </div>
              ))}
              
              {activityLog.length === 0 && (
                <div className="text-white/40 text-center py-8">No activity yet</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
