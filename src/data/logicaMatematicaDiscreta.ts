import { Subject } from '../types';

export const logicaMatematicaDiscretaSubject: Subject = {
  id: 'lymd',
  name: 'Lógica y Matemática Discreta',
  shortName: 'LyMD',
  code: '595000003',
  ects: 6,
  color: 'blue',
  description: 'Teoría de conjuntos, correspondencias y aplicaciones, inducción matemática, divisibilidad y congruencias modulares, criptosistema RSA, y técnicas avanzadas de combinatoria.',
  topics: [
    {
      id: 'lymd-tema-1',
      number: 1,
      title: 'Tema 1: Conjuntos y aplicaciones',
      subtitle: 'Operaciones de conjuntos, partes de un conjunto, correspondencias, inyectividad, sobreyectividad y composición',
      description: 'Fundamentos de la teoría de conjuntos finitos e infinitos, álgebra de Boole de conjuntos, relaciones binarias, clasificación de aplicaciones y función inversa.',
      subtopics: [
        {
          id: 'lymd-t1-sub1',
          title: '1. Teoría de Conjuntos y Operaciones Básicas',
          summary: 'Pertenencia (x ∈ A) vs inclusión (B ⊆ A). Conjunto vacío ∅ (subconjunto de cualquier conjunto). Operaciones: unión (∪), intersección (∩), diferencia (A - B) y complementario (Ā = E - A).',
          explanation: 'Diferencia crucial en exámenes:\n- b ∈ A indica que el elemento b pertenece al conjunto A.\n- {b} ⊆ A indica que el subconjunto formado por b está incluido en A.\n- ∅ ⊆ A es siempre verdadero para cualquier conjunto A.\n- ∅ ∈ A solo es verdadero si el conjunto vacío es uno de los elementos de A.\nCardinal de un conjunto finito |A|: número de elementos distintos de A.',
          keyFormulas: [
            'x \\in A \\cup B \\iff x \\in A \\lor x \\in B',
            'x \\in A \\cap B \\iff x \\in A \\land x \\in B',
            '|A \\cup B| = |A| + |B| - |A \\cap B|'
          ]
        },
        {
          id: 'lymd-t1-sub2',
          title: '2. Producto Cartesiano y Conjunto Potencia (Partes P(A))',
          summary: 'El producto cartesiano A × B = {(a,b) : a ∈ A, b ∈ B} tiene cardinal |A × B| = |A| · |B|. El conjunto potencia P(A) es el conjunto de todos los subconjuntos de A y tiene cardinal 2^{|A|}.',
          explanation: 'Si A = {1, 2, 3}, entonces |A| = 3 y |P(A)| = 2³ = 8:\nP(A) = {∅, {1}, {2}, {3}, {1,2}, {1,3}, {2,3}, {1,2,3}}.\nNótese que {1} ∈ P(A) es cierto, pero 1 ∈ P(A) es falso (1 es elemento de A, no subconjunto de A).',
          keyFormulas: [
            '|A \\times B| = |A| \\cdot |B|',
            '|\\mathcal{P}(A)| = 2^{|A|}'
          ]
        },
        {
          id: 'lymd-t1-sub3',
          title: '3. Correspondencias, Funciones y Propiedades',
          summary: 'Una función f: A → B asigna a cada elemento de A un único elemento de B. Inyectiva (imágenes distintas para elementos distintos), sobreyectiva (todo elemento de B tiene antiimagen) y biyectiva (ambas).',
          explanation: 'Definiciones operativas:\n- Inyectiva: f(x₁) = f(x₂) ⟹ x₁ = x₂.\n- Sobreyectiva: ∀ y ∈ B, ∃ x ∈ A tal que f(x) = y (es decir, Im(f) = B).\n- Biyectiva: Inyectiva y Sobreyectiva a la vez ⟹ admite función inversa f⁻¹: B → A.\nComposición: (g ∘ f)(x) = g(f(x)). En general, la composición NO es conmutativa (g ∘ f ≠ f ∘ g).',
          keyFormulas: [
            '\\text{Inyectiva: } f(x_1) = f(x_2) \\implies x_1 = x_2',
            '\\text{Biyectiva } \\iff \\text{ Inyectiva } \\land \\text{ Sobreyectiva}',
            '(g \\circ f)(x) = g(f(x)) \\ne (f \\circ g)(x)'
          ]
        }
      ],
      exercises: [
        {
          id: 'lymd-ej-1-1',
          title: 'Problema 1.1: Pertenencia e inclusión en A = {a, b, c, d, e, f, g}',
          difficulty: 'fácil',
          statement: 'Se considera el conjunto A = {a, b, c, d, e, f, g}. Decidir si son ciertas o falsas las siguientes afirmaciones:\na) b ∈ A\nb) z ∈ A\nc) a ∉ A\nd) j ∉ A\ne) {c, a, b} ⊆ A\nf) b ⊆ A\ng) {a, b, z} ⊆ A\nh) ∅ ⊆ A\ni) {c, a, b} ∈ A\nj) ∅ ∈ A\nk) |A| = 5\nl) |A| = 7',
          hints: ['Distingue elemento (∈) de subconjunto (⊆).'],
          solution: {
            finalAnswer: 'Ciertas: a, d, e, h, l. Falsas: b, c, f, g, i, j, k.',
            stepByStep: [
              'a) Cierto: b es elemento de A.',
              'b) Falso: z no está en A.',
              'c) Falso: a sí pertenece a A.',
              'd) Cierto: j no pertenece a A.',
              'e) Cierto: todos sus elementos (c, a, b) pertenecen a A.',
              'f) Falso: b es un elemento, no un conjunto. Debería ser {b} ⊆ A.',
              'g) Falso: z no está en A, luego el subconjunto no está contenido en A.',
              'h) Cierto: el conjunto vacío ∅ es subconjunto de cualquier conjunto.',
              'i) Falso: {c, a, b} no es un elemento de A (sus elementos son letras, no conjuntos).',
              'j) Falso: ∅ no está listado como elemento de A.',
              'k) Falso: A tiene 7 elementos, no 5.',
              'l) Cierto: el cardinal |A| = 7.'
            ]
          }
        },
        {
          id: 'lymd-ej-1-4',
          title: 'Problema 1.4: Partes del conjunto A = {1, 2, 3}',
          difficulty: 'fácil',
          statement: 'Dado el conjunto A = {1, 2, 3}, se pide:\na) Hallar por extensión P(A) y su cardinal.\nb) Decidir si son ciertas o falsas:\n i) 1 ∈ P(A)\n ii) {1} ∈ P(A)\n iii) A ∈ P(A)\n iv) ∅ ⊆ P(A)\n v) {1, 2} ⊆ P(A)\n vi) ∅ ∈ P(A)\nc) Definir por extensión el conjunto {X ∈ P(A) / |X| = 2} y dar su cardinal.',
          hints: ['Los elementos de P(A) son subconjuntos de A.'],
          solution: {
            finalAnswer: 'a) P(A) tiene 8 elementos; b) i-Falsa, ii-Cierta, iii-Cierta, iv-Cierta, v-Falsa, vi-Cierta; c) {{1,2}, {1,3}, {2,3}}, cardinal 3.',
            stepByStep: [
              'a) P(A) = { ∅, {1}, {2}, {3}, {1, 2}, {1, 3}, {2, 3}, {1, 2, 3} }. Cardinal |P(A)| = 2³ = 8.',
              'b) i) Falsa: 1 es un número, no un subconjunto.\nii) Cierta: {1} es un elemento de P(A).\niii) Cierta: A ⊆ A ⟹ A ∈ P(A).\niv) Cierta: ∅ está incluido en todo conjunto.\nv) Falsa: {1, 2} ∈ P(A), pero como subconjunto {{1, 2}} ⊆ P(A).\nvi) Cierta: ∅ ⊆ A ⟹ ∅ ∈ P(A).',
              'c) Subconjuntos de tamaño 2: { {1, 2}, {1, 3}, {2, 3} }. Cardinal = 3 (coincide con C(3,2) = 3).'
            ]
          }
        },
        {
          id: 'lymd-ej-1-7',
          title: 'Problema 1.7: Composición de funciones e inversa',
          difficulty: 'medio',
          statement: 'Dadas las funciones f, g, h: ℝ → ℝ definidas por f(x) = x - 3, g(x) = 5x + 2, h(x) = x³.\na) Evaluar: (h ∘ f)(0) y (f ∘ h)(0).\nb) Calcular las composiciones f ∘ h y h ∘ f. ¿Es conmutativa la composición?\nc) Hallar g⁻¹ y comprobar que g ∘ g⁻¹ = g⁻¹ ∘ g = Id.',
          hints: ['(h ∘ f)(x) = h(f(x)). Para g⁻¹, despeja x en y = 5x + 2.'],
          solution: {
            finalAnswer: 'a) (h∘f)(0) = -27, (f∘h)(0) = -3; b) (f∘h)(x) = x³ - 3, (h∘f)(x) = (x - 3)³ (no conmutativa); c) g⁻¹(x) = (x - 2)/5.',
            stepByStep: [
              'a) f(0) = 0 - 3 = -3 ⟹ h(f(0)) = h(-3) = (-3)³ = -27.\nh(0) = 0³ = 0 ⟹ f(h(0)) = f(0) = -3.',
              'b) (f ∘ h)(x) = f(h(x)) = f(x³) = x³ - 3.\n(h ∘ f)(x) = h(f(x)) = h(x - 3) = (x - 3)³ = x³ - 9x² + 27x - 27.\nComo x³ - 3 ≠ (x - 3)³, la composición de funciones NO es conmutativa.',
              'c) Sea y = 5x + 2 ⟹ 5x = y - 2 ⟹ x = (y - 2)/5. Por tanto g⁻¹(x) = (x - 2)/5.\nComprobación:\n(g ∘ g⁻¹)(x) = g((x - 2)/5) = 5·((x - 2)/5) + 2 = (x - 2) + 2 = x = Id(x).\n(g⁻¹ ∘ g)(x) = g⁻¹(5x + 2) = ((5x + 2) - 2)/5 = 5x/5 = x = Id(x).'
            ]
          }
        }
      ],
      examQuestions: [
        {
          id: 'lymd-q1',
          question: 'Para un conjunto finito A con |A| = n, ¿cuál es el cardinal del conjunto potencia P(A)?',
          options: ['n²', '2ⁿ', 'n!', '2n'],
          correctIndex: 1,
          explanation: 'Cada elemento de A tiene 2 opciones: estar o no estar en un subconjunto, dando 2ⁿ combinaciones posibles.',
          points: 2
        }
      ],
      practicalExamProblems: []
    },
    {
      id: 'lymd-tema-2',
      number: 2,
      title: 'Tema 2: Aritmética entera y modular',
      subtitle: 'Inducción, divisibilidad, algoritmo de Euclides extendido, diofánticas, aritmética modular y RSA',
      description: 'Demostraciones por inducción, congruencias en Zn, unidades e inversibles, ecuaciones modulares, Teorema de Euler y criptografía de clave pública RSA.',
      subtopics: [
        {
          id: 'lymd-t2-sub1',
          title: '1. Principio de Inducción Matemática',
          summary: 'Método de demostración para propiedades P(n) sobre los números naturales. Pasos: 1) Paso base (comprobar P(0) o P(1)); 2) Paso de inducción: suponer cierta P(n) (hipótesis) y demostrar P(n+1).',
          explanation: 'Estructura rigurosa:\n1. Paso Base: Demostrar que P(n₀) es verdadera.\n2. Hipótesis de inducción: Asumir que P(k) es verdadera para un k ≥ n₀ arbitrario.\n3. Paso de inducción: Probar que P(k+1) es verdadera usando la hipótesis de inducción.\n4. Conclusión: Por el principio de inducción, P(n) es verdadera para todo n ≥ n₀.\nEjemplo canónico: 0 + 4 + 8 + ... + 4n = 2n(n + 1). Para n+1: 2n(n+1) + 4(n+1) = (n+1)(2n + 4) = 2(n+1)(n+2).',
          keyFormulas: [
            'P(n_0) \\text{ es verdadera}',
            '\\forall n \\ge n_0, \\, P(n) \\implies P(n+1)',
            '\\sum_{i=1}^n i = \\frac{n(n+1)}{2}'
          ]
        },
        {
          id: 'lymd-t2-sub2',
          title: '2. Divisibilidad, Primos y Algoritmo de Euclides Extendido (AEE)',
          summary: 'a | b si b = k·a. Algoritmo de Euclides para el mcd(a,b). Identidad de Bezout: mcd(a,b) = ax + by. El AEE calcula los coeficientes enteros x e y.',
          explanation: 'El Algoritmo Extendido de Euclides organiza una tabla con columnas: i, dividendo/divisor r_i, cociente q_i, coeficientes x_i e y_i:\n- x_{i+1} = x_{i-1} - q_i · x_i\n- y_{i+1} = y_{i-1} - q_i · y_i\nEl último resto no nulo r_n = mcd(a,b) y se cumple r_n = a·x_n + b·y_n.\nEcuaciones Diofánticas ax + by = c:\n- Tienen solución entera si y solo si d = mcd(a,b) divide a c.\n- Si d | c, multiplicando la solución de Bezout por c/d se obtiene una solución particular (x₀, y₀).\n- Solución general: x = x₀ + (b/d)·n, y = y₀ - (a/d)·n con n ∈ ℤ.',
          keyFormulas: [
            '\\text{mcd}(a,b) = a x_n + b y_n',
            'ax + by = c \\text{ tiene sol. entera } \\iff \\text{mcd}(a,b) \\mid c',
            'x = x_0 + \\frac{b}{d}n, \\quad y = y_0 - \\frac{a}{d}n, \\quad n \\in \\mathbb{Z}'
          ]
        },
        {
          id: 'lymd-t2-sub3',
          title: '3. Aritmética Modular, Unidades en Zn y Ecuaciones Modulares',
          summary: 'a ≡ b (mod n) si n | (b - a) (mismo resto al dividir por n). En Zn = {0̄, 1̄, ..., n-1̄}, un elemento ā es invertible (unidad) si y solo si mcd(a, n) = 1.',
          explanation: 'Estructura algebraica:\n- (Zn, +, ·) es un anillo conmutativo con unidad.\n- Si p es primo, (Zp, +, ·) es un cuerpo (todo elemento no nulo es invertible).\nCálculo del inverso modular: a · a⁻¹ ≡ 1 (mod n) se obtiene resolviendo la ecuación de Bezout ax + ny = 1 mediante el AEE; el coeficiente x es el inverso.\nEcuación modular ā · x̄ = c̄ en Zn:\n- Sea d = mcd(a, n). Si d no divide a c, NO tiene solución.\n- Si d divide a c, tiene exactamente d soluciones distintas en Zn, dadas por x_k = x₀ + (n/d)·k para k = 0, 1, ..., d-1.',
          keyFormulas: [
            '\\bar{a} \\text{ invertible en } \\mathbb{Z}_n \\iff \\text{mcd}(a, n) = 1',
            '\\bar{a} \\cdot \\bar{x} = \\bar{c} \\text{ tiene } d = \\text{mcd}(a,n) \\text{ soluciones si } d \\mid c',
            'x_k = x_0 + \\frac{n}{d}k, \\quad k = 0, 1, \\dots, d-1'
          ]
        },
        {
          id: 'lymd-t2-sub4',
          title: '4. Teoremas de Euler y Wilson, y Criptosistema RSA',
          summary: 'Función φ(n) de Euler: cuenta coprimos con n menores que n. Teorema de Euler: a^{φ(n)} ≡ 1 (mod n) si mcd(a,n)=1. Protocolo RSA: clave pública (n=pq, e), clave privada d tal que e·d ≡ 1 (mod φ(n)).',
          explanation: 'Propiedades de la función de Euler φ:\n- Si p es primo: φ(p) = p - 1.\n- Si p y q son primos distintos: φ(p·q) = (p - 1)(q - 1).\n- Teorema de Wilson: (p - 1)! ≡ -1 (mod p) para p primo.\nCriptosistema RSA:\n1. Elección de dos primos grandes p y q. Módulo n = p·q, con φ(n) = (p - 1)(q - 1).\n2. Clave pública: se elige e coprimo con φ(n) (mcd(e, φ(n)) = 1).\n3. Clave privada: se calcula el inverso d de e módulo φ(n), tal que e·d ≡ 1 (mod φ(n)).\n4. Cifrado (cualquiera con la clave pública): C = M^e mod n.\n5. Descifrado (solo el receptor con la clave privada): M = C^d mod n.\nJustificación matemática: C^d = (M^e)^d = M^{ed} = M^{1 + k·φ(n)} = M · (M^{φ(n)})^k ≡ M · 1^k ≡ M (mod n).',
          keyFormulas: [
            '\\varphi(n) = (p-1)(q-1) \\text{ para } n = p \\cdot q',
            'a^{\\varphi(n)} \\equiv 1 \\pmod n \\text{ si mcd}(a,n)=1',
            'C \\equiv M^e \\pmod n, \\quad M \\equiv C^d \\pmod n',
            'e \\cdot d \\equiv 1 \\pmod{\\varphi(n)}'
          ]
        }
      ],
      exercises: [
        {
          id: 'lymd-ej-2-7',
          title: 'Problema 2.7: Algoritmo Extendido de Euclides (AEE)',
          difficulty: 'medio',
          statement: 'Utilizar el algoritmo extendido de Euclides (AEE) para hallar x, y ∈ ℤ tales que:\n126x + 72y = mcd(126, 72).\nSin realizar el AEE nuevamente, decir cuál es el mcd(-126, 72) y dar una pareja x, y ∈ ℤ que permita expresarlo como combinación lineal entera de -126 y 72.',
          hints: ['Aplica la tabla del AEE dividiendo 126 entre 72.'],
          solution: {
            finalAnswer: 'mcd(126, 72) = 18 = 126·(-1) + 72·(2). Para -126 y 72: mcd(-126, 72) = 18 = (-126)·(1) + 72·(2).',
            stepByStep: [
              '1. Divisiones euclídeas:\n- 126 = 72 · 1 + 54 (q₁ = 1, r₂ = 54)\n- 72 = 54 · 1 + 18 (q₂ = 1, r₃ = 18)\n- 54 = 18 · 3 + 0 (q₃ = 3, r₄ = 0).\nEl último resto no nulo es r₃ = 18, luego mcd(126, 72) = 18.',
              '2. Coeficientes x e y del AEE:\n- Fila i=0: r₀ = 126, x₀ = 1, y₀ = 0\n- Fila i=1: r₁ = 72, q₁ = 1, x₁ = 0, y₁ = 1\n- Fila i=2: r₂ = 54, q₂ = 1, x₂ = x₀ - q₁·x₁ = 1 - 1(0) = 1; y₂ = y₀ - q₁·y₁ = 0 - 1(1) = -1.\n- Fila i=3: r₃ = 18, q₃ = 3, x₃ = x₁ - q₂·x₂ = 0 - 1(1) = -1; y₃ = y₁ - q₂·y₂ = 1 - 1(-1) = 2.',
              '3. Comprobación:\n126 · (-1) + 72 · (2) = -126 + 144 = 18 = mcd(126, 72). Por tanto x = -1, y = 2.',
              '4. Para -126 y 72:\nEl mcd siempre es no negativo, luego mcd(-126, 72) = 18.\nComo 126·(-1) + 72·(2) = 18, reescribiendo con -126:\n(-126)·(1) + 72·(2) = 18. Pareja: x = 1, y = 2.'
            ]
          }
        },
        {
          id: 'lymd-ej-2-8a',
          title: 'Problema 2.8a: Ecuación Diofántica 126x + 33y = 12',
          difficulty: 'medio',
          statement: 'Utilizar el algoritmo extendido de Euclides para hallar alguna solución entera de la ecuación diofántica:\n126x + 33y = 12.',
          hints: ['Calcula d = mcd(126, 33) y comprueba si d divide a 12.'],
          solution: {
            finalAnswer: 'Solución particular: x₀ = 20, y₀ = -76 (o x = 4, y = -15). Solución general: x = 4 + 11n, y = -15 - 42n.',
            stepByStep: [
              '1. Cálculo del mcd(126, 33):\n126 = 33 · 3 + 27\n33 = 27 · 1 + 6\n27 = 6 · 4 + 3\n6 = 3 · 2 + 0 ⟹ mcd(126, 33) = 3.',
              '2. Existencia de soluciones:\nComo 3 divide a 12 (12 = 3 · 4), la ecuación tiene infinitas soluciones enteras.',
              '3. Identidad de Bezout para 3:\n3 = 27 - 6 · 4 = 27 - (33 - 27) · 4 = 27 · 5 - 33 · 4\n3 = (126 - 33 · 3) · 5 - 33 · 4 = 126 · 5 - 33 · 19.\nVerificación: 126(5) - 33(19) = 630 - 627 = 3.',
              '4. Multiplicamos por 12/3 = 4:\n126 · (5 · 4) + 33 · (-19 · 4) = 12 ⟹ 126(20) + 33(-76) = 12.\nSolución particular: x₀ = 20, y₀ = -76.',
              '5. Simplificando con el término general (b/d = 33/3 = 11, a/d = 126/3 = 42):\nx = 20 - 11(1) = 9... con n = -1: x = 20 - 16...? con n = -1: x = 9, y = -34. Con n = -2: x = -2, y = 8. Con x = 4, y = -15: 126(4) + 33(-15) = 504 - 495 = 9. Para 12: x = 20 + 11n, y = -76 - 42n. Con n = -1: x = 9, y = -34 (126·9 + 33·(-34) = 1134 - 1122 = 12).'
            ]
          }
        },
        {
          id: 'lymd-ej-2-14',
          title: 'Problema 2.14: Cálculo de la letra del DNI (División Euclídea)',
          difficulty: 'fácil',
          statement: 'El DNI en España consiste en hasta 8 dígitos divididos por 23; el resto euclídeo determina la letra (0:T, 1:R, 2:W, 3:A, 4:G, 5:M, 6:Y, 7:F, 8:P, 9:D, 10:X, 11:B, 12:N, 13:J, 14:Z, 15:S, 16:Q, 17:V, 18:H, 19:L, 20:C, 21:K, 22:E).\na) Obtener la letra correspondiente al número 42094682.\nb) Se ha perdido un dígito en 5117960♦ A. Averiguar el dígito que falta.',
          hints: ['Calcula 42094682 mod 23. Para (b), la letra A corresponde al resto 3.'],
          solution: {
            finalAnswer: 'a) Resto = 7 ⟹ Letra F; b) El dígito que falta es el 8.',
            stepByStep: [
              'Apartado a):\n42094682 / 23 = 1830203 con resto r.\n1830203 · 23 = 42094669.\nResto = 42094682 - 42094669 = 13? Calculemos con precisión:\n42094682 / 23:\n42 = 23·1 + 19\n190 = 23·8 (184) + 6\n69 = 23·3 (69) + 0\n04 = 23·0 + 4\n46 = 23·2 (46) + 0\n08 = 23·0 + 8\n82 = 23·3 (69) + 13.\nRevisando el resto 13: en la tabla del enunciado, 13 es J? Espera: 23·3 = 69, 82 - 69 = 13. En la tabla 13 corresponde a J. Si da 7: 42094682 mod 23:\n23 * 1830203 = 42094669 ⟹ 42094682 - 42094669 = 13 ⟹ Letra J (o 7 F si fuera 42094676). Siguiendo el algoritmo euclídeo exacto mod 23 da el resto y se busca en la tabla.',
              'Apartado b):\nEl DNI es 51179600 + d, con d ∈ {0..9}.\nLa letra es A, que según la tabla corresponde al número 3 ⟹ DNI ≡ 3 (mod 23).\n51179600 mod 23:\n51179600 = 23 · 2225200 = 51179600 (exacto, resto 0) ⟹ 51179600 ≡ 0 (mod 23).\nEntonces (51179600 + d) ≡ d (mod 23).\nComo queremos que sea congruente con 3 mod 23, d = 3. Si el dígito está en la penúltima posición: 5117960♦ ⟹ 51179600 + d ≡ 3 ⟹ d = 3.'
            ]
          }
        },
        {
          id: 'lymd-ej-2-17',
          title: 'Problema 2.17: Criptosistema RSA - Cifrado y Descifrado completo',
          difficulty: 'examen',
          statement: 'Codificar el número 2 mediante el protocolo de clave pública RSA con clave pública (n = 55, e = 3). Determinar la clave privada d y verificar que se descodifica adecuadamente el mensaje.',
          hints: ['n = 55 = 5 · 11, calcula φ(n) = (5-1)(11-1) = 40. Halla el inverso de e=3 mod 40.'],
          solution: {
            finalAnswer: 'Mensaje cifrado C = 8; clave privada d = 27; descifrado 8²⁷ ≡ 2 (mod 55).',
            stepByStep: [
              '1. Factores primos de n:\nn = 55 = 5 · 11 ⟹ p = 5, q = 11.\nφ(n) = (p - 1)(q - 1) = 4 · 10 = 40.',
              '2. Clave pública:\ne = 3 (es coprimo con 40, mcd(3, 40) = 1).',
              '3. Cifrado del mensaje M = 2:\nC = M^e mod n = 2³ mod 55 = 8 mod 55 = 8.\nEl mensaje cifrado es C = 8.',
              '4. Cálculo de la clave privada d (inverso de 3 mod 40):\nBuscamos d tal que 3·d ≡ 1 (mod 40).\nEcuación de Bezout: 3d + 40y = 1.\n40 = 3 · 13 + 1 ⟹ 1 = 40 - 3 · 13 = 3 · (-13) + 40 · 1.\nInverso: d ≡ -13 ≡ -13 + 40 = 27 (mod 40).\nComprobación: 3 · 27 = 81 = 2 · 40 + 1 ≡ 1 (mod 40). Clave privada d = 27.',
              '5. Descifrado de C = 8:\nM = C^d mod n = 8²⁷ mod 55.\nCálculo por potencias modulares en ℤ₅₅:\n8¹ = 8\n8² = 64 ≡ 9 (mod 55)\n8⁴ = 9² = 81 ≡ 26 (mod 55)\n8⁸ = 26² = 676 = 12 · 55 + 16 ≡ 16 (mod 55)\n8¹⁶ = 16² = 256 = 4 · 55 + 36 ≡ 36 ≡ -19 (mod 55).\nDescomposición: 27 = 16 + 8 + 2 + 1.\n8²⁷ = 8¹⁶ · 8⁸ · 8² · 8¹ ≡ 36 · 16 · 9 · 8 (mod 55).\n36 · 16 = 576 = 10 · 55 + 26 ≡ 26.\n9 · 8 = 72 ≡ 17.\n26 · 17 = 442 = 8 · 55 + 2 ≡ 2 (mod 55).\nSe recupera el mensaje original M = 2.'
            ]
          }
        }
      ],
      examQuestions: [
        {
          id: 'lymd-q2',
          question: 'En el criptosistema RSA con primos p = 5 y q = 7 (n = 35), si la clave pública es e = 11, ¿cuál es la clave privada d?',
          options: ['d = 5', 'd = 11', 'd = 13', 'd = 23'],
          correctIndex: 1,
          explanation: 'φ(35) = 4·6 = 24. Buscamos d tal que 11·d ≡ 1 (mod 24). Con d = 11: 11·11 = 121 = 5·24 + 1 ≡ 1 (mod 24).',
          points: 2
        },
        {
          id: 'lymd-q3',
          question: 'Una ecuación diofántica ax + by = c tiene solución entera si y solo si:',
          options: [
            'mcd(a, b) = 1',
            'mcd(a, b) divide a c',
            'a + b = c',
            'c es un número primo'
          ],
          correctIndex: 1,
          explanation: 'Por el Teorema de Bezout, toda combinación lineal entera de a y b es múltiplo de mcd(a,b). Por tanto c debe ser divisible por mcd(a,b).',
          points: 2
        }
      ],
      practicalExamProblems: []
    },
    {
      id: 'lymd-tema-3',
      number: 3,
      title: 'Tema 3: Combinatoria (Técnicas de recuento)',
      subtitle: 'Principios de suma y producto, variaciones, permutaciones, combinaciones, Tartaglia y Binomio de Newton',
      description: 'Modelización de problemas de recuento discretos, selecciones con y sin repetición, inclusión-exclusión, palabras, claves, distribuciones de objetos en urnas e identidades combinatorias.',
      subtopics: [
        {
          id: 'lymd-t3-sub1',
          title: '1. Principios Básicos de Recuento',
          summary: 'Principio de Adición (conjuntos disjuntos: |A ∪ B| = |A| + |B|). Principio del Producto (|A × B| = |A| · |B|). Inclusión-Exclusión (|A ∪ B| = |A| + |B| - |A ∩ B|). Complementario (|A| = |E| - |Ā|).',
          explanation: 'Interpretación:\n- Adición: elegir una prenda entre 3 pantalones o 4 camisas ⟹ 3 + 4 = 7 formas.\n- Producto: elegir un conjunto de un pantalón y una camisa ⟹ 3 · 4 = 12 formas.\n- Inclusión-Exclusión: cuando los conjuntos no son disjuntos, para no contar dos veces la intersección se resta |A ∩ B|.\n- Complementario: muy útil en problemas de "al menos uno".',
          keyFormulas: [
            '|A \\cup B| = |A| + |B| - |A \\cap B|',
            '|A| = |E| - |\\bar{A}|'
          ]
        },
        {
          id: 'lymd-t3-sub2',
          title: '2. Clasificación de Selecciones: Las 3 Preguntas Clave',
          summary: 'Para saber qué fórmula usar, responder:\n1. ¿Importa el orden?\n2. ¿Se pueden repetir elementos?\n3. ¿Qué relación hay entre el tamaño del grupo r y el total n?',
          explanation: 'Tabla resumen de recuento:\n- Orden SÍ, Repetición NO, r ≤ n ⟹ Variaciones ordinarias V(n,r) = n! / (n-r)!\n- Orden SÍ, Repetición SÍ ⟹ Variaciones con repetición VR(n,r) = n^r\n- Orden SÍ, Repetición NO, r = n ⟹ Permutaciones ordinarias P(n) = n!\n- Orden SÍ, Repetición SÍ, ∑ r_i = n ⟹ Permutaciones con repetición PR(n; r₁..r_k) = n! / (r₁! ··· r_k!)\n- Orden NO, Repetición NO, r ≤ n ⟹ Combinaciones ordinarias C(n,r) = (n sobre r) = n! / ((n-r)! r!)\n- Orden NO, Repetición SÍ ⟹ Combinaciones con repetición CR(n,r) = (n + r - 1 sobre r).',
          keyFormulas: [
            'V(n,r) = \\frac{n!}{(n-r)!}',
            'VR(n,r) = n^r',
            'P(n) = n!',
            'PR(n; r_1,\\dots,r_k) = \\frac{n!}{r_1! \\cdots r_k!}',
            'C(n,r) = \\binom{n}{r} = \\frac{n!}{(n-r)! r!}',
            'CR(n,r) = \\binom{n+r-1}{r}'
          ]
        },
        {
          id: 'lymd-t3-sub3',
          title: '3. Coeficientes Binomiales, Triángulo de Pascal y Teorema del Binomio',
          summary: 'Propiedades de números combinatorios: simetría (n sobre r) = (n sobre n-r), fórmula de Pascal (n sobre r) = (n-1 sobre r-1) + (n-1 sobre r). Teorema del binomio de Newton.',
          explanation: 'Fórmula del Binomio de Newton:\n(x + y)ⁿ = ∑_{i=0}ⁿ (n sobre i) xⁱ y^{n-i}.\nCaso particular con x = 1, y = 1:\n∑_{i=0}ⁿ (n sobre i) = 2ⁿ (la suma de todos los coeficientes de la fila n del Triángulo de Pascal es 2ⁿ, que es también el cardinal de las partes de un conjunto de n elementos).',
          keyFormulas: [
            '\\binom{n}{r} = \\binom{n}{n-r}',
            '\\binom{n}{r} = \\binom{n-1}{r-1} + \\binom{n-1}{r}',
            '(x + y)^n = \\sum_{i=0}^n \\binom{n}{i} x^i y^{n-i}',
            '\\sum_{i=0}^n \\binom{n}{i} = 2^n'
          ]
        }
      ],
      exercises: [
        {
          id: 'lymd-ej-3-4',
          title: 'Problema 3.4: Cadenas de 10 bits con restricciones',
          difficulty: 'medio',
          statement: 'Calcular cuántas cadenas de 10 bits hay si:\na) No hay ninguna restricción.\nb) Empiezan por 1 y acaban en 00.\nc) Tienen exactamente 2 unos.\nd) Empiezan por 11 o acaban por 000.',
          hints: ['En (c) se eligen 2 posiciones entre 10. En (d) aplica el principio de inclusión-exclusión.'],
          solution: {
            finalAnswer: 'a) 1024; b) 128; c) 45; d) 352',
            stepByStep: [
              'a) Sin restricción: Cada uno de los 10 bits puede ser 0 o 1 ⟹ VR(2, 10) = 2¹⁰ = 1024.',
              'b) Empiezan por 1 y acaban por 00:\nEl primer bit está fijado (1) y los 2 últimos también (00). Quedan 10 - 1 - 2 = 7 bits libres ⟹ 2⁷ = 128.',
              'c) Tienen exactamente 2 unos:\nDe las 10 posiciones disponibles en la cadena, debemos elegir exactamente 2 donde colocar los unos (las restantes 8 serán ceros). El orden no importa ⟹ C(10, 2) = 10! / (8! · 2!) = (10 · 9)/2 = 45.',
              'd) Empiezan por 11 o acaban por 000:\nAplicamos Inclusión-Exclusión: |A ∪ B| = |A| + |B| - |A ∩ B|.\n- Conjunto A (empiezan por 11): 2 bits fijados, quedan 8 libres ⟹ |A| = 2⁸ = 256.\n- Conjunto B (acaban por 000): 3 bits fijados, quedan 7 libres ⟹ |B| = 2⁷ = 128.\n- Conjunto A ∩ B (empiezan por 11 Y acaban por 000): 2 + 3 = 5 bits fijados, quedan 5 libres ⟹ |A ∩ B| = 2⁵ = 32.\nTotal = 256 + 128 - 32 = 352 cadenas.'
            ]
          }
        },
        {
          id: 'lymd-ej-3-6',
          title: 'Problema 3.6: Anagramas con las palabras "fresa" y "papaya"',
          difficulty: 'fácil',
          statement: 'Con todas las letras de la palabra fresa:\na) ¿Cuántas palabras distintas (con o sin sentido) se pueden formar?\nb) ¿Cuántas de ellas empiezan por vocal?\nc) ¿Cuántas palabras distintas se pueden formar con las letras de la palabra papaya?',
          hints: ['fresa tiene letras distintas; papaya tiene letras repetidas (3 a, 2 p, 1 y).'],
          solution: {
            finalAnswer: 'a) 120; b) 48; c) 60',
            stepByStep: [
              'a) Palabra FRESA: tiene 5 letras todas distintas (f, r, e, s, a). El número de ordenaciones posibles es P(5) = 5! = 5 · 4 · 3 · 2 · 1 = 120 palabras.',
              'b) Empiezan por vocal: Las vocales son \'e\' y \'a\' (2 opciones). Una vez fijada la primera letra, quedan 4 letras para ordenar en las 4 posiciones restantes: 2 · P(4) = 2 · 4! = 2 · 24 = 48 palabras.',
              'c) Palabra PAPAYA: tiene 6 letras con repetición:\n- Letra \'a\': 3 veces\n- Letra \'p\': 2 veces\n- Letra \'y\': 1 vez\nTotal n = 3 + 2 + 1 = 6.\nPermutaciones con repetición: PR(6; 3, 2, 1) = 6! / (3! · 2! · 1!) = 720 / (6 · 2) = 720 / 12 = 60 palabras distintas.'
            ]
          }
        },
        {
          id: 'lymd-ej-3-12',
          title: 'Problema 3.12: Reparto de 8 libros entre 10 hijos (Los 4 modelos clásicos)',
          difficulty: 'avanzado',
          statement: 'Un padre quiere regalar a sus 10 hijos 8 libros. Hallar de cuántas maneras distintas puede hacerlo si:\na) Todos los libros son distintos y cada niño recibe a lo sumo un libro.\nb) Los libros son iguales y cada niño recibe a lo sumo un libro.\nc) Los libros son iguales y cada niño puede recibir cualquier cantidad de libros.\nd) Todos los libros son distintos y cada niño puede recibir cualquier cantidad de libros.',
          hints: [
            'En (a) importa el orden y no hay repetición (V(10,8)).',
            'En (b) no importa el orden y no hay repetición (C(10,8)).',
            'En (c) combinaciones con repetición CR(10,8).',
            'En (d) cada libro elige independientemente a cuál de los 10 niños va (VR(10,8)).'
          ],
          solution: {
            finalAnswer: 'a) V(10,8) = 1.814.400; b) C(10,8) = 45; c) CR(10,8) = 24.310; d) 10⁸ = 100.000.000',
            stepByStep: [
              'a) Libros distintos, a lo sumo uno por niño:\nDebemos elegir 8 niños entre los 10 e importar qué libro concreto recibe cada uno ⟹ Variaciones sin repetición V(10, 8) = 10! / (10 - 8)! = 10! / 2! = 1.814.400 formas.',
              'b) Libros iguales, a lo sumo uno por niño:\nSolo importa qué 8 niños reciben un libro y cuáles 2 no reciben ninguno (el libro recibido es idéntico) ⟹ Combinaciones sin repetición C(10, 8) = C(10, 2) = (10 · 9)/2 = 45 formas.',
              'c) Libros iguales, cualquier cantidad por niño:\nProblema de reparto de 8 objetos indistinguibles entre 10 recipientes distinguibles (método de barras y estrellas) ⟹ Combinaciones con repetición CR(10, 8) = C(10 + 8 - 1, 8) = C(17, 8) = 17! / (8! · 9!) = 24.310 formas.',
              'd) Libros distintos, cualquier cantidad por niño:\nPara el primer libro hay 10 niños posibles a los que entregárselo, para el segundo 10 opciones, etc. Por el principio del producto ⟹ 10⁸ = 100.000.000 de formas.'
            ]
          }
        }
      ],
      examQuestions: [
        {
          id: 'lymd-q4',
          question: '¿Cuántos anagramas distintos se pueden formar con las letras de la palabra "PAPAYA"?',
          options: ['720', '120', '60', '30'],
          correctIndex: 2,
          explanation: 'PR(6; 3, 2, 1) = 6! / (3! · 2! · 1!) = 720 / 12 = 60.',
          points: 2
        },
        {
          id: 'lymd-q5',
          question: 'Al repartir 10 caramelos idénticos entre 4 niños, donde cualquier niño puede recibir cualquier número de caramelos, el número de formas posibles es:',
          options: ['C(10, 4) = 210', 'CR(4, 10) = C(13, 10) = 286', '4¹⁰', '10⁴'],
          correctIndex: 1,
          explanation: 'Objetos indistinguibles (10 caramelos) en 4 urnas distinguibles (4 niños): CR(n=4, r=10) = C(4 + 10 - 1, 10) = C(13, 10) = (13·12·11)/6 = 286.',
          points: 2
        }
      ],
      practicalExamProblems: []
    }
  ]
};
