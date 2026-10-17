import React, { useState, useRef, useEffect } from 'react';
import { Subject, Topic } from '../types';
import { GoogleGenAI } from '@google/genai';
import { MathView } from './MathView';
import { FormattedMarkdownText } from './FormattedMarkdownText';
import {
  Bot,
  Send,
  Sparkles,
  Layers,
  Table,
  BookOpen,
  ArrowLeft,
  HelpCircle,
  Loader2,
  Cpu,
  Code2
} from 'lucide-react';

interface AITutorDedicatedViewProps {
  subjects: Subject[];
  initialSubject?: Subject | null;
  initialTopic?: Topic | null;
  onBack: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  hasTable?: boolean;
  tableData?: string[][];
  timestamp: string;
}

export const AITutorDedicatedView: React.FC<AITutorDedicatedViewProps> = ({
  subjects,
  initialSubject,
  initialTopic,
  onBack
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    initialSubject?.id || subjects[0]?.id || ''
  );

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    initialTopic?.id || currentSubject?.topics[0]?.id || ''
  );

  const currentTopic = currentSubject?.topics.find((t) => t.id === selectedTopicId) || currentSubject?.topics[0] || null;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'model',
      text: `¡Bienvenido al Aula Virtual del Tutor IA de la ETSISI (UPM)!
Estoy especializado en el Plan de Estudios 61CI de Ingeniería de Computadores.
Puedo darte explicaciones rigurosas y claras, resolver ejercicios paso a paso, redactar tablas comparativas de propiedades y representar diagramas o fórmulas matemáticas con KaTeX.

¿Qué concepto o problema deseas estudiar hoy?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      // 1. Try server-side AI Tutor proxy
      const apiRes = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          topicTitle: currentTopic?.title || 'General',
          subtopicTitle: currentSubject?.name || 'Ingeniería de Computadores',
          history: messages.filter((m) => m.id !== 'init-1').map((m) => ({
            role: m.role,
            text: m.text
          }))
        })
      });

      if (apiRes.ok) {
        const data = await apiRes.json();
        if (data.answer) {
          setMessages((prev) => [
            ...prev,
            {
              id: `m-${Date.now()}`,
              role: 'model',
              text: data.answer,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // continue to client fallback
    }

    try {
      const apiKey =
        import.meta.env.VITE_GEMINI_API_KEY ||
        (window as unknown as { GEMINI_API_KEY?: string }).GEMINI_API_KEY ||
        '';

      const systemInstruction = `Eres el Catedrático y Tutor de Inteligencia Artificial para el Grado en Ingeniería de Computadores de la ETSISI - Universidad Politécnica de Madrid (UPM).
Estás guiando a un estudiante universitario.
Asignatura actual seleccionada: ${currentSubject?.name || 'General'}, Tema: ${currentTopic?.title || 'General'}.
Instrucciones estrictas:
1. Explica de manera magistral, extremadamente clara, fundamentada y pedagógica.
2. Basa tus explicaciones única y exclusivamente en los conceptos y metodología de la ETSISI-UPM (Análisis Matemático, Fundamentos de Computadores, Lógica y Matemática Discreta, Fundamentos de Programación en C, Taller de Sistemas Operativos).
3. Si el usuario pide tablas, genera tablas comparativas en formato Markdown nítidas y detalladas.
4. Si el usuario pide fórmulas matemáticas o lógica, escribe fórmulas matemáticas estándar (e.g. KaTeX o notaciones claras) y desglosa los pasos.
5. Si el usuario pide código, proporciona código en C o scripts de shell de alta calidad comentados línea a línea.
6. Si pide aclaración visual, describe diagramas, tablas de verdad, mapas de Karnaugh en 2D o esquemas de circuitos integrados serie 74.`;

      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const contents = messages
          .concat(userMessage)
          .filter((m) => m.id !== 'init-1')
          .map((m) => ({
            role: m.role,
            parts: [{ text: m.text }]
          }));

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction
          }
        });

        const reply = response.text || 'Sin respuesta del modelo.';

        setMessages((prev) => [
          ...prev,
          {
            id: `m-${Date.now()}`,
            role: 'model',
            text: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsLoading(false);
        return;
      }
        // High quality offline tutoring response
        setTimeout(() => {
          let offlineReply = '';
          const q = textToSend.toLowerCase();

          if (q.includes('tabla') && (q.includes('bcd') || q.includes('código'))) {
            offlineReply = `### Tabla Comparativa Oficial de Códigos BCD (ETSISI - UPM)

| Dígito | BCD Natural (8 4 2 1) | BCD Aiken (2 4 2 1) | BCD Exceso 3 (d + 3) | BCD 5 4 2 1 |
|:---:|:---:|:---:|:---:|:---:|
| **0** | 0000 | 0000 | 0011 | 0000 |
| **1** | 0001 | 0001 | 0100 | 0001 |
| **2** | 0010 | 0010 | 0101 | 0010 |
| **3** | 0011 | 0011 | 0110 | 0011 |
| **4** | 0100 | 0100 | 0111 | 0100 |
| **5** | 0101 | 1011 | 1000 | 1000 |
| **6** | 0110 | 1100 | 1001 | 1001 |
| **7** | 0111 | 1101 | 1010 | 1010 |
| **8** | 1000 | 1110 | 1011 | 1011 |
| **9** | 1001 | 1111 | 1100 | 1100 |

**Propiedades fundamentales:**
- **Autocomplementarios:** BCD Aiken y BCD Exceso 3 son autocomplementarios respecto a 9: la combinación de $(9 - d)$ es exactamente la de $d$ invirtiendo todos los bits (muy útil para restar por complemento a 9).
- **Ponderación:** BCD Natural, Aiken y 5421 son códigos ponderados. BCD Exceso 3 **NO es ponderado** (el sistema de ecuaciones conduce a la contradicción $0 = 3$).`;
          } else if (q.includes('tfc') || q.includes('riemann') || q.includes('integral')) {
            offlineReply = `### Teorema Fundamental del Cálculo (TFC) y Regla de Barrow

**1. Definición de la Función Integral:**
Dada una función $f$ integrable en $[a, b]$, definimos:
$$F(x) = \\int_a^x f(t)\\,dt$$

**2. Enunciado del TFC:**
Si $f$ es continua en un punto $c \\in (a, b)$, entonces la función integral $F(x)$ es derivable en $c$ y su derivada coincide exactamente con el valor del integrando:
$$F'(c) = f(c)$$

**3. Demostración analítica:**
Aplicando la definición de derivada:
$$\\lim_{h \\to 0} \\frac{F(c+h) - F(c)}{h} = \\lim_{h \\to 0} \\frac{1}{h} \\int_c^{c+h} f(t)\\,dt$$
Por ser $f$ continua en $c$, para todo $\\varepsilon > 0$, existe $\\delta > 0$ tal que $|t - c| < \\delta \\implies |f(t) - f(c)| < \\varepsilon$.
$$\\left| \\frac{1}{h} \\int_c^{c+h} (f(t) - f(c))\\,dt \\right| \\le \\frac{1}{h} \\cdot h \\cdot \\varepsilon = \\varepsilon$$
Tomando $h \\to 0$, se obtiene $F'(c) = f(c)$.

**4. Regla de Barrow:**
Si $G(x)$ es una primitiva cualquiera de $f(x)$ ($G' = f$), entonces:
$$\\int_a^b f(x)\\,dx = G(b) - G(a)$$`;
          } else if (q.includes('rsa') || q.includes('euler')) {
            offlineReply = `### Fundamento y Algoritmo del Criptosistema RSA

**Paso 1: Generación de Claves**
1. Se eligen dos números primos distintos $p$ y $q$.
2. Se calcula el módulo $n = p \\cdot q$.
3. Se calcula el indicador de Euler: $\\varphi(n) = (p - 1)(q - 1)$.
4. Se elige un exponente público $e$ tal que $\\text{mcd}(e, \\varphi(n)) = 1$.
5. Se calcula la clave privada $d$ como el inverso modular de $e$ en $\\mathbb{Z}_{\\varphi(n)}$ mediante el Algoritmo Extendido de Euclides (AEE):
$$e \\cdot d \\equiv 1 \\pmod{\\varphi(n)}$$

**Paso 2: Cifrado y Descifrado**
- **Cifrado (Emisor):** $C \\equiv M^e \\pmod n$
- **Descifrado (Receptor):** $M \\equiv C^d \\pmod n$

**Justificación:**
Como $e \\cdot d = 1 + k \\cdot \\varphi(n)$, por el Teorema de Euler ($M^{\\varphi(n)} \\equiv 1 \\pmod n$):
$$C^d = (M^e)^d = M^{1 + k\\varphi(n)} = M \\cdot (M^{\\varphi(n)})^k \\equiv M \\cdot 1^k \\equiv M \\pmod n$$`;
          } else {
            offlineReply = `### Explicación detallada de ${currentSubject?.name || 'la materia'}:

Para analizar **"${textToSend}"**, debemos apoyarnos en los fundamentos de la ETSISI:
1. **Definición precisa:** Identifica las hipótesis y el dominio de aplicación del concepto.
2. **Procedimiento formal:** Aplica las reglas algebraicas paso a paso sin omitir acarreos ni signos.
3. **Comprobación:** Realiza siempre la comprobación por el camino contrario (en binario mediante el TFN, en EDO sustituyendo en la ecuación, y en Karnaugh verificando las filas de la tabla de verdad).

¿Deseas que formulemos un ejemplo numérico o desarrollemos una tabla comparativa sobre este punto?`;
          }

          setMessages((prev) => [
            ...prev,
            {
              id: `m-${Date.now()}`,
              role: 'model',
              text: offlineReply,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }, 500);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `m-err-${Date.now()}`,
          role: 'model',
          text: 'Ocurrió un error al procesar tu consulta con el Tutor IA.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div>
          <button
            onClick={onBack}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-1 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a asignaturas</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Tutor Virtual IA · ETSISI
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Modo Sala de Estudio
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explicaciones completas a pantalla completa con tablas, fórmulas KaTeX y resolución razonada de dudas.
          </p>
        </div>

        {/* Context Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.shortName} - {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => handleSend('Genera una tabla comparativa de todos los códigos BCD vistos en clase (pesos, autocomplementarios, uso)')}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs"
        >
          <Table className="w-3.5 h-3.5 text-emerald-500" />
          <span>Tabla BCD comparativa</span>
        </button>

        <button
          onClick={() => handleSend('Explícame el Teorema Fundamental del Cálculo y la Regla de Barrow con demostración')}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-500" />
          <span>TFC y Regla de Barrow</span>
        </button>

        <button
          onClick={() => handleSend('Cómo funciona el cifrado y descifrado RSA con el Teorema de Euler y el AEE')}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Criptosistema RSA</span>
        </button>

        <button
          onClick={() => handleSend('Explícame las reglas de agrupación de 4 y 8 en Mapas de Karnaugh de 4 variables')}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs"
        >
          <Layers className="w-3.5 h-3.5 text-amber-500" />
          <span>Mapas de Karnaugh (4 variables)</span>
        </button>
      </div>

      {/* Main Chat Thread */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col h-[650px] overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div
                className={`p-5 rounded-2xl max-w-[85%] text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white font-medium rounded-br-xs shadow-md'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-xs'
                }`}
              >
                {msg.role === 'model' ? (
                  <FormattedMarkdownText content={msg.text} />
                ) : (
                  <div className="whitespace-pre-line">{msg.text}</div>
                )}
                <span
                  className={`block text-[10px] mt-2 text-right ${
                    msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 text-xs text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>El profesor tutor está redactando una explicación estructurada...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta cualquier concepto, pide una tabla comparativa o un desarrollo matemático..."
            className="flex-1 text-xs sm:text-sm p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-40 shrink-0"
          >
            <span>Preguntar</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
