import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API route for ETSISI AI Tutor proxy
app.post('/api/ai-tutor', async (req, res) => {
  try {
    const {
      question,
      topicTitle,
      subtopicTitle,
      subtopicSummary,
      subtopicExplanation,
      keyFormulas,
      documentContext,
      exerciseContext,
      history
    } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const fallback = `En el marco oficial del Grado en Ingeniería de Computadores (ETSISI - UPM):\n\n` +
        `Para el concepto "${subtopicTitle || topicTitle || 'General'}": ` +
        `Revisamos los teoremas y diapositivas de la asignatura. El procedimiento estándar exige verificar las condiciones de contorno, plantear la ecuación o tabla de verdad correspondiente, y aplicar la simplificación canónica.`;
      return res.json({ answer: fallback });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `Eres el Catedrático y Tutor Experto de Inteligencia Artificial para el Grado en Ingeniería de Computadores de la ETSISI - Universidad Politécnica de Madrid (UPM).
Estás guiando a un estudiante del Plan 61CI (Análisis Matemático, Fundamentos de Computadores, Lógica y Matemática Discreta, Fundamentos de Programación en C, Taller de Sistemas Operativos, Álgebra, Estructura de Computadores, etc.).
Contexto del estudio:
- Asignatura / Tema: ${topicTitle || 'General'}
- Punto específico: ${subtopicTitle || 'General'}
- Resumen oficial de cátedra: ${subtopicSummary || 'N/A'}
- Fórmulas de examen: ${(keyFormulas || []).join('; ')}
${exerciseContext ? `- Contexto del ejercicio que está resolviendo el alumno:\n${exerciseContext}\n` : ''}
${documentContext ? `- Documento / Apuntes que el alumno está consultando en pantalla dividida:\n${documentContext}\n` : ''}

Directrices pedagógicas de la ETSISI:
1. Explica de forma didáctica, clara, elegante y rigurosa como un verdadero catedrático universitario.
2. Si el alumno pide ejemplos o explicaciones paso a paso, desgrana cada paso numerado (Paso 1, Paso 2, etc.).
3. Si el alumno pide tablas comparativas, crea tablas Markdown completas y bien alineadas (| Encabezado 1 | Encabezado 2 |).
4. NOTACIÓN MATEMÁTICA LIMPIA: Cuando escribas fórmulas, hazlo de modo que se entiendan perfectamente. Evita escribir '\\text{Palabra}' suelto en el texto normal. Si usas LaTeX en bloque usa '$$ ... $$' o en línea '$ ... $'.
5. Si el estudiante está en pantalla dividida viendo un documento o ejercicio, responde directamente a sus dudas sobre dicho material, explicando dónde se aplican las fórmulas.
6. Da consejos específicos de examen (trampas típicas donde suelen restar puntos en las correcciones de la ETSISI).`;

    let contents: any[] = [];

    if (Array.isArray(history) && history.length > 0) {
      contents = history.map((h: { role: string; text: string }) => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.text }]
      }));
      contents.push({
        role: 'user',
        parts: [{ text: question }]
      });
    } else {
      contents = [
        {
          role: 'user',
          parts: [{ text: question }]
        }
      ];
    }

    const candidateModels = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let reply = '';
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            temperature: 0.3
          }
        });
        if (response.text) {
          reply = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} failed, trying next candidate:`, err.message);
      }
    }

    if (reply) {
      return res.json({ answer: reply });
    }

    throw lastError || new Error('No se pudo generar respuesta');
  } catch (error: any) {
    console.error('AI Tutor API error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// API route to parse exams from PDF or syllabus text
app.post('/api/parse-exams', async (req, res) => {
  try {
    const { fileData, mimeType, rawText } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY no está configurada en el servidor' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const promptText = `Eres un asistente universitario especializado en procesar calendarios de exámenes oficiales y guías docentes de la ETSISI - Universidad Politécnica de Madrid (UPM).
Analiza el archivo o texto proporcionado y extrae TODOS los exámenes, parciales, pruebas de evaluación continua o convocatorias oficiales que se mencionen.

Debes responder ÚNICAMENTE con un array JSON válido sin texto adicional antes ni después, con la siguiente estructura de objetos exacta:
[
  {
    "title": "Nombre del examen (ej. Parcial 1: Lógica Binaria o Examen Final Ordinario)",
    "subjectName": "Nombre de la asignatura (ej. Fundamentos de Computadores, Álgebra, Análisis Matemático)",
    "courseId": "1" | "2" | "3" | "4",
    "semesterId": "1" | "2",
    "date": "YYYY-MM-DD" (si solo aparece mes y día como 15 de enero, asume el curso académico actual: 2026 para semestre 1 o 2027 para semestre 2),
    "time": "HH:mm" (ej. 09:00, 15:30; si no se indica, pon "10:00"),
    "buildingBlock": "Bloque o Aulario (ej. Bloque 4 (Aulario) o Bloque 1)",
    "classroom": "Aula o laboratorio (ej. Aula 1002 o Lab 2.1)",
    "topicsCovered": ["Tema 1...", "Tema 2..."],
    "weightPercentage": 30
  }
]
Asegúrate de que el JSON sea completamente válido y parseable directamente con JSON.parse.`;

    const parts: any[] = [];

    if (fileData) {
      const cleanBase64 = fileData.includes(',') ? fileData.split(',')[1] : fileData;
      parts.push({
        inlineData: {
          mimeType: mimeType || 'application/pdf',
          data: cleanBase64
        }
      });
    }

    if (rawText) {
      parts.push({
        text: `Texto del calendario / guía de exámenes:\n\n${rawText}`
      });
    }

    parts.push({
      text: promptText
    });

    const candidateModels = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let rawResponse = '';
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts }],
          config: {
            temperature: 0.1
          }
        });
        if (response.text) {
          rawResponse = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} failed in parse-exams, trying next:`, err.message);
      }
    }

    if (!rawResponse) {
      throw lastError || new Error('No se pudo extraer exámenes del documento');
    }

    // Clean JSON markdown code blocks
    let cleanedJson = rawResponse.trim();
    if (cleanedJson.startsWith('```json')) {
      cleanedJson = cleanedJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedJson.startsWith('```')) {
      cleanedJson = cleanedJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsedExams = JSON.parse(cleanedJson);
    if (!Array.isArray(parsedExams)) {
      throw new Error('El modelo no devolvió una lista de exámenes');
    }

    // Assign IDs to each exam
    const formattedExams = parsedExams.map((ex: any, idx: number) => ({
      id: `exam-parsed-${Date.now()}-${idx}`,
      title: ex.title || `Examen ${idx + 1}`,
      subjectId: (ex.subjectName || 'custom').toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 10),
      subjectName: ex.subjectName || 'Asignatura ETSISI',
      courseId: ex.courseId || '1',
      semesterId: ex.semesterId || '1',
      date: ex.date || new Date().toISOString().split('T')[0],
      time: ex.time || '10:00',
      buildingBlock: ex.buildingBlock || 'Bloque 4 (Aulario)',
      classroom: ex.classroom || 'Aula 1002',
      topicsCovered: Array.isArray(ex.topicsCovered) ? ex.topicsCovered : [],
      weightPercentage: typeof ex.weightPercentage === 'number' ? ex.weightPercentage : 30,
      completed: false
    }));

    return res.json({ exams: formattedExams });
  } catch (error: any) {
    console.error('Parse exams API error:', error);
    res.status(500).json({ error: error.message || 'Error al procesar el calendario de exámenes' });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
