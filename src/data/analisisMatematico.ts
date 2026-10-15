import { Subject } from '../types';

export const analisisMatematicoSubject: Subject = {
  id: 'am',
  name: 'Análisis Matemático',
  shortName: 'AM',
  code: '595000001',
  ects: 6,
  color: 'indigo',
  description: 'Cálculo diferencial e integral de una y varias variables, optimización y ecuaciones diferenciales ordinarias.',
  topics: [
    {
      id: 'am-tema-1',
      number: 1,
      title: 'Tema 1: Cálculo diferencial de funciones de una y varias variables',
      subtitle: 'Límites, continuidad, derivabilidad, cálculo multivariable, gradiente, Hessiano y optimización',
      description: 'Estudio exhaustivo del cálculo diferencial desde funciones reales de variable real hasta funciones de dos o más variables, extremos relativos y optimización con restricciones.',
      subtopics: [
        {
          id: 'am-t1-sub1',
          title: '1. Conceptos Generales de Funciones, Dominio e Imagen',
          summary: 'Una función real f es una aplicación f: D ⊆ R → R donde a cada x ∈ D le corresponde un único f(x) ∈ R. Dom(f) es el conjunto de valores donde f(x) tiene sentido real. Im(f) es el conjunto de valores y ∈ R para los que existe x con y = f(x).',
          explanation: 'Para calcular el dominio, debemos estudiar las restricciones algebraicas:\n- Denominadores no nulos: en f(x) = 1/x, el denominador x ≠ 0, por lo que Dom(f) = R - {0}.\n- Radicales de índice par: radicando mayor o igual a cero: en f(x) = √x, Dom(f) = [0, +∞), Im(f) = [0, +∞).\n- Logaritmos: argumento estrictamente positivo: en f(x) = ln(x), Dom(f) = (0, +∞), Im(f) = R.\nUna gráfica representa una función de una variable si y solo si cualquier recta vertical corta a la gráfica en a lo sumo un punto (la elipse x²/a² + y²/b² = 1 NO representa una función de una variable).',
          keyFormulas: [
            'Dom(f) = {x ∈ ℝ : ∃ y ∈ ℝ, y = f(x)}',
            'Im(f) = {y ∈ ℝ : ∃ x ∈ Dom(f), f(x) = y}',
            'f(x) = 1/x ⟹ Dom(f) = ℝ - {0}, Im(f) = ℝ - {0}',
            'f(x) = √x ⟹ Dom(f) = [0, +∞), Im(f) = [0, +∞)',
            'f(x) = ln(x) ⟹ Dom(f) = (0, +∞), Im(f) = ℝ'
          ],
          examTips: [
            'Ojo con los logaritmos de expresiones cuadráticas como ln(x² - 4): requiere x² - 4 > 0, es decir |x| > 2 (x ∈ (-∞, -2) ∪ (2, +∞)), sin incluir los extremos.',
            'En cocientes con logaritmos en el numerador y polinomios en el denominador, el dominio es la intersección de ambas condiciones excluyendo los ceros del denominador.'
          ]
        },
        {
          id: 'am-t1-sub2',
          title: '2. Límites y Límites Laterales',
          summary: 'El límite lim_{x→a} f(x) = L existe si y solo si existen los límites laterales por la izquierda y por la derecha y coinciden: lim_{x→a⁻} f(x) = lim_{x→a⁺} f(x) = L. Si existe, el límite es único.',
          explanation: 'Definición formal (ε - δ): lim_{x→a} f(x) = L si para todo ε > 0 existe δ > 0 tal que si 0 < |x - a| < δ entonces |f(x) - L| < ε.\nLímites laterales:\n- Límite por la derecha f(a⁺) = lim_{x→a⁺} f(x): x se aproxima con valores x > a.\n- Límite por la izquierda f(a⁻) = lim_{x→a⁻} f(x): x se aproxima con valores x < a.\nSi los límites laterales son distintos o alguno no existe, NO existe el límite en el punto.',
          keyFormulas: [
            'lim_{x→a⁻} f(x) = lim_{x→a⁺} f(x) = L ⟺ lim_{x→a} f(x) = L',
            'lim_{x→a⁻} f(x) ≠ lim_{x→a⁺} f(x) ⟹ ∄ lim_{x→a} f(x)'
          ]
        },
        {
          id: 'am-t1-sub3',
          title: '3. Álgebra de Límites e Indeterminaciones',
          summary: 'Propiedades algebraicas para suma, producto, cociente y potencias. Siete tipos fundamentales de indeterminaciones: 0/0, ∞/∞, ∞ - ∞, 0 · ∞, 1^∞, ∞^0, 0^0.',
          explanation: 'Para resolver indeterminaciones:\n- 0/0 o ∞/∞: Regla de L\'Hôpital derivando numerador y denominador de forma independiente: lim f(x)/g(x) = lim f\'(x)/g\'(x).\n- 0 · ∞: Transformar a cociente: f(x) · g(x) = f(x) / (1/g(x)) o g(x) / (1/f(x)) para aplicar L\'Hôpital.\n- ∞ - ∞: En expresiones con raíces, multiplicar y dividir por el conjugado. En fracciones algebraicas, reducir a común denominador.\n- 1^∞, ∞^0, 0^0: Tomar exponenciación y logaritmo: f(x)^g(x) = e^{g(x) · ln(f(x))} y calcular el límite del exponente.',
          keyFormulas: [
            'Regla de L\'Hôpital: lim f(x)/g(x) = lim f\'(x)/g\'(x) (para 0/0 o ∞/∞)',
            'f(x)^g(x) = e^{g(x) · ln(f(x))}',
            'lim_{x→+∞} x^{1/x} = lim_{x→+∞} e^{(1/x) · ln(x)} = e^0 = 1'
          ]
        },
        {
          id: 'am-t1-sub4',
          title: '4. Continuidad y Derivabilidad de Funciones de una Variable',
          summary: 'Una función es continua en x = a si f(a) está definida, existe lim_{x→a} f(x) y lim_{x→a} f(x) = f(a). La derivada en a es f\'(a) = lim_{h→0} [f(a+h) - f(a)]/h, que representa la pendiente de la recta tangente.',
          explanation: 'Teorema fundamental de relación:\n- Derivable en a ⟹ Continua en a.\n- Continua en a ⇏ Derivable en a (contraejemplo clásico: f(x) = |x| en x = 0).\n- No continua en a ⟹ No derivable en a.\nCausas de no derivabilidad en funciones continuas:\n1. Picos o puntos angulosos (las derivadas laterales existen pero son distintas, ej. |x|).\n2. Tangente vertical (la derivada tiende a ±∞, ej. f(x) = x^{1/3} en x = 0).\n3. Discontinuidad en el punto.',
          keyFormulas: [
            'f\'(a) = lim_{x→a} \\frac{f(x) - f(a)}{x - a} = lim_{h→0} \\frac{f(a+h) - f(a)}{h}',
            'Ecuación recta tangente: y = f(a) + f\'(a)(x - a)',
            'Derivable ⟹ Continua; No Continua ⟹ No Derivable'
          ]
        },
        {
          id: 'am-t1-sub5',
          title: '5. Crecimiento, Puntos Críticos y Extremos (1 Variable)',
          summary: 'f\'(x) > 0 ⟹ f estrictamente creciente; f\'(x) < 0 ⟹ f estrictamente decreciente. Un punto c es punto crítico si f\'(c) = 0 o no existe f\'(c). Teorema de Weierstrass: en [a,b] continuo siempre hay máximo y mínimo absolutos.',
          explanation: 'Para hallar extremos absolutos en un intervalo cerrado [a, b]:\n1. Localizar los puntos críticos en el interior (a, b).\n2. Evaluar f en dichos puntos críticos.\n3. Evaluar f en los extremos del intervalo, f(a) y f(b).\n4. Comparar todos los valores: el mayor es el máximo absoluto y el menor el mínimo absoluto.',
          keyFormulas: [
            'Criterio 1ª derivada: cambio de signo de f\'',
            'Criterio 2ª derivada: f\'(c) = 0 y f\'\'(c) > 0 ⟹ Mínimo; f\'\'(c) < 0 ⟹ Máximo; f\'\'(c) = 0 ⟹ Duda',
            'Teorema de Weierstrass: f continua en [a,b] ⟹ ∃ x_1, x_2 tales que f(x_1) ≤ f(x) ≤ f(x_2)'
          ]
        },
        {
          id: 'am-t1-sub6',
          title: '6. Funciones de Dos Variables, Curvas de Nivel y Límites en R²',
          summary: 'f: D ⊆ R² → R asigna a cada par (x,y) un número real z = f(x,y). Las curvas de nivel son las curvas en el plano xy donde f(x,y) = C.',
          explanation: 'Ejemplos notables de superficies:\n- Paraboloide elíptico / de revolución: z = x² + y² (curvas de nivel: circunferencias concéntricas).\n- Paraboloide hiperbólico: z = x² - y² (curvas de nivel: hipérbolas equiláteras y asíntotas y = ±x para C = 0).\n- Semiesfera: z = √(4 - x² - y²) con x² + y² ≤ 4.\nLímites en dos variables: La distancia entre puntos es ||(x,y) - (a,b)|| = √((x - a)² + (y - b)²). En R² no existen límites laterales; la aproximación se puede realizar por infinitas direcciones o curvas. Si al aproximarse por diferentes rectas y = mx el límite depende de m, el límite doble NO existe.',
          keyFormulas: [
            'Curva de nivel: {(x,y) ∈ Dom(f) : f(x,y) = C}',
            'Límite en ℝ²: lim_{(x,y)→(a,b)} f(x,y) = L',
            'Límite direccional: y - b = m(x - a)'
          ]
        },
        {
          id: 'am-t1-sub7',
          title: '7. Derivadas Parciales, Vector Gradiente y Plano Tangente',
          summary: 'La derivada parcial ∂f/∂x(a,b) mide la tasa de variación respecto a x manteniendo y constante. El vector gradiente ∇f(a,b) = (∂f/∂x, ∂f/∂y) es perpendicular a la curva de nivel y apunta a la dirección de máxima tasa de crecimiento.',
          explanation: 'Interpretación geométrica del gradiente:\n- ∇f(a,b) es normal (ortogonal) a la curva de nivel f(x,y) = C en el punto (a,b).\n- El valor ||∇f(a,b)|| es la máxima pendiente posible en ese punto.\n- El sentido opuesto -∇f(a,b) indica la dirección de máximo decrecimiento.\nPlano tangente a z = f(x,y) en (a,b):\n z = f(a,b) + ∂f/∂x(a,b) · (x - a) + ∂f/∂y(a,b) · (y - b).\nDerivadas de orden superior: si las derivadas parciales de 2º orden son continuas, las derivadas cruzadas coinciden (Teorema de Schwarz): ∂²f/∂x∂y = ∂²f/∂y∂x.',
          keyFormulas: [
            '∂f/∂x(a,b) = lim_{x→a} \\frac{f(x,b) - f(a,b)}{x - a}',
            '∇f(a,b) = (\\frac{∂f}{∂x}(a,b), \\frac{∂f}{∂y}(a,b))',
            'Plano tangente: z = f(a,b) + \\frac{∂f}{∂x}(a,b)(x-a) + \\frac{∂f}{∂y}(a,b)(y-b)'
          ]
        },
        {
          id: 'am-t1-sub8',
          title: '8. Extremos en Dos Variables (Matriz Hessiana) y Optimización',
          summary: 'Puntos críticos: ∇f(x₀,y₀) = (0,0) o derivadas no existentes. Clasificación mediante el determinante de la matriz Hessiana det(H) = AC - B².',
          explanation: 'Sea (x₀, y₀) un punto crítico con derivadas segundas continuas. Definimos:\n A = ∂²f/∂x²(x₀,y₀)\n B = ∂²f/∂x∂y(x₀,y₀)\n C = ∂²f/∂y²(x₀,y₀)\nMatriz Hessiana: H = [[A, B], [B, C]], det(H) = AC - B².\nCriterio de clasificación:\n1. Si AC - B² > 0 y A > 0 ⟹ MÍNIMO RELATIVO LOCAL.\n2. Si AC - B² > 0 y A < 0 ⟹ MÁXIMO RELATIVO LOCAL.\n3. Si AC - B² < 0 ⟹ PUNTO DE SILLA (ni máximo ni mínimo).\n4. Si AC - B² = 0 ⟹ EL CRITERIO NO DECIDE (requiere análisis adicional de signo).',
          keyFormulas: [
            'H = \\begin{pmatrix} A & B \\\\ B & C \\end{pmatrix}, \\quad \\det(H) = AC - B^2',
            'AC - B^2 > 0, A > 0 ⟹ Mínimo Local',
            'AC - B^2 > 0, A < 0 ⟹ Máximo Local',
            'AC - B^2 < 0 ⟹ Punto de Silla'
          ]
        }
      ],
      exercises: [
        {
          id: 'am-ej-1-2',
          title: 'Problema 1.2: Dominio y continuidad de funciones reales',
          difficulty: 'medio',
          statement: 'Halla el dominio de las siguientes funciones y estudia su continuidad:\n(a) f(x) = x² / (2x - 2)\n(b) g(x) = ln(x² - 4) / ((x - 3)(x + 1))\n(c) h(x) = e^{2x} · sin(1/x) + √(4 - x²)',
          hints: [
            'Para f(x), anula el denominador 2x - 2 = 0.',
            'Para g(x), el argumento del logaritmo debe ser > 0 y el denominador ≠ 0.',
            'Para h(x), el argumento de la raíz debe ser ≥ 0 y el argumento de sin(1/x) exige x ≠ 0.'
          ],
          solution: {
            finalAnswer: '(a) Dom(f) = ℝ - {1}, continua en todo su dominio con asíntota vertical en x=1; (b) Dom(g) = (-∞, -2) ∪ (2, 3) ∪ (3, +∞); (c) Dom(h) = [-2, 0) ∪ (0, 2], discontinua evitable o esencial oscilatoria en x=0.',
            stepByStep: [
              'Apartado (a): El denominador se anula si 2x - 2 = 0 ⟺ x = 1. Como el numerador x² en x=1 vale 1 ≠ 0, la función es cociente de polinomios. Dom(f) = ℝ - {1}. Es continua en (-∞, 1) ∪ (1, +∞). En x = 1 presenta una discontinuidad de salto infinito (asíntota vertical).',
              'Apartado (b): Se requieren dos condiciones: 1) x² - 4 > 0 ⟺ (x - 2)(x + 2) > 0 ⟺ x ∈ (-∞, -2) ∪ (2, +∞). 2) Denominador ≠ 0 ⟺ x ≠ 3 y x ≠ -1. Observamos que x = -1 queda fuera de (-∞, -2) ∪ (2, +∞). Por tanto, la única exclusión adicional es x = 3. Dom(g) = (-∞, -2) ∪ (2, 3) ∪ (3, +∞). Continua en todo su dominio por ser cociente y composición de continuas.',
              'Apartado (c): Exige 4 - x² ≥ 0 ⟺ x² ≤ 4 ⟺ x ∈ [-2, 2], y además x ≠ 0 para 1/x en el seno. Por tanto, Dom(h) = [-2, 0) ∪ (0, 2]. Continua en dicho conjunto. En x = 0 no está definida y sin(1/x) oscila indefinidamente entre -1 y 1.'
            ],
            theoreticalNote: 'El dominio de la suma o producto es la intersección de dominios; en cocientes se excluyen los ceros del divisor.'
          }
        },
        {
          id: 'am-ej-1-4',
          title: 'Problema 1.4: Cálculo de límites laterales',
          difficulty: 'medio',
          statement: 'Calcula los siguientes límites laterales:\n(a) lim_{x→0⁻} 6 / (4 + e^{-1/x})  y  lim_{x→0⁺} 6 / (4 + e^{-1/x})\n(b) lim_{x→0⁻} (x sin x) / |x|  y  lim_{x→0⁺} (x sin x) / |x|',
          hints: [
            'En (a), analiza qué le ocurre al exponente -1/x cuando x tiende a 0 por la izquierda (x < 0) y por la derecha (x > 0).',
            'En (b), recuerda que |x| = x si x > 0 y |x| = -x si x < 0.'
          ],
          solution: {
            finalAnswer: '(a) Por la izquierda da 0, por la derecha da 6/4 = 3/2; (b) Ambos límites laterales dan 0.',
            stepByStep: [
              'Apartado (a) lateral izquierdo (x → 0⁻): Si x < 0 y x → 0, entonces 1/x → -∞, luego el exponente -1/x → +∞. Por consiguiente, e^{-1/x} → e^{+∞} = +∞. Entonces el denominador 4 + e^{-1/x} → +∞, y el cociente 6 / (+∞) = 0.',
              'Apartado (a) lateral derecho (x → 0⁺): Si x > 0 y x → 0, 1/x → +∞, luego el exponente -1/x → -∞. Por tanto, e^{-1/x} → e^{-∞} = 0. El denominador es 4 + 0 = 4, y el límite vale 6/4 = 3/2.',
              'Conclusión de (a): Como los límites laterales son distintos (0 ≠ 3/2), no existe el límite global en x = 0.',
              'Apartado (b) lateral izquierdo (x → 0⁻): En x < 0, |x| = -x. Entonces (x sin x)/(-x) = -sin x. Cuando x → 0⁻, -sin(0) = 0.',
              'Apartado (b) lateral derecho (x → 0⁺): En x > 0, |x| = x. Entonces (x sin x)/x = sin x. Cuando x → 0⁺, sin(0) = 0.',
              'Conclusión de (b): Ambos límites laterales coinciden en 0, por tanto lim_{x→0} (x sin x)/|x| = 0.'
            ],
            theoreticalNote: 'Un límite existe si y solo si ambos límites laterales son finitos e idénticos.'
          }
        },
        {
          id: 'am-ej-1-6',
          title: 'Problema 1.6: Continuidad con parámetros a y b',
          difficulty: 'fácil',
          statement: 'Encuentra los valores de a y b para que f(x) sea continua en todo ℝ:\nf(x) = ax + b si x < -1;\nf(x) = x² + x si -1 ≤ x ≤ 1;\nf(x) = ax + b si x > 1.',
          hints: [
            'Para continuidad en x = -1, exige que lim_{x→-1⁻} f(x) = f(-1).',
            'Para continuidad en x = 1, exige que lim_{x→1⁺} f(x) = f(1).'
          ],
          solution: {
            finalAnswer: 'a = 1, b = 1',
            stepByStep: [
              'Continuidad en x = -1:\n- Límite por la izquierda: lim_{x→-1⁻} (ax + b) = -a + b.\n- Valor en el punto: f(-1) = (-1)² + (-1) = 1 - 1 = 0.\n- Condición 1: -a + b = 0 ⟹ a = b.',
              'Continuidad en x = 1:\n- Valor en el punto: f(1) = 1² + 1 = 2.\n- Límite por la derecha: lim_{x→1⁺} (ax + b) = a + b.\n- Condición 2: a + b = 2.',
              'Resolviendo el sistema:\nSustituyendo a = b en la segunda ecuación: b + b = 2 ⟹ 2b = 2 ⟹ b = 1, y por tanto a = 1.'
            ],
            theoreticalNote: 'Para funciones definidas a trozos con polinomios en cada intervalo, solo es necesario garantizar la continuidad en las fronteras de empalme.'
          }
        },
        {
          id: 'am-ej-1-10',
          title: 'Problema 1.10: Indeterminaciones y regla de L\'Hôpital',
          difficulty: 'avanzado',
          statement: 'Calcula los siguientes límites resolviendo adecuadamente las indeterminaciones:\n(a) lim_{x→1} (√x - 1) / (∛x - 1)\n(b) lim_{x→∞} (x³ - x² + 1) / (2x² + x³)\n(c) lim_{x→∞} (1 + x + x³) / ln(x)\n(d) lim_{x→0⁺} x · ln(x)\n(e) lim_{x→∞} (1 + x + x³) / e^x\n(f) lim_{x→0} (tan x - sin 2x) / x\n(g) lim_{x→∞} (√(x + 1) - √x)\n(h) lim_{x→0⁺} x^x',
          hints: [
            'En (a) usa L\'Hôpital o cambio de variable t⁶ = x.',
            'En (d) escribe x · ln x como ln x / (1/x) y aplica L\'Hôpital.',
            'En (g) multiplica por el conjugado (√(x+1) + √x).',
            'En (h) escribe x^x = e^{x ln x}.'
          ],
          solution: {
            finalAnswer: '(a) 3/2; (b) 1; (c) +∞; (d) 0; (e) 0; (f) -1; (g) 0; (h) 1',
            stepByStep: [
              '(a) Indeterminación 0/0. Por L\'Hôpital: numerador f\'(x) = 1/(2√x), denominador g\'(x) = 1/(3 x^{2/3}). Al evaluar en x=1: (1/2)/(1/3) = 3/2.',
              '(b) Grados iguales (grado 3 en numerador y denominador): los términos dominantes son x³ / x³ = 1.',
              '(c) Polinomio frente a logaritmo en +∞: el crecimiento potencial supera al logarítmico, resultado +∞.',
              '(d) Indeterminación 0 · (-∞). Escribimos ln(x) / (1/x). Aplicando L\'Hôpital: (1/x) / (-1/x²) = -x. Evaluando en 0⁺: 0.',
              '(e) Polinomio frente a exponencial e^x en +∞: la función exponencial crece estrictamente más rápido que cualquier potencia, límite 0.',
              '(f) tan x - sin 2x en x=0 da 0/0. Derivada del numerador: 1/cos²(x) - 2cos(2x). En x=0: 1 - 2 = -1. Derivada del denominador: 1. Límite = -1.',
              '(g) Indeterminación ∞ - ∞. Multiplicamos y dividimos por conjugado: (x + 1 - x) / (√(x+1) + √x) = 1 / (√(x+1) + √x) → 1 / ∞ = 0.',
              '(h) x^x = e^{x ln x}. Como lim_{x→0⁺} x ln x = 0 (visto en d), el límite es e^0 = 1.'
            ],
            theoreticalNote: 'La escala de infinitos en x→+∞ es: (ln x)^a ≪ x^b ≪ c^x (con a,b>0, c>1).'
          }
        },
        {
          id: 'am-ej-1-20',
          title: 'Problema 1.20: Derivadas parciales y Teorema de Schwarz',
          difficulty: 'avanzado',
          statement: 'Dadas las funciones:\nf(x,y) = cos(x - y) - e^{xy}/y,  g(x,y,z) = 1 / (x² + y² + z²)\nSe pide:\n(a) Hallar sus dominios.\n(b) Calcular sus derivadas parciales de primer orden.\n(c) Comprobar que coinciden las derivadas parciales cruzadas ∂²f/∂x∂y = ∂²f/∂y∂x.\n(d) Comprobar que ∂²g/∂x² + ∂²g/∂y² + ∂²g/∂z² = 2 / (x² + y² + z²)².',
          hints: [
            'Para f(x,y), la única restricción es el denominador y ≠ 0.',
            'Para g(x,y,z), la suma de cuadrados en el denominador no puede ser 0.',
            'Aplica la regla del cociente y del producto al derivar e^{xy}/y.'
          ],
          solution: {
            finalAnswer: '(a) Dom(f) = {(x,y) ∈ ℝ²: y ≠ 0}, Dom(g) = ℝ³ - {(0,0,0)}; (c) Ambas derivadas cruzadas dan sin(x-y) - e^{xy}(1 + xy)/y; (d) Queda verificado.',
            stepByStep: [
              '(a) Dom(f) exige y ≠ 0 (todo el plano salvo el eje x). Dom(g) exige x² + y² + z² ≠ 0, que sólo ocurre en el origen (0,0,0).',
              '(b) Derivadas parciales de f:\n∂f/∂x = -sin(x - y) - (y · e^{xy})/y = -sin(x - y) - e^{xy}.\n∂f/∂y = sin(x - y) - [x·e^{xy}·y - e^{xy}]/y² = sin(x - y) - e^{xy}(xy - 1)/y².',
              '(c) Derivada cruzada ∂/∂y (∂f/∂x): ∂/∂y [-sin(x-y) - e^{xy}] = -cos(x-y)·(-1) - x·e^{xy} = cos(x-y) - x·e^{xy}.\nDerivada cruzada ∂/∂x (∂f/∂y): ∂/∂x [sin(x-y) - e^{xy}(xy-1)/y²] = cos(x-y) - [y·e^{xy}(xy-1) + e^{xy}·y]/y² = cos(x-y) - x·e^{xy}. Coinciden con exactitud.',
              '(d) Sea r² = x² + y² + z². Entonces g = r^{-2}.\n∂g/∂x = -2x · r^{-4}.\n∂²g/∂x² = -2·r^{-4} + (-2x)·(-4)·r^{-5}·(x/r) = -2 r^{-4} + 8x² r^{-6}.\nPor simetría, la suma sobre x, y, z es: -6 r^{-4} + 8(x² + y² + z²) r^{-6} = -6 r^{-4} + 8 r² r^{-6} = 2 r^{-4} = 2 / (x² + y² + z²)².'
            ],
            theoreticalNote: 'El operador ∇² = ∂²/∂x² + ∂²/∂y² + ∂²/∂z² es el Laplaciano tridimensional.'
          }
        },
        {
          id: 'am-ej-1-26',
          title: 'Problema 1.26: Puntos críticos y matriz Hessiana',
          difficulty: 'examen',
          statement: 'Halla los puntos críticos de la función f(x, y) = x³ - y³ + xy y determina si son máximos, mínimos o puntos de silla.',
          hints: [
            'Calcula el gradiente ∇f(x,y) e iguálalo a (0,0).',
            'Obtén las soluciones del sistema 3x² + y = 0 y -3y² + x = 0.',
            'Evalúa la matriz Hessiana H en cada punto crítico.'
          ],
          solution: {
            finalAnswer: '(0,0) es un punto de silla; (-1/3, 1/3) es un máximo local.',
            stepByStep: [
              '1. Derivadas parciales de primer orden:\n∂f/∂x = 3x² + y\n∂f/∂y = -3y² + x',
              '2. Puntos críticos (sistema ∇f = 0):\n{ 3x² + y = 0 ⟹ y = -3x²\n{ -3y² + x = 0 ⟹ x = 3y² = 3(-3x²)² = 3(9x⁴) = 27x⁴.\nReordenando: 27x⁴ - x = 0 ⟺ x(27x³ - 1) = 0.\n- Si x = 0 ⟹ y = -3(0)² = 0. Punto P₁ = (0, 0).\n- Si 27x³ = 1 ⟹ x³ = 1/27 ⟹ x = 1/3. Pero cuidado: y = -3(1/3)² = -1/3. Comprobamos en la segunda ecuación: -3(-1/3)² + 1/3 = -3(1/9) + 1/3 = 0. ¿Y para f(x,y) = x³ - y³ + xy? Si x = -1/3: 3(-1/3)² + y = 1/3 + y = 0 ⟹ y = -1/3. Revisemos signos del enunciado original de diapositiva 9: f(x,y) = x³ - y³ + xy.\n∂f/∂x = 3x² + y = 0 ⟹ y = -3x².\n∂f/∂y = -3y² + x = 0 ⟹ x = 3y² = 3(-3x²)² = 27x⁴ ⟹ x(27x³ - 1) = 0 ⟹ x = 1/3, y = -1/3.\n(También si x = 0, y = 0).',
              '3. Derivadas de segundo orden:\nA = ∂²f/∂x² = 6x\nB = ∂²f/∂x∂y = 1\nC = ∂²f/∂y² = -6y\nDeterminante Hessiano: det(H) = AC - B² = (6x)(-6y) - 1² = -36xy - 1.',
              '4. Clasificación:\n- En P₁(0,0): det(H) = -36(0)(0) - 1 = -1 < 0. Por tanto, (0, 0) es un PUNTO DE SILLA.\n- En P₂(1/3, -1/3): det(H) = -36(1/3)(-1/3) - 1 = +4 - 1 = +3 > 0.\nComo det(H) > 0 y A = 6(1/3) = 2 > 0: en este punto f tiene un MÍNIMO RELATIVO.'
            ],
            theoreticalNote: 'Un punto de silla presenta curvaturas opuestas en diferentes direcciones ortogonales (como la silla de montar o una patata Pringle).'
          }
        },
        {
          id: 'am-ej-1-32',
          title: 'Problema 1.32: Optimización de costes de insonorización de una nave',
          difficulty: 'examen',
          statement: 'Se quiere insonorizar las paredes y techo de una nave de 8000 m³ de volumen. El tratamiento de las paredes cuesta 25 €/m² y el tratamiento del techo cuesta 50 €/m² (puerta y ventanas se tratan como paredes). Determina cuáles son las dimensiones (x: ancho, y: fondo, z: alto) para que el gasto sea mínimo.',
          hints: [
            'El volumen fijo es V = x · y · z = 8000.',
            'Área del techo = x · y. Área de las 4 paredes = 2xz + 2yz.',
            'Función coste: C = 50xy + 25(2xz + 2yz). Despeja z = 8000/(xy).'
          ],
          solution: {
            finalAnswer: 'Dimensiones óptimas: ancho x = 20 m, fondo y = 20 m, altura z = 20 m. Gasto mínimo = 60.000 €.',
            stepByStep: [
              '1. Relación de ligadura:\nVolumen = x · y · z = 8000 ⟹ z = 8000 / (x · y).',
              '2. Función de coste:\nC(x,y,z) = 50(techo) + 25(paredes) = 50xy + 25(2xz + 2yz) = 50xy + 50z(x + y).\nSustituyendo z:\nC(x,y) = 50xy + 50 [8000(x + y)/(xy)] = 50 [xy + 8000/y + 8000/x].',
              '3. Puntos críticos (derivadas parciales nulas):\n∂C/∂x = 50 (y - 8000/x²) = 0 ⟹ y = 8000/x².\n∂C/∂y = 50 (x - 8000/y²) = 0 ⟹ x = 8000/y².',
              '4. Resolviendo el sistema simétrico:\nSustituyendo y: x = 8000 / (8000/x²)² = x⁴ / 8000 ⟹ x³ = 8000 ⟹ x = 20 m.\nLuego y = 8000 / 20² = 8000 / 400 = 20 m.\nAltura z = 8000 / (20 · 20) = 8000 / 400 = 20 m.',
              '5. Comprobación de mínimo con matriz Hessiana:\n∂²C/∂x² = 100 · 8000 / x³ = 800.000 / 8000 = 100 > 0.\n∂²C/∂y² = 800.000 / y³ = 100.\n∂²C/∂x∂y = 50.\nAC - B² = 100 · 100 - 50² = 10000 - 2500 = 7500 > 0.\nComo det(H) > 0 y A > 0, es un mínimo estricto.'
            ],
            theoreticalNote: 'En problemas geométricos tridimensionales con coeficientes simétricos en base cuadrada, la solución óptima suele ser cúbica.'
          }
        }
      ],
      examQuestions: [
        {
          id: 'am-q1',
          question: 'Si una función f(x) es continua en x = a, ¿cuál de las siguientes afirmaciones es SIEMPRE verdadera?',
          options: [
            'f(x) es necesariamente derivable en x = a',
            'f(x) no puede tener extremos en x = a',
            'f(x) no es necesariamente derivable en x = a (puede haber un punto anguloso o tangente vertical)',
            'f\'(a) debe ser igual a 0'
          ],
          correctIndex: 2,
          explanation: 'La derivabilidad implica continuidad, pero la continuidad NO implica derivabilidad (como en f(x) = |x| en x = 0).',
          points: 2
        },
        {
          id: 'am-q2',
          question: 'En un punto crítico (x₀, y₀) de una función f(x,y) con derivadas continuas, si el determinante de la matriz Hessiana det(H) = AC - B² < 0, se trata de:',
          options: [
            'Un mínimo relativo local',
            'Un punto de silla',
            'Un máximo relativo local',
            'El criterio no decide'
          ],
          correctIndex: 1,
          explanation: 'Cuando det(H) < 0, la superficie posee curvaturas principales de signos opuestos en ese punto crítico, lo que define un punto de silla.',
          points: 2
        },
        {
          id: 'am-q3',
          question: 'Geométricamente, el vector gradiente ∇f(a,b) de una función f(x,y) en el punto (a,b):',
          options: [
            'Es tangente a la curva de nivel que pasa por (a,b)',
            'Es ortogonal (perpendicular) a la curva de nivel que pasa por (a,b) e indica la dirección de máxima tasa de crecimiento',
            'Siempre tiene módulo igual a 0',
            'Apunta hacia el origen de coordenadas'
          ],
          correctIndex: 1,
          explanation: 'Por el Teorema de la gradiente, ∇f(a,b) es perpendicular a la curva de nivel f(x,y)=C en (a,b) y su dirección coincide con la de máxima derivada direccional.',
          points: 2
        },
        {
          id: 'am-q4',
          question: '¿Cuál es el valor del límite lim_{x→0⁺} x · ln(x)?',
          options: [
            '-∞',
            '1',
            '0',
            'No existe'
          ],
          correctIndex: 2,
          explanation: 'Reescribiendo como ln(x)/(1/x) y aplicando L\'Hôpital obtenemos (1/x)/(-1/x²) = -x, que al tender a 0⁺ da 0.',
          points: 2
        },
        {
          id: 'am-q5',
          question: 'Para una nave de 8000 m³ de volumen donde las paredes cuestan 25 €/m² y el techo 50 €/m², las dimensiones de coste mínimo son:',
          options: [
            'x = 10, y = 20, z = 40',
            'x = 20, y = 20, z = 20',
            'x = 40, y = 10, z = 20',
            'x = 15, y = 15, z = 35.5'
          ],
          correctIndex: 1,
          explanation: 'Optimizando C(x,y) = 50xy + 400000/x + 400000/y, se obtiene x = y = 20 m y z = 8000/(20·20) = 20 m.',
          points: 2
        }
      ],
      practicalExamProblems: []
    },
    {
      id: 'am-tema-2',
      number: 2,
      title: 'Tema 2: Integración y Ecuaciones Diferenciales Ordinarias (EDO)',
      subtitle: 'Integral de Riemann, Teorema Fundamental del Cálculo, Barrow, impropias y resolución de EDOs',
      description: 'Fundamentos del cálculo integral, sumas de Darboux, función integral, integrales impropias en intervalos infinitos, funciones de densidad de probabilidad y resolución analítica de EDOs de variables separables.',
      subtopics: [
        {
          id: 'am-t2-sub1',
          title: '1. Integrales Inmediatas y Métodos Básicos',
          summary: 'Tabla de integrales inmediatas (potencias, exponenciales, logaritmos, trigonométricas, arco tangente). Métodos: linealidad, cambio de variable (regla de la cadena inversa) e integración por partes.',
          explanation: 'Fórmulas principales:\n- ∫ x^p dx = x^{p+1}/(p+1) + C (p ≠ -1)\n- ∫ (1/x) dx = ln|x| + C\n- ∫ e^x dx = e^x + C, ∫ a^x dx = a^x / ln(a) + C\n- ∫ 1/(1+x²) dx = arctan(x) + C, ∫ 1/√(1-x²) dx = arcsin(x) + C\n- Integración por partes: ∫ u v\' dx = u v - ∫ v u\' dx (regla mnemonica ALPES para elegir u: Arco/Log/Polinomio/Exp/Sin-Cos).',
          keyFormulas: [
            '\\int u \\, dv = u \\cdot v - \\int v \\, du',
            '\\int h\'(f(x)) \\cdot f\'(x) \\, dx = h(f(x)) + C',
            '\\int_0^\\pi x \\cos(x) \\, dx = [x \\sin(x)]_0^\\pi - \\int_0^\\pi \\sin(x) \\, dx = -2'
          ]
        },
        {
          id: 'am-t2-sub2',
          title: '2. Concepto de Integral de Riemann y Formalización',
          summary: 'La integral de Riemann ∫_a^b f(x)dx surge del cálculo del área bajo la curva f(x) mediante aproximación por rectángulos cuando el número de subintervalos tiende a infinito.',
          explanation: 'Formalización de Darboux:\n- Una partición P = {x₀, x₁, ..., xₙ} divide [a,b] en n subintervalos [x_{i-1}, x_i].\n- Suma inferior L(P,f) = ∑ (x_i - x_{i-1}) · m_i, donde m_i = inf {f(x)} en el subintervalo.\n- Suma superior U(P,f) = ∑ (x_i - x_{i-1}) · M_i, donde M_i = sup {f(x)} en el subintervalo.\n- Una función acotada f es integrable en [a,b] si y solo si lim_{n→∞} L(Pₙ, f) = lim_{n→∞} U(Pₙ, f).\nCondiciones suficientes de integrabilidad:\n1. Toda función continua en [a, b] es integrable.\n2. Toda función acotada en [a, b] y continua salvo en un número finito de puntos es integrable.',
          keyFormulas: [
            'L(P,f) = \\sum_{i=1}^n (x_i - x_{i-1}) \\cdot m_i',
            'U(P,f) = \\sum_{i=1}^n (x_i - x_{i-1}) \\cdot M_i',
            '\\lim L(P_n, f) = \\lim U(P_n, f) = \\int_a^b f(x)dx'
          ]
        },
        {
          id: 'am-t2-sub3',
          title: '3. Propiedades de la Integral de Riemann',
          summary: 'Linealidad, aditividad respecto al intervalo, inversión de límites y monotonía (conservación de desigualdades).',
          explanation: 'Propiedades clave:\n- Inversión de límites: ∫_a^a f = 0, y ∫_b^a f = - ∫_a^b f.\n- Linealidad: ∫ (k₁f + k₂g) = k₁ ∫ f + k₂ ∫ g.\n- Aditividad respecto al intervalo: si c ∈ [a,b], ∫_a^b f = ∫_a^c f + ∫_c^b f.\n- Monotonía: si f(x) ≥ 0 en [a,b] con a ≤ b ⟹ ∫_a^b f ≥ 0.\n- Si f(x) ≤ g(x) ⟹ ∫ f ≤ ∫ g.\n- Acotación: m(b - a) ≤ ∫_a^b f ≤ M(b - a).\n- Desigualdad triangular: |∫_a^b f| ≤ ∫_a^b |f|.',
          keyFormulas: [
            '\\int_b^a f = -\\int_a^b f',
            '\\int_a^b f = \\int_a^c f + \\int_c^b f',
            '|\\int_a^b f(x)dx| \\le \\int_a^b |f(x)|dx'
          ]
        },
        {
          id: 'am-t2-sub4',
          title: '4. Teorema Fundamental del Cálculo (TFC) y Regla de Barrow',
          summary: 'Si f es integrable, F(x) = ∫_a^x f(t)dt es continua. Si f es continua en c, F es derivable en c y F\'(c) = f(c). Regla de Barrow: ∫_a^b f = G(b) - G(a).',
          explanation: 'Demostración del TFC:\n[F(c+h) - F(c)]/h = (1/h) ∫_c^{c+h} f(t)dt.\nComo f es continua en c, para |t - c| < h, |f(t) - f(c)| < ε.\n|(1/h) ∫_c^{c+h} (f(t) - f(c)) dt| ≤ (1/h) · h · ε = ε.\nTomando h → 0, F\'(c) = f(c).\nRegla de Barrow:\nSi G es cualquier primitiva de f (es decir G\' = f), como F(x) y G(x) difieren en una constante C: F(x) = G(x) + C. Como F(a) = 0 = G(a) + C ⟹ C = -G(a), por lo que F(b) = ∫_a^b f(t)dt = G(b) - G(a).',
          keyFormulas: [
            'F(x) = \\int_a^x f(t)dt \\implies F\'(x) = f(x)',
            'Regla de Barrow: \\int_a^b f(x)dx = [G(x)]_a^b = G(b) - G(a)'
          ]
        },
        {
          id: 'am-t2-sub5',
          title: '5. Integrales Impropias en Intervalos Infinitos y Convergencia',
          summary: 'Definición: ∫_a^∞ f(x)dx = lim_{b→∞} ∫_a^b f(x)dx. Si el límite existe y es finito, la integral converge; si no existe o es infinito, diverge.',
          explanation: 'Resultado canónico de examen:\n- ∫_1^∞ (1 / x^p) dx es CONVERGENTE si y solo si p > 1.\nSi p = 1: ∫_1^b 1/x dx = ln(b) → ∞ (diverge).\nSi p ≠ 1: [x^{1-p}/(1-p)]_1^b. Si p > 1, el exponente 1 - p < 0, luego b^{1-p} → 0 y la integral vale 1/(p - 1) (converge).\n- Integral exponencial: ∫_a^∞ e^{px} dx converge si y solo si p < 0.',
          keyFormulas: [
            '\\int_a^\\infty f(x)dx = \\lim_{b\\to\\infty} \\int_a^b f(x)dx',
            '\\int_1^\\infty \\frac{1}{x^p} dx \\text{ converge } \\iff p > 1',
            '\\int_a^\\infty e^{px} dx \\text{ converge } \\iff p < 0'
          ]
        },
        {
          id: 'am-t2-sub6',
          title: '6. Introducción a las Ecuaciones Diferenciales Ordinarias (EDO)',
          summary: 'Una EDO relaciona una variable independiente x, una función incógnita y = f(x) y sus derivadas. Orden: mayor derivada presente. Lineal si y y sus derivadas aparecen con exponente 1 y no multiplicadas entre sí.',
          explanation: 'Definiciones clave:\n- EDO lineal de orden n: y^{(n)} + g₁(x)y^{(n-1)} + ... + g_n(x)y = h(x).\n- Si h(x) = 0, se llama lineal homogénea.\n- Solución particular: función concreta que satisface la ecuación.\n- Solución general: conjunto de todas las soluciones particulares (incluye constantes arbitrarias C).\n- Problema de Valor Inicial (PVI): EDO sujeta a condiciones iniciales y(x₀) = y₀ para fijar la constante C.',
          keyFormulas: [
            'EDO lineal homogénea de orden 1: y\' + P(x)y = 0',
            'Variables separables: g(y) y\' = f(x) \\iff \\int g(y)dy = \\int f(x)dx + C',
            'PVI: y\' = 2y, \\, y(0) = 3 \\implies y = 3e^{2x}'
          ]
        }
      ],
      exercises: [
        {
          id: 'am-ej-2-0',
          title: 'Problema 2.0: Primitivas e integrales definidas (Partes y Sustitución)',
          difficulty: 'fácil',
          statement: 'Calcula las siguientes integrales definidas:\n(u) ∫₀^π x · cos(x) dx\n(z) ∫₀^{π/2} sin(x) / (1 + cos²(x)) dx',
          hints: [
            'En (u) aplica integración por partes con u = x, dv = cos(x)dx.',
            'En (z) haz el cambio de variable t = cos(x), dt = -sin(x)dx.'
          ],
          solution: {
            finalAnswer: '(u) -2; (z) π/4',
            stepByStep: [
              'Apartado (u):\nu = x ⟹ du = dx\ndv = cos(x)dx ⟹ v = sin(x)\n∫ x cos(x) dx = x sin(x) - ∫ sin(x) dx = x sin(x) + cos(x).\nEvaluamos entre 0 y π:\n[π sin(π) + cos(π)] - [0 sin(0) + cos(0)] = [0 + (-1)] - [0 + 1] = -1 - 1 = -2.',
              'Apartado (z):\nCambio de variable t = cos(x) ⟹ dt = -sin(x)dx ⟹ sin(x)dx = -dt.\nNuevos límites de integración:\nPara x = 0 ⟹ t = cos(0) = 1.\nPara x = π/2 ⟹ t = cos(π/2) = 0.\n∫₀^{π/2} sin(x)/(1 + cos²(x)) dx = ∫₁⁰ -dt / (1 + t²) = ∫₀¹ dt / (1 + t²) = [arctan(t)]₀¹ = arctan(1) - arctan(0) = π/4 - 0 = π/4.'
            ]
          }
        },
        {
          id: 'am-ej-2-4',
          title: 'Problema 2.4: Determinación de parámetro k con integral a trozos',
          difficulty: 'medio',
          statement: 'Halla el valor de k para que ∫_{-3}^2 f(x) dx = 1, siendo:\nf(x) = x/3 + 1 si -3 ≤ x < -1;\nf(x) = k si -1 ≤ x ≤ 2;\nf(x) = 0 en otro caso.',
          hints: [
            'Aplica la propiedad de aditividad de la integral dividiendo en [-3, -1] y [-1, 2].'
          ],
          solution: {
            finalAnswer: 'k = 2/9',
            stepByStep: [
              '1. Descomposición por aditividad de la integral:\n∫_{-3}^2 f(x) dx = ∫_{-3}^{-1} (x/3 + 1) dx + ∫_{-1}^2 k dx.',
              '2. Primera integral:\nPrimitiva de (x/3 + 1) es x²/6 + x.\nEvaluando entre -3 y -1:\n[(-1)²/6 + (-1)] - [(-3)²/6 + (-3)] = [1/6 - 1] - [9/6 - 3] = (-5/6) - (3/2 - 3) = -5/6 - (-3/2) = -5/6 + 9/6 = 4/6 = 2/3.',
              '3. Segunda integral:\n∫_{-1}^2 k dx = k · [2 - (-1)] = 3k.',
              '4. Igualando a 1:\n2/3 + 3k = 1 ⟹ 3k = 1 - 2/3 = 1/3 ⟹ k = 1/9. (Verificamos: 2/3 + 3*(1/9) = 2/3 + 1/3 = 1). Por tanto k = 1/9.'
            ]
          }
        },
        {
          id: 'am-ej-2-8',
          title: 'Problema 2.8: Convergencia de integral impropia logarítmica',
          difficulty: 'avanzado',
          statement: 'Analiza la convergencia de la integral impropia ∫_e^∞ (ln(x))^p / x dx en función del valor del parámetro real p.',
          hints: [
            'Aplica el cambio de variable u = ln(x), du = (1/x) dx.'
          ],
          solution: {
            finalAnswer: 'Converge si y solo si p < -1; diverge para p ≥ -1.',
            stepByStep: [
              '1. Cambio de variable:\nSea u = ln(x) ⟹ du = dx / x.\nLímites: cuando x = e ⟹ u = ln(e) = 1. Cuando x → ∞ ⟹ u → ∞.',
              '2. Transformación de la integral:\n∫_e^∞ (ln(x))^p / x dx = ∫₁^∞ u^p du = ∫₁^∞ 1 / u^{-p} du.',
              '3. Aplicación del criterio de la p-integral:\nSabemos que ∫₁^∞ 1 / u^q du converge si y solo si el exponente del denominador q > 1.\nAquí el exponente del denominador es -p, por lo que converge si y solo si -p > 1 ⟺ p < -1.',
              '4. Caso límite p = -1:\n∫₁^b (1/u) du = ln(b) → ∞ cuando b → ∞ (diverge).'
            ]
          }
        },
        {
          id: 'am-ej-2-20',
          title: 'Problema 2.20: Clasificación y resolución de EDOs',
          difficulty: 'examen',
          statement: 'Dados los siguientes Problemas de Valor Inicial (PVI):\n(a) y\' = y^{1/2}, y(0) = 1\n(b) y\'\' + 10y = 2y\', y(0) = 0, y\'(0) = 1\n(c) (1 + y²) + xyy\' = 0, y(1) = -2\n(d) y\' - x³y = 0, y(0) = 4\n(e) y\' + y = 6, y(0) = 2\n(f) y\' - 3y = x - 2x², y(0) = 0\nIndica qué tipo de EDO son (orden, linealidad, homogeneidad, separabilidad) y resuelve las que sean de variables separables.',
          hints: [
            '(a), (c), (d), (e) son de variables separables.',
            'En (c), separa y dy / (1+y²) = - dx / x.'
          ],
          solution: {
            finalAnswer: '(a) y(x) = (x/2 + 1)²; (c) y² = 5/x² - 1; (d) y(x) = 4 e^{x⁴/4}; (e) y(x) = 6 - 4e^{-x}',
            stepByStep: [
              'Clasificación:\n(a) Orden 1, no lineal (y^{1/2}), separable.\n(b) Orden 2, lineal, homogénea (y\'\' - 2y\' + 10y = 0), coeficientes constantes.\n(c) Orden 1, no lineal (y² y y·y\'), separable.\n(d) Orden 1, lineal homogénea, separable.\n(e) Orden 1, lineal no homogénea, separable.\n(f) Orden 1, lineal no homogénea, no separable directamente.',
              'Resolución separable (a):\ndy / y^{1/2} = dx ⟹ 2 y^{1/2} = x + C. Con y(0) = 1: 2(1) = 0 + C ⟹ C = 2. Por tanto y^{1/2} = x/2 + 1 ⟹ y(x) = (x/2 + 1)².',
              'Resolución separable (c):\nxy y\' = -(1 + y²) ⟹ y dy / (1 + y²) = -dx / x.\nIntegrando: (1/2) ln(1 + y²) = -ln|x| + C = ln(K / |x|).\n1 + y² = K² / x². Con x = 1, y = -2: 1 + 4 = K² / 1 ⟹ K² = 5.\nPor tanto 1 + y² = 5 / x² ⟹ y² = 5/x² - 1.',
              'Resolución separable (d):\ndy / y = x³ dx ⟹ ln|y| = x⁴/4 + C ⟹ y = K e^{x⁴/4}.\nCon y(0) = 4 ⟹ K = 4 ⟹ y(x) = 4 e^{x⁴/4}.',
              'Resolución separable (e):\ndy / (6 - y) = dx ⟹ -ln|6 - y| = x + C ⟹ 6 - y = K e^{-x}.\nCon y(0) = 2 ⟹ 6 - 2 = K ⟹ K = 4 ⟹ y(x) = 6 - 4e^{-x}.'
            ]
          }
        },
        {
          id: 'am-ej-2-cuestion4',
          title: 'Cuestión 4 de Examen: Modelo de sobrecalentamiento de batería de móvil',
          difficulty: 'examen',
          statement: 'Un cierto modelo de móvil estalla cuando el voltaje de su batería supera los 8V. En reposo el voltaje es de 3.7V. Cuando se inicia un juego el voltaje se incrementa de forma directamente proporcional al propio voltaje. Si V(t) es el voltaje en el instante t (en horas), se sabe que la constante de proporcionalidad es k = 0.1.\n(a) Hallar una expresión para V(t).\n(b) ¿Tras cuántas horas jugando estallaría el móvil?\n(c) Calcular el voltaje tras una hora de juego.',
          hints: [
            'La EDO es dV/dt = k · V con V(0) = 3.7 y k = 0.1.',
            'Para el tiempo hasta estallar, resuelve V(t) = 8.'
          ],
          solution: {
            finalAnswer: '(a) V(t) = 3.7 · e^{0.1 t}; (b) t ≈ 7.71 horas (7 horas y 43 minutos); (c) V(1) ≈ 4.09 V',
            stepByStep: [
              'Apartado (a):\nLa ecuación diferencial es dV/dt = 0.1 · V. Separando variables: dV / V = 0.1 dt.\nIntegrando ambos lados: ln(V) = 0.1 t + C ⟹ V(t) = V₀ · e^{0.1 t}.\nDado que en t = 0 el voltaje en reposo es V(0) = 3.7V, la solución es:\nV(t) = 3.7 · e^{0.1 t}.',
              'Apartado (b):\nEl móvil estalla cuando V(t) = 8V:\n8 = 3.7 · e^{0.1 t} ⟹ e^{0.1 t} = 8 / 3.7 ≈ 2.162.\nTomando logaritmos naturales:\n0.1 t = ln(8 / 3.7) ≈ 0.7711 ⟹ t = 0.7711 / 0.1 = 7.711 horas (aproximadamente 7 h 42 min 40 s).',
              'Apartado (c):\nPara t = 1 hora:\nV(1) = 3.7 · e^{0.1 · 1} = 3.7 · e^{0.1} ≈ 3.7 · 1.10517 = 4.089 V.'
            ]
          }
        }
      ],
      examQuestions: [
        {
          id: 'am-q6',
          question: 'La integral impropia ∫₁^∞ (1 / x^p) dx es convergente si y solo si:',
          options: [
            'p ≥ 1',
            'p > 1',
            'p < 1',
            'p = 0'
          ],
          correctIndex: 1,
          explanation: 'Para p = 1 da ln(x) que tiende a infinito. Para p > 1, el exponente en el límite es negativo y converge a 1/(p - 1).',
          points: 2
        },
        {
          id: 'am-q7',
          question: 'Dada una función f continua en [a,b] y F(x) = ∫_a^x f(t)dt, por el Teorema Fundamental del Cálculo:',
          options: [
            'F(x) no es derivable en ningún punto',
            'F\'(x) = f(x) para todo x ∈ (a,b)',
            'F\'(x) = f\'(x)',
            'F(x) es una función discontinua'
          ],
          correctIndex: 1,
          explanation: 'El TFC garantiza que la derivada de la función integral de una función continua es la función original del integrando.',
          points: 2
        },
        {
          id: 'am-q8',
          question: 'La solución general de la EDO y\' - 3y = 0 es:',
          options: [
            'y(x) = 3x + C',
            'y(x) = C · e^{3x}',
            'y(x) = C · e^{-3x}',
            'y(x) = e^{3x} + C'
          ],
          correctIndex: 1,
          explanation: 'Separando variables: dy/y = 3dx ⟹ ln|y| = 3x + K ⟹ y = C · e^{3x}.',
          points: 2
        }
      ],
      practicalExamProblems: []
    }
  ]
};
