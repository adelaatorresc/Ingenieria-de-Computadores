import { Subject } from '../types';

export const fundamentosComputadoresSubject: Subject = {
  id: 'fc',
  name: 'Fundamentos de Computadores',
  shortName: 'FC',
  code: '595000004',
  ects: 6,
  color: 'emerald',
  description: 'Sistemas de numeración, códigos binarios y BCD, álgebra de Boole, simplificación por Karnaugh, puertas lógicas, circuitos MSI (sumadores, multiplexores, decodificadores y comparadores).',
  topics: [
    {
      id: 'fc-tema-1',
      number: 1,
      title: 'Tema 1: Sistemas de numeración. Códigos',
      subtitle: 'Bases 10, 2, 16, 8, conversión entre bases, códigos Gray, BCD y ponderados',
      description: 'Estudio de los sistemas posicionales, teoremas fundamentales, algoritmos de conversión, propiedades de códigos binarios, Gray reflejado y diseño de ponderaciones BCD.',
      subtopics: [
        {
          id: 'fc-t1-sub1',
          title: '1. Del Mundo Analógico al Digital y el Bit',
          summary: 'Las magnitudes físicas son continuas; un computador solo maneja números digitales finitos. Un circuito digital distingue 2 niveles de tensión (TTL: 0V «0» y 5V «1»). Un bit es la unidad mínima.',
          explanation: 'Ventajas de los números:\n- Se copian sin pérdida de calidad (la copia de la copia es idéntica).\n- Un mismo tipo de circuito procesa cualquier tipo de señal.\n- Permite cálculos matemáticos (media, filtrado, alarmas).\nDimensionamiento: con n bits se representan 2ⁿ combinaciones. Para distinguir N casos se necesita el menor n tal que 2ⁿ ≥ N.\nEjemplos de clase:\n- Aforo de 200 personas (201 valores): 2⁷ = 128 no basta; 2⁸ = 256 ≥ 201 ⟹ 8 bits.\n- Estadio de 70 000 espectadores (70 001 valores): 2¹⁶ = 65 536 no basta; 2¹⁷ = 131 072 ⟹ 17 bits.\n- Termómetro de 0 a 50 °C (51 valores): 2⁵ = 32 no basta; 2⁶ = 64 ≥ 51 ⟹ 6 bits.',
          keyFormulas: [
            '2^n \\ge N \\implies n = \\lceil \\log_2 N \\rceil',
            '1 \\text{ byte} = 8 \\text{ bits}',
            'K = 2^{10} = 1024, \\; M = 2^{20} = 1\\,048\\,576, \\; G = 2^{30} = 1\\,073\\,741\\,824'
          ]
        },
        {
          id: 'fc-t1-sub2',
          title: '2. Sistemas de Numeración y Teorema Fundamental',
          summary: 'Sistema posicional caracterizado por su base b y alfabeto Ω. Teorema Fundamental de la Numeración (TFN): N = ∑ n_i · b^i.',
          explanation: 'Bases habituales en computadores:\n- Decimal (b = 10, Ω = {0..9})\n- Binario (b = 2, Ω = {0, 1})\n- Hexadecimal (b = 16, Ω = {0..9, A..F} con A=10, B=11, C=12, D=13, E=14, F=15)\n- Octal (b = 8, Ω = {0..7})\nNotación ETSISI-UPM: la base se escribe tras paréntesis abierto, e.g. 475,375(10 = 111011011,011(2 = 1DB,6(16 = 733,3(8.\nEl TFN evalúa el valor en base 10 sumando cada dígito por el peso de su posición bⁱ.',
          keyFormulas: [
            'N = \\sum_{i=-\\infty}^{+\\infty} n_i \\cdot b^i',
            '1DB,6_{(16} = 1\\cdot 16^2 + 13\\cdot 16^1 + 11\\cdot 16^0 + 6\\cdot 16^{-1} = 475,375_{(10}'
          ]
        },
        {
          id: 'fc-t1-sub3',
          title: '3. Conversión de Base 10 a Base b y Fracciones Periódicas',
          summary: 'La parte entera (PE) se convierte por divisiones sucesivas entre b (leyendo restos del último al primero). La parte fraccionaria (PF) se convierte por multiplicaciones sucesivas por b.',
          explanation: 'Procedimiento:\n- PE: N / b ⟹ cociente y resto. Se repite con los cocientes hasta cociente 0. El último resto es el dígito más significativo (MSB).\n- PF: PF · b ⟹ parte entera es el dígito de orden -1, la nueva fracción se vuelve a multiplicar. Se lee de arriba a abajo.\nFracciones periódicas: si la fracción irreducible en base 10 tiene factores en el denominador distintos de los factores primos de la base b, su representación será periódica.\nEjemplo: 0,1(10 = 1/10 = 1/(2·5). Como el 5 no es factor de 2, 0,1(10 es periódico en binario: 0,0 0011 0011 0011...(2. Con 8 bits fraccionarios se trunca a 0,00011001(2 = 25/256 = 0,09765625(10. Por esto en los ordenadores 0,1 + 0,2 ≠ 0,3.',
          keyFormulas: [
            '\\text{PE: divisiones sucesivas (restos de abajo a arriba)}',
            '\\text{PF: multiplicaciones sucesivas (partes enteras de arriba a abajo)}'
          ]
        },
        {
          id: 'fc-t1-sub4',
          title: '4. Transformación Directa entre Bases Potencias de 2 (2 ↔ 16 y 2 ↔ 8)',
          summary: 'Como 16 = 2⁴ y 8 = 2³, 4 bits equivalen exactamente a 1 dígito hexadecimal, y 3 bits a 1 dígito octal. Se agrupa desde la coma hacia afuera.',
          explanation: 'Regla de agrupación:\n- De binario a hexadecimal: grupos de 4 bits a la izquierda y derecha de la coma. Rellenar con ceros en los extremos (a la izquierda de la PE y a la derecha de la PF), NUNCA junto a la coma.\n- De hexadecimal a binario: sustituir cada dígito hexadecimal por sus 4 bits exactos.\n- Entre hexadecimal y octal no hay atajo directo: se pasa por binario (16 ↔ 2 ↔ 8).',
          keyFormulas: [
            '16 = 2^4 \\implies 1 \\text{ dígito hex} \\equiv 4 \\text{ bits}',
            '8 = 2^3 \\implies 1 \\text{ dígito octal} \\equiv 3 \\text{ bits}'
          ]
        },
        {
          id: 'fc-t1-sub5',
          title: '5. Códigos Continuos, Cíclicos y Código Gray',
          summary: 'Dos combinaciones son adyacentes si difieren en un solo bit (distancia de Hamming = 1). Un código es continuo si cada combinación es adyacente a la siguiente, y cíclico si la última es adyacente a la primera.',
          explanation: '¿Por qué no usar binario natural para sensores mecánicos?\nEn binario natural, al pasar de 01 a 10 o de 011 a 100 cambian varios bits a la vez. En circuitos reales los sensores nunca cambian al instante idéntico; un bit puede cambiar antes que otro produciendo lecturas intermedias espurias y peligrosas (ej. pasar por 000 o 111).\nEn código Gray, solo cambia un bit en cada transición. Aplicaciones: discos codificadores de posición angular en motores, conversores A/D y numeración de filas y columnas en los mapas de Karnaugh.\nConstrucción por reflexión de Gray:\n1. Gray 1 bit: 0, 1.\n2. Para n bits: se escribe el Gray de n-1 bits y debajo su reflejo (espejo en la bisagra).\n3. Se antepone \'0\' a la mitad superior y \'1\' a la mitad inferior.',
          keyFormulas: [
            '\\text{Distancia de Hamming } = \\text{número de bits en que difieren}',
            '\\text{Gray es continuo, cíclico, completo y NO ponderado}'
          ]
        },
        {
          id: 'fc-t1-sub6',
          title: '6. Códigos BCD y Ponderación',
          summary: 'BCD (Binary Coded Decimal) codifica cada dígito decimal (0-9) de forma independiente con al menos 4 bits. Un código es ponderado si a cada bit se le asigna un peso P_i tal que el dígito es la suma de los pesos de sus unos.',
          explanation: 'Comparativa de códigos BCD:\n- BCD Natural (8 4 2 1): Ponderado, coincide con los pesos de las potencias de 2. No es autocomplementario.\n- BCD Aiken (2 4 2 1): Ponderado y autocomplementario. Los dígitos 0-4 son binario natural; 5-9 son su reflejo invirtiendo bits. Permite calcular el complemento a 9 simplemente invirtiendo todos los bits.\n- BCD Exceso 3: Se obtiene sumando 3 al dígito y codificando en binario natural. Es autocomplementario pero NO ponderado (un sistema de ecuaciones llega a una contradicción).\n- BCD 5 4 2 1: Ponderado (utilizado en el contador 7490 conexión biquinaria).\nCómo averiguar pesos de un código BCD_X:\nSe plantea un sistema de ecuaciones lineales: cada combinación da una ecuación igualando la suma de los pesos de los bits a 1 con el valor decimal que representa.',
          keyFormulas: [
            '\\text{Autocomplementario: } C(9 - d) = \\overline{C(d)}',
            '\\text{Ponderado: } d = \\sum_{i=0}^{n-1} b_i \\cdot P_i'
          ]
        }
      ],
      exercises: [
        {
          id: 'fc-ej-1-1',
          title: 'Problema 1.1: Teorema Fundamental de la Numeración',
          difficulty: 'fácil',
          statement: 'Aplicando el teorema fundamental de la numeración, obtener el valor en base 10 de:\na) 1011,101(2\nb) 2F,8(16\nc) 735,4(8\nd) 10,01(2',
          hints: ['Multiplica cada dígito por la base elevada a su orden (positivo hacia la izquierda, negativo hacia la derecha de la coma).'],
          solution: {
            finalAnswer: 'a) 11,625; b) 47,5; c) 477,5; d) 2,25',
            stepByStep: [
              'a) 1011,101(2 = 1·2³ + 0·2² + 1·2¹ + 1·2⁰ + 1·2⁻¹ + 0·2⁻² + 1·2⁻³ = 8 + 0 + 2 + 1 + 0,5 + 0 + 0,125 = 11,625(10.',
              'b) 2F,8(16 = 2·16¹ + F·16⁰ + 8·16⁻¹ = 2·16 + 15·1 + 8/16 = 32 + 15 + 0,5 = 47,5(10.',
              'c) 735,4(8 = 7·8² + 3·8¹ + 5·8⁰ + 4·8⁻¹ = 7·64 + 24 + 5 + 4/8 = 448 + 24 + 5 + 0,5 = 477,5(10.',
              'd) 10,01(2 = 1·2¹ + 0·2⁰ + 0·2⁻¹ + 1·2⁻² = 2 + 0,25 = 2,25(10.'
            ]
          }
        },
        {
          id: 'fc-ej-1-4',
          title: 'Problema 1.4: Fracción periódica en binario',
          difficulty: 'medio',
          statement: 'Convertir 0,1(10 a base 2 con ocho cifras fraccionarias. ¿Es exacta la representación? ¿Qué valor decimal representa exactamente el resultado truncado?',
          hints: ['Multiplica sucesivamente por 2. Observa si se repite algún valor intermedio.'],
          solution: {
            finalAnswer: '0,00011001(2. No es exacta (es periódica: 0,0 0011 0011...). Representa exactamente 0,09765625(10.',
            stepByStep: [
              'Multiplicaciones sucesivas:\n0,1 · 2 = 0,2 ⟹ bit 0\n0,2 · 2 = 0,4 ⟹ bit 0\n0,4 · 2 = 0,8 ⟹ bit 0\n0,8 · 2 = 1,6 ⟹ bit 1 (queda 0,6)\n0,6 · 2 = 1,2 ⟹ bit 1 (queda 0,2)\n0,2 · 2 = 0,4 ⟹ bit 0\n0,4 · 2 = 0,8 ⟹ bit 0\n0,8 · 2 = 1,6 ⟹ bit 1\nResultado con 8 cifras: 0,00011001(2.',
              'No es exacta porque 10 = 2·5 y el factor 5 no es potencia de 2, por lo que entra en un ciclo infinito de periodo 0011.',
              'Valor exacto del truncado:\n2⁻⁴ + 2⁻⁵ + 2⁻⁸ = 1/16 + 1/32 + 1/256 = 16/256 + 8/256 + 1/256 = 25/256 = 0,09765625(10.'
            ]
          }
        },
        {
          id: 'fc-ej-1-11',
          title: 'Problema 1.11: Demostración de que BCD Exceso 3 NO es ponderado',
          difficulty: 'medio',
          statement: 'Demostrar que el código BCD exceso 3 no es ponderado planteando el sistema de ecuaciones con sus pesos P₃, P₂, P₁, P₀.',
          hints: ['Escribe las ecuaciones correspondientes a los dígitos 0, 1, 2 y 3 en exceso 3.'],
          solution: {
            finalAnswer: 'El sistema conduce a la contradicción 0 = 3, por tanto no existen pesos.',
            stepByStep: [
              'En exceso 3, cada dígito d se codifica como el binario de d + 3:\n- Dígito 0: 0011 ⟹ P₁ + P₀ = 0\n- Dígito 1: 0100 ⟹ P₂ = 1\n- Dígito 2: 0101 ⟹ P₂ + P₀ = 2. Como P₂ = 1 ⟹ P₀ = 1. Y de la 1ª ecuación: P₁ = -P₀ = -1.\n- Dígito 3: 0110 ⟹ P₂ + P₁ = 3.',
              'Comprobamos la ecuación del dígito 3 con los pesos hallados:\nP₂ + P₁ = 1 + (-1) = 0 ≠ 3.',
              'Se produce una contradicción insalvable (0 = 3). Por consiguiente, el código BCD exceso 3 NO es ponderado.'
            ]
          }
        },
        {
          id: 'fc-ej-1-17',
          title: 'Problema 1.17: Cuestión Oficial de Parcial (Enero 2023) - Pesos BCD_X',
          difficulty: 'examen',
          statement: 'Para un código BCD_X donde la cantidad 7316(10 se codifica como 1100_0110_0011_0101(BCD_X, podemos afirmar que:\na) Hay cantidades de 5 dígitos que se codificarían de igual forma en cualquier código BCD de 4 bits que tuviese la misma ponderación que BCD_X.\nb) Hay un total de 16 códigos BCD de 4 bits que responden a esta ponderación.\nc) La cantidad 345(10 se puede codificar en BCD_X de 8 formas distintas.\nd) La cantidad 4589(10 se puede codificar en BCD_X de 2 formas distintas.',
          hints: [
            'Primero halla los pesos D C B A del código a partir de los 4 dígitos dados.',
            'Luego haz la tabla de combinaciones para cada dígito del 0 al 9.'
          ],
          solution: {
            finalAnswer: 'Opción a) es la correcta.',
            stepByStep: [
              '1. Planteamiento de ecuaciones con los 4 dígitos:\n7 → 1100: D + C = 7\n3 → 0110: C + B = 3\n1 → 0011: B + A = 1\n6 → 0101: C + A = 6',
              '2. Resolución:\nRestando la 3ª de la 2ª: C - A = 2. Sumando a la 4ª (C + A = 6): 2C = 8 ⟹ C = 4, A = 2.\nDe la 2ª: B = 3 - 4 = -1. De la 1ª: D = 7 - 4 = 3.\nPesos resultantes: 3, 4, -1, 2.',
              '3. Tabla de combinaciones posibles para cada dígito con pesos 3, 4, -1, 2:\n- Dígito 0: 0000 (1 forma)\n- Dígito 1: 0011 (1 forma)\n- Dígito 2: 0001 (peso 2) y 1010 (3 - 1 = 2) (2 formas)\n- Dígito 3: 0110 (4 - 1 = 3) y 1000 (peso 3) (2 formas)\n- Dígito 4: 0100 (4) y 1011 (3 - 1 + 2 = 4) (2 formas)\n- Dígito 5: 0111 (4 - 1 + 2 = 5) y 1001 (3 + 2 = 5) (2 formas)\n- Dígito 6: 0101 (4 + 2 = 6) y 1110 (3 + 4 - 1 = 6) (2 formas)\n- Dígito 7: 1100 (1 forma)\n- Dígito 8: 1111 (1 forma)\n- Dígito 9: 1101 (1 forma)',
              '4. Análisis de las opciones:\n- Total de códigos con esta ponderación: 1·1·2·2·2·2·2·1·1·1 = 2⁵ = 32 códigos (la b es falsa porque dice 16).\n- Dígitos con combinación única: 0, 1, 7, 8 y 9. Cualquier número de 5 cifras formado exclusivamente por estos dígitos (ej. 70891) se codifica de forma idéntica en los 32 códigos posibles. Por tanto la opción a) es CIERTA.\n- En BCD_X, el 3 ya está fijado a 0110 por el enunciado; 4 y 5 tienen 2 formas cada uno ⟹ 345 se codifica de 1·2·2 = 4 formas (la c es falsa porque dice 8).\n- 4589: 4 tiene 2 formas, 5 tiene 2 formas, 8 y 9 son únicos ⟹ 2·2·1·1 = 4 formas (la d es falsa porque dice 2).'
            ]
          }
        }
      ],
      examQuestions: [
        {
          id: 'fc-q1',
          question: '¿Cuántos bits son necesarios como mínimo para representar en binario natural la temperatura de un termómetro que mide enteros entre 0 y 50 °C?',
          options: ['5 bits', '6 bits', '7 bits', '8 bits'],
          correctIndex: 1,
          explanation: 'Hay 51 valores posibles (de 0 a 50 inclusive). Con 5 bits solo llegamos a 2⁵ = 32. Con 6 bits tenemos 2⁶ = 64 ≥ 51, por lo que son necesarios 6 bits.',
          points: 2
        },
        {
          id: 'fc-q2',
          question: '¿Cuál es la razón principal por la que se utiliza el código Gray en encoders o discos codificadores de eje en lugar del binario natural?',
          options: [
            'Porque el código Gray permite realizar sumas y restas más rápido',
            'Porque entre dos posiciones consecutivas solo cambia un único bit, evitando lecturas falsas debidas a desalineación mecánica',
            'Porque es un código ponderado de pesos 8 4 2 1',
            'Porque ocupa menos bits que el binario natural'
          ],
          correctIndex: 1,
          explanation: 'La propiedad de continuidad (distancia de Hamming = 1) garantiza que nunca se lean estados intermedios espurios cuando el eje pasa de un sector al adyacente.',
          points: 2
        },
        {
          id: 'fc-q3',
          question: 'El código BCD Aiken (2421) y el código BCD Exceso 3 comparten la propiedad de ser:',
          options: [
            'Ponderados',
            'Autocomplementarios (la combinación de 9 - d se obtiene invirtiendo todos los bits de d)',
            'Completos',
            'Continuos'
          ],
          correctIndex: 1,
          explanation: 'Ambos son autocomplementarios respecto a 9, lo que simplifica la resta por complemento a 9. Sin embargo, Aiken es ponderado y Exceso 3 NO es ponderado.',
          points: 2
        }
      ],
      practicalExamProblems: []
    },
    {
      id: 'fc-tema-2',
      number: 2,
      title: 'Tema 2: Lógica binaria',
      subtitle: 'Álgebra de Boole, formas canónicas Σ, mapas de Karnaugh, puertas lógicas y circuitos serie 74',
      description: 'Axiomas y teoremas booleanos, minterms, simplificación con mapas de 2, 3 y 4 variables, términos inoperantes X, síntesis en 2 niveles con NAND/NOR y diseño del circuito de votación.',
      subtopics: [
        {
          id: 'fc-t2-sub1',
          title: '1. Variables Lógicas, Álgebra de Boole y Teoremas',
          summary: 'Una variable lógica toma valores en {0, 1}. Operadores: AND (·, serie), OR (+, paralelo), NOT (¯, inversión). Axiomas y teoremas: idempotencia, absorción, absorción parcial y leyes de De Morgan.',
          explanation: 'Axiomas fundamentales:\n- Conmutativa: a + b = b + a; a · b = b · a\n- Neutros: a + 0 = a; a · 1 = a\n- Distributiva: a · (b + c) = a·b + a·c; a + (b · c) = (a + b) · (a + c)\n- Complementario: a + ā = 1; a · ā = 0\nTeoremas cruciales:\n- Absorción: a + a·b = a; a · (a + b) = a\n- Absorción parcial: a + ā·b = a + b; a · (ā + b) = a·b (la variable que aparece negada junto a su afirmada desaparece).\n- Leyes de De Morgan: ~(a + b + ...) = ā · b̄ · ... ; ~(a · b · ...) = ā + b̄ + ...\nRegla de oro: Dos expresiones son equivalentes si y solo si tienen idéntica tabla de verdad.',
          keyFormulas: [
            'a + \\bar{a}b = a + b',
            'a(\\bar{a} + b) = ab',
            '\\overline{a + b} = \\bar{a} \\cdot \\bar{b}',
            '\\overline{a \\cdot b} = \\bar{a} + \\bar{b}'
          ]
        },
        {
          id: 'fc-t2-sub2',
          title: '2. Formas de Representación, Minterms y Forma Canónica Σ',
          summary: 'Toda función lógica puede representarse por: enunciado, tabla de verdad, expresión algebraica, forma canónica numérica Σ, mapa de Karnaugh o circuito de puertas.',
          explanation: 'Un minterm m_i es el producto de todas las variables (afirmada si vale 1, negada si vale 0). Con n variables hay 2ⁿ minterms.\nForma canónica numérica Σ_n(...): enumera los índices de las filas donde la función vale 1.\nEjemplo: en 3 variables F(c, b, a), si vale 1 en las filas 3, 5, 6, 7 ⟹ F = Σ₃(3, 5, 6, 7).\nExpansión algebraica: si a un término le falta una variable, se multiplica por (x + x̄) = 1 hasta obtener minterms completos.',
          keyFormulas: [
            'm_5 \\text{ con } (c,b,a) \\implies c=1, b=0, a=1 \\implies c \\bar{b} a',
            'F = \\sum_n (m_i) = \\Sigma_n(\\text{índices con } 1)'
          ]
        },
        {
          id: 'fc-t2-sub3',
          title: '3. Mapas de Karnaugh de 2, 3 y 4 Variables',
          summary: 'La tabla de verdad plegada en cuadrícula con filas y columnas en orden Gray (00, 01, 11, 10). Las casillas contiguas (incluyendo extremos y esquinas) son adyacentes y eliminan variables.',
          explanation: 'Reglas de simplificación:\n1. Agrupar los \'1\' en rectángulos de tamaño potencia de 2 (16, 8, 4, 2, 1) lo más grandes posible y en el menor número de grupos.\n2. Todo grupo debe contener al menos un \'1\' que no esté cubierto por otro grupo (evitar grupos redundantes).\n3. Las cuatro esquinas (casillas 0, 2, 8, 10 en mapa de 4 variables) forman un grupo de 4 válido que simplifica a c̄·ā.\n4. Cada grupo de 2 elimina 1 variable; de 4 elimina 2 variables; de 8 elimina 3 variables.',
          keyFormulas: [
            '\\text{Esquinas (0, 2, 8, 10)} = \\bar{c} \\cdot \\bar{a}',
            '\\text{Fila completa de 4 en } dc=01 \\implies \\bar{d} \\cdot c'
          ]
        },
        {
          id: 'fc-t2-sub4',
          title: '4. Términos Inoperantes (X) y Funciones Incompletas',
          summary: 'Combinaciones que nunca ocurren (ej. combinaciones 10-15 en BCD) se marcan con X. En el mapa se toman como 1 si ayudan a formar un grupo más grande, o como 0 si no.',
          explanation: 'Regla obligatoria: un grupo no puede estar formado exclusivamente por términos inoperantes X; todo grupo debe incluir al menos un 1 real.\nOperaciones entre funciones incompletas fila a fila:\n- X + 1 = 1, X + 0 = X, X · 0 = 0, X · 1 = X, X̄ = X, X ⊕ anything = X.',
          keyFormulas: [
            'F = \\Sigma_4(0, 1, 4, 5, 9) + \\Sigma_X(2, 3, 6, 7, 10, 11, 12) = \\bar{d} + \\bar{c}a'
          ]
        },
        {
          id: 'fc-t2-sub5',
          title: '5. Puertas Lógicas, Circuitos Serie 74 y Síntesis en Dos Niveles',
          summary: 'Chips comerciales TTL (DIP-14, pin 14 Vcc +5V, pin 7 GND masa). 7400 (NAND), 7402 (NOR), 7404 (NOT), 7408 (AND), 7432 (OR), 7486 (XOR). Conjuntos completos: {NAND} y {NOR}.',
          explanation: 'Síntesis solo con NAND:\n1. Obtener la suma de productos mínima del mapa de Karnaugh.\n2. Aplicar doble negación a toda la función.\n3. Aplicar De Morgan a la barra interior: la suma de productos negada se convierte en producto de términos negados.\n4. Cada término producto negado es una puerta NAND; la puerta de salida que los une es otra NAND.\nSíntesis solo con NOR:\nSe parte del producto de sumas o se aplica De Morgan a los productos para transformarlos en sumas negadas.\nCircuito de votación para 3 personas (Práctica 1):\n- Entradas: V₂, V₁, V₀ (c, b, a).\n- Piloto VOT = 1 si votan a favor 2 o 3 personas ⟹ VOT = Σ₃(3, 5, 6, 7) = c·b + c·a + b·a (función mayoría).\n- Con NAND requiere un 7400 (3 puertas NAND de 2 entradas) y un 7410 (1 puerta NAND de 3 entradas).',
          keyFormulas: [
            'VOT(c,b,a) = cb + ca + ba',
            '\\overline{\\overline{cb + ca + ba}} = \\overline{(\\overline{cb}) \\cdot (\\overline{ca}) \\cdot (\\overline{ba})}'
          ]
        }
      ],
      exercises: [
        {
          id: 'fc-ej-2-6a',
          title: 'Problema 2.6a: Mapa de Karnaugh de 4 variables con esquinas',
          difficulty: 'medio',
          statement: 'Simplifica con un mapa de Karnaugh de cuatro variables la función:\nF(d, c, b, a) = Σ₄(0, 2, 5, 7, 8, 10, 13, 15).',
          hints: ['Observa las casillas en las esquinas y la ventana central.'],
          solution: {
            finalAnswer: 'F = c̄·ā + c·a (función XNOR: c ⊙ a)',
            stepByStep: [
              '1. Colocamos los unos en el mapa de Karnaugh (filas dc: 00, 01, 11, 10; columnas ba: 00, 01, 11, 10):\n- Casillas 0, 2, 8, 10: corresponden a las cuatro esquinas del mapa.\n- Casillas 5, 7, 13, 15: corresponden a un cuadrado de 4 en las filas dc = 01 y 11 con columnas ba = 01 y 11.',
              '2. Lectura del grupo de las esquinas (0, 2, 8, 10):\nEn las cuatro esquinas, c = 0 fijo y a = 0 fijo (d y b toman valores 0 y 1 y se eliminan). Término: c̄·ā.',
              '3. Lectura del cuadrado central (5, 7, 13, 15):\nEn este bloque, c = 1 fijo y a = 1 fijo (d y b se eliminan). Término: c·a.',
              '4. Expresión mínima:\nF = c̄·ā + c·a. Fíjate que esta es la función equivalencia o XNOR entre c y a: F = c ⊙ a.'
            ]
          }
        },
        {
          id: 'fc-ej-2-7b',
          title: 'Problema 2.7b: Diseño de detector BCD con términos inoperantes',
          difficulty: 'examen',
          statement: 'Diseña la función Z(d, c, b, a) que recibe un dígito en BCD natural y vale 1 cuando el dígito es 3, 6 o 9 (los múltiplos de 3 distintos de cero): escribe la forma canónica con inoperantes, simplifica con el mapa y da la expresión mínima.',
          hints: ['En BCD natural, las combinaciones de 10 a 15 no pueden darse y son inoperantes Σ_X(10, 11, 12, 13, 14, 15).'],
          solution: {
            finalAnswer: 'Z = c·b·a + c·b·ā + d·a',
            stepByStep: [
              '1. Forma canónica con inoperantes:\nZ = Σ₄(3, 6, 9) + Σₓ(10, 11, 12, 13, 14, 15).',
              '2. Agrupación en el mapa de Karnaugh:\n- El 1 de la casilla 3 (dcba = 0011) se agrupa con la X de la casilla 11 (dcba = 1011). En esta pareja de 2, d cambia, c = 0, b = 1, a = 1 ⟹ término c̄·b·a.\n- El 1 de la casilla 6 (dcba = 0110) se agrupa con la X de la casilla 14 (dcba = 1110). En esta pareja, d cambia, c = 1, b = 1, a = 0 ⟹ término c·b·ā.\n- El 1 de la casilla 9 (dcba = 1001) se agrupa con las X de las casillas 11, 13 y 15 formando un cuadrado de 4 (filas 10 y 11, columnas 01 y 11). En este cuadrado, d = 1 fijo y a = 1 fijo ⟹ término d·a.',
              '3. Expresión mínima final: Z = c̄·b·a + c·b·ā + d·a (3 términos, 8 literales).'
            ]
          }
        },
        {
          id: 'fc-ej-2-12',
          title: 'Problema 2.12: Síntesis de la función de votación solo con NAND y solo con NOR',
          difficulty: 'examen',
          statement: 'Implementa VOT(c, b, a) = c·b + c·a + b·a usando únicamente puertas NAND de la serie 74. Indica qué integrados necesitas. Repite el proceso para implementarlo solo con puertas NOR.',
          hints: ['Aplica doble negación y De Morgan para NAND. Para NOR, parte del producto de sumas (c+b)(c+a)(b+a).'],
          solution: {
            finalAnswer: 'NAND: 3 puertas de 2 entradas + 1 puerta de 3 entradas (chips 7400 y 7410). NOR: 6 puertas de 2 entradas (dos chips 7402).',
            stepByStep: [
              '1. Síntesis con NAND:\nVOT = cb + ca + ba.\nNegando dos veces: VOT = ~( ~[cb + ca + ba] ).\nAplicando De Morgan a la barra interna:\nVOT = ~( ~(cb) · ~(ca) · ~(ba) ).\nSe requieren:\n- Tres puertas NAND de 2 entradas para generar ~(cb), ~(ca), ~(ba).\n- Una puerta NAND de 3 entradas que recoja las tres salidas.\nIntegrados: 1 chip 7400 (contiene 4 NAND de 2 entradas) y 1 chip 7410 (contiene 3 NAND de 3 entradas). Total: 2 chips.',
              '2. Síntesis con NOR:\nPartimos de la forma dual (producto de sumas): VOT = (c + b)·(c + a)·(b + a).\nNegando dos veces y aplicando De Morgan: VOT = ~( ~(c+b) + ~(c+a) + ~(b+a) ).\nComo no disponemos de NOR de 3 entradas en el laboratorio, la NOR de 3 entradas se realiza con tres NOR de 2 entradas (dos en cascada y un inversor intermedio).\nEn total son seis puertas NOR de 2 entradas ⟹ 2 chips 7402 (cada uno contiene 4 puertas NOR de 2 entradas).'
            ]
          }
        }
      ],
      examQuestions: [
        {
          id: 'fc-q4',
          question: 'Dada la función F(D, C, B, A) = Σ₄(0, 2, 5, 7, 8, 10, 13, 15), ¿cuál es su expresión simplificada mínima?',
          options: [
            'F = C̄·Ā + C·A',
            'F = B̄·Ā + B·A',
            'F = C̄·Ā + D·A',
            'F = C̄·A + C·Ā'
          ],
          correctIndex: 0,
          explanation: 'Los minterms 0, 2, 8, 10 forman las cuatro esquinas (C̄·Ā) y los minterms 5, 7, 13, 15 forman el cuadrado central (C·A).',
          points: 2
        },
        {
          id: 'fc-q5',
          question: '¿Por qué las puertas NAND y NOR NO son asociativas?',
          options: [
            'Porque no tienen elemento neutro',
            'Porque negar el resultado intermedio altera el orden de las operaciones lógicas booleanas (e.g. ~(~(c·b)·a) ≠ ~(c·~(b·a)))',
            'Porque solo admiten dos entradas en cualquier tecnología',
            'Porque son puertas universales'
          ],
          correctIndex: 1,
          explanation: 'La negación en la salida rompe la asociatividad: dos puertas NAND de 2 entradas encadenadas no equivalen a una NAND de 3 entradas.',
          points: 2
        }
      ],
      practicalExamProblems: []
    },
    {
      id: 'fc-tema-3',
      number: 3,
      title: 'Tema 3: Circuitos electrónicos combinacionales (MSI)',
      subtitle: 'Sumador Total, 4ST (7483), multiplexores, codificadores con prioridad y decodificadores canónicos',
      description: 'Bloques de media escala de integración (MSI): sumadores aritméticos, transcodificadores, multiplexores (74151, 74153, 74157), codificadores con salida Group Strobe y comparadores de magnitud GEL (7485).',
      subtopics: [
        {
          id: 'fc-t3-sub1',
          title: '1. Sumador Total (ST) y Cuádruple Sumador (4ST / CI 7483)',
          summary: 'Un Sumador Total (ST) suma 3 bits de igual peso (aᵢ, bᵢ, Cᵢ) y genera una suma Sᵢ (peso 1) y un acarreo Cᵢ₊₁ (peso 2): aᵢ + bᵢ + Cᵢ = 2·Cᵢ₊₁ + Sᵢ.',
          explanation: 'Ecuaciones del ST:\n- Sᵢ = Cᵢ ⊕ bᵢ ⊕ aᵢ (paridad impar, vale 1 si hay 1 o 3 unos).\n- Cᵢ₊₁ = Cᵢ·bᵢ + Cᵢ·aᵢ + bᵢ·aᵢ (mayoría, vale 1 si hay 2 o 3 unos).\nCuádruple Sumador Total (4ST, chip 7483):\nCadena de 4 STs en serie. Las patillas tienen pesos fijos:\n- a₀, b₀, C₀ pesan 1\n- a₁, b₁ pesan 2\n- a₂, b₂ pesan 4\n- a₃, b₃ pesan 8\n- Salidas S₀ (1), S₁ (2), S₂ (4), S₃ (8) y C₄ (16).\nEl 4ST como transcodificador:\nPor descomposición y reordenación de pesos en potencias de 2, cualquier código ponderado se puede convertir a binario/BCD natural conectando las variables a las entradas de peso adecuado.',
          keyFormulas: [
            'S_i = C_i \\oplus b_i \\oplus a_i',
            'C_{i+1} = C_i b_i + C_i a_i + b_i a_i',
            '\\text{Peso total: } A_{(2} + B_{(2} + C_0 = 8(a_3+b_3) + 4(a_2+b_2) + 2(a_1+b_1) + 1(a_0+b_0+C_0)'
          ]
        },
        {
          id: 'fc-t3-sub2',
          title: '2. El ST como Conjunto Completo',
          summary: 'Fijando una de las entradas a constante \'0\' o \'1\', el ST se transforma en cualquier puerta lógica: AND, OR, XOR, XNOR y NOT.',
          explanation: 'Comportamiento con entradas fijas:\n- Si Cᵢ = \'0\': el acarreo Cᵢ₊₁ = bᵢ · aᵢ (puerta AND) y la suma Sᵢ = bᵢ ⊕ aᵢ (puerta XOR).\n- Si Cᵢ = \'1\': el acarreo Cᵢ₊₁ = bᵢ + aᵢ (puerta OR) y la suma Sᵢ = ~(bᵢ ⊕ aᵢ) = bᵢ ⊙ aᵢ (puerta XNOR).\n- Con dos entradas fijas (\'0\' y \'1\'): la suma Sᵢ = āᵢ (inversor NOT).',
          keyFormulas: [
            'C_i = 0 \\implies C_{i+1} = ba, \\; S_i = b \\oplus a',
            'C_i = 1 \\implies C_{i+1} = b + a, \\; S_i = b \\odot a',
            'C_i = 0, \\; b_i = 1 \\implies S_i = \\bar{a}_i'
          ]
        },
        {
          id: 'fc-t3-sub3',
          title: '3. Multiplexores (MXOR): Generación de Funciones y Árboles',
          summary: 'Conecta a la salida Z uno de sus 2ᵐ canales de entrada según el código binario presente en las m entradas de selección S. Integrados: 74151 (8 canales), 74153 (doble 4 canales), 74157 (cuádruple 2 canales).',
          explanation: 'Generación de funciones:\n1. Con n variables y multiplexor de 2ⁿ canales: conectar las variables a las entradas de selección y aplicar \'1\' o \'0\' en los canales según la tabla de verdad.\n2. Con multiplexor de menor tamaño (e.g. función de 3 variables con multiplexor de 4 canales): usar 2 variables para selección (S₁, S₀) y la tercera variable libre (a) se aplica a las entradas de datos como 0, 1, a o ā.\nÁrboles de multiplexores:\nSe analizan de derecha a izquierda: la salida del último multiplexor selecciona entre las salidas de los multiplexores anteriores.',
          keyFormulas: [
            '\\text{MXOR 2 canales: } Z = \\bar{S}_0 D_0 + S_0 D_1',
            '\\text{Con Enable } E: Z = E \\cdot (\\bar{S}_0 D_0 + S_0 D_1)'
          ]
        },
        {
          id: 'fc-t3-sub4',
          title: '4. Codificadores con Prioridad y Decodificadores Canónicos',
          summary: 'Codificador: activa el código binario de la entrada activa con mayor índice y genera Group Strobe (GS=1 si hay alguna activa). Decodificador: generador canónico que activa la salida correspondiente a la combinación de entrada.',
          explanation: 'Decodificadores como generadores canónicos:\n- Salidas activas a nivel alto: la salida Q_i entrega el minterm m_i. Para sintetizar una función, basta unir con una puerta OR las salidas de los minterms deseados.\n- Salidas activas a nivel bajo (con burbuja): la salida Q_i entrega m̄_i. Por De Morgan, unir las salidas con una puerta NAND da la suma de minterms: ~( ∏ m̄_i ) = ∑ m_i.',
          keyFormulas: [
            '\\text{Decodificador nivel alto + OR} = \\sum m_i',
            '\\text{Decodificador nivel bajo + NAND} = \\sum m_i'
          ]
        },
        {
          id: 'fc-t3-sub5',
          title: '5. Comparadores de Magnitud GEL (CI 7485)',
          summary: 'Compara dos números A y B de n bits y activa exactamente una de tres salidas: G (A > B), E (A = B), L (A < B). Dispone de entradas de cascada G₋₁, E₋₁, L₋₁.',
          explanation: 'Ampliación en cascada:\nPara comparar palabras de mayor longitud (ej. 8 bits con dos comparadores de 4 bits), el bloque de los 4 bits más significativos recibe en sus entradas de expansión las salidas del bloque de los bits menos significativos.',
          keyFormulas: [
            'G = g + e \\cdot G_{-1}',
            'E = e \\cdot E_{-1}',
            'L = l + e \\cdot L_{-1}'
          ]
        }
      ],
      exercises: [
        {
          id: 'fc-ej-3-1',
          title: 'Problema 3.1: Examen Extraordinario Junio 2026 - Circuito con ST y OR',
          difficulty: 'examen',
          statement: 'Dado un circuito con un único sumador total (ST) cuyas tres entradas reciben los bits A₀, A₁, A₂, y una puerta OR que reúne sus dos salidas (Cᵢ₊₁ y Sᵢ), ¿cuál de las siguientes afirmaciones es más completa?\na) La salida es 1 cuando el número es mayor que 1.\nb) La salida es 1 cuando la entrada es par.\nc) La salida es 1 cuando la entrada es impar.\nd) La salida es 1 cuando la entrada es mayor que 0.',
          hints: ['Analiza la salida de la puerta OR: F = Cᵢ₊₁ + Sᵢ. ¿Cuándo vale 0?'],
          solution: {
            finalAnswer: 'Opción d) es la correcta: la salida es 1 cuando la entrada es mayor que 0.',
            stepByStep: [
              '1. El ST suma tres bits: A₂ + A₁ + A₀ = 2·Cᵢ₊₁ + Sᵢ.',
              '2. La puerta OR da F = Cᵢ₊₁ + Sᵢ.',
              '3. F solo vale 0 cuando AMBAS salidas son cero a la vez (Cᵢ₊₁ = 0 y Sᵢ = 0), lo cual únicamente ocurre cuando la suma de unos es 0 (A₂A₁A₀ = 000).',
              '4. Para cualquier otra combinación (001, 010, 011, 100, 101, 110, 111), la suma es 1, 2 o 3, por lo que al menos una de las dos salidas del ST vale 1 y la OR da F = 1.',
              '5. Interpretando A₂A₁A₀ como número, F = 1 exactamente cuando el número es distinto de cero, es decir, mayor que 0.'
            ]
          }
        },
        {
          id: 'fc-ej-3-2',
          title: 'Problema 3.2: Examen Noviembre 2024 - Transcodificador con 4ST',
          difficulty: 'examen',
          statement: 'Un cuádruple sumador total (4ST) tiene conectadas las siguientes entradas:\na₃ = 0, a₂ = X₂, a₁ = 0, a₀ = X₃;\nb₃ = 0, b₂ = 0, b₁ = X₁, b₀ = X₀;\nAcarreo de entrada C₀ = X₃ (cable desde X₃ hasta C₀).\nConsiderando que X₃X₂X₁X₀ es un código BCD, ¿de qué transcodificador se trata?\na) de BCD Aiken a BCD Natural\nb) de BCD Exceso 3 a BCD Aiken\nc) de BCD Natural a BCD Exceso 3\nd) de BCD Exceso 3 a BCD Natural',
          hints: ['Calcula el valor numérico decimal que suma el 4ST multiplicando cada patilla por su peso.'],
          solution: {
            finalAnswer: 'Opción a): Transcodificador de BCD Aiken a BCD Natural.',
            stepByStep: [
              '1. Pesos de las entradas del 4ST:\n- a₃ (8), a₂ (4), a₁ (2), a₀ (1)\n- b₃ (8), b₂ (4), b₁ (2), b₀ (1)\n- C₀ (1)',
              '2. Suma calculada por el circuito:\nY = 4·X₂ + 1·X₃ + 2·X₁ + 1·X₀ + 1·X₃\nY = 2·X₃ + 4·X₂ + 2·X₁ + 1·X₀.',
              '3. Interpretación:\nLos bits de entrada X₃, X₂, X₁, X₀ se ponderan con los pesos 2, 4, 2, 1. Esta es exactamente la ponderación del código BCD Aiken (2421).\nComo el 4ST siempre entrega la suma en binario natural, las salidas Y₃Y₂Y₁Y₀ corresponden al código BCD Natural (8421).'
            ]
          }
        },
        {
          id: 'fc-ej-3-6',
          title: 'Problema 3.6: Examen Junio 2026 - Conexión de Multiplexor de 4 canales',
          difficulty: 'examen',
          statement: 'La salida de un multiplexor de 4 canales con selección S₁ = A y S₀ = B debe implementar la función F(A, B, C) = Σ₃(1, 2, 3, 5, 7). ¿Cómo deben conectarse sus entradas de datos D₀, D₁, D₂, D₃?\na) D₀ = 0, D₁ = 1, D₂ = C, D₃ = 1\nb) D₀ = C, D₁ = 1, D₂ = C, D₃ = C̄\nc) D₀ = 0, D₁ = 1, D₂ = C̄, D₃ = 1\nd) D₀ = C, D₁ = 1, D₂ = C, D₃ = C',
          hints: ['Evalúa el valor de F para cada combinación del par AB y mira qué le ocurre a C.'],
          solution: {
            finalAnswer: 'Opción d): D₀ = C, D₁ = 1, D₂ = C, D₃ = C.',
            stepByStep: [
              '1. Los minterms en binario ABC son:\n1 = 001, 2 = 010, 3 = 011, 5 = 101, 7 = 111.\n2. Para cada canal seleccionado por AB:\n- AB = 00: incluye m₀ (ABC=000, F=0) y m₁ (ABC=001, F=1). Vemos que F = C ⟹ D₀ = C.\n- AB = 01: incluye m₂ (010, F=1) y m₃ (011, F=1). F = 1 independiente de C ⟹ D₁ = 1.\n- AB = 10: incluye m₄ (100, F=0) y m₅ (101, F=1). Vemos que F = C ⟹ D₂ = C.\n- AB = 11: incluye m₆ (110, F=0) y m₇ (111, F=1). Vemos que F = C ⟹ D₃ = C.\n3. Por tanto: D₀ = C, D₁ = 1, D₂ = C, D₃ = C (opción d).'
            ]
          }
        },
        {
          id: 'fc-ej-3-11',
          title: 'Problema 3.11: Examen Junio 2026 - Decodificador con salidas activas a nivel bajo',
          difficulty: 'examen',
          statement: 'Un decodificador de 3 a 8 con entradas C (A₂), B (A₁), A (A₀) y salidas en lógica negativa Q₀..Q₇ está conectado a una puerta NAND de 3 entradas que recibe Q₁, Q₃ y Q₅. La salida del circuito es F = ~(Q₁ · Q₃ · Q₅). ¿Cuál es la función resultante?\na) F = C(B̄ + AB)\nb) F = m̄₁ + m̄₃ + m̄₅\nc) F = m₁ + m₃ + m₅\nd) F = A(B + B̄C)',
          hints: ['Recuerda que en un decodificador con salidas activas a nivel bajo, Q_i = m̄_i.'],
          solution: {
            finalAnswer: 'Opción c): F = m₁ + m₃ + m₅.',
            stepByStep: [
              '1. En un decodificador con salidas activas a nivel bajo, cada patilla Qᵢ = m̄ᵢ, por lo que Q̄ᵢ = mᵢ.',
              '2. La puerta NAND realiza la negación del producto: F = ~(Q₁ · Q₃ · Q₅).',
              '3. Aplicando el teorema de De Morgan:\nF = Q̄₁ + Q̄₃ + Q̄₅.',
              '4. Sustituyendo Q̄ᵢ = mᵢ, queda directamente:\nF = m₁ + m₃ + m₅ (opción c).'
            ]
          }
        }
      ],
      examQuestions: [
        {
          id: 'fc-q6',
          question: 'En un sumador total (ST), si conectamos la entrada de acarreo Cᵢ a nivel lógico \'0\', ¿qué funciones se obtienen por las salidas de Acarreo Cᵢ₊₁ y Suma Sᵢ?',
          options: [
            'Cᵢ₊₁ = a + b (OR) y Sᵢ = a · b (AND)',
            'Cᵢ₊₁ = a · b (AND) y Sᵢ = a ⊕ b (XOR)',
            'Cᵢ₊₁ = 0 y Sᵢ = 1',
            'Cᵢ₊₁ = a ⊕ b (XOR) y Sᵢ = a · b (AND)'
          ],
          correctIndex: 1,
          explanation: 'Con Cᵢ = 0: Cᵢ₊₁ = 0·b + 0·a + ba = ba (AND), y Sᵢ = 0 ⊕ b ⊕ a = b ⊕ a (XOR). Corresponde al semisumador.',
          points: 2
        },
        {
          id: 'fc-q7',
          question: 'Para implementar cualquier función lógica mediante un decodificador cuyas salidas son activas a nivel bajo (con burbuja), la puerta de salida necesaria es:',
          options: [
            'Una puerta OR',
            'Una puerta AND',
            'Una puerta NAND',
            'Una puerta XOR'
          ],
          correctIndex: 2,
          explanation: 'Las salidas entregan minterms negados m̄_i. Por De Morgan, ~( ∏ m̄_i ) = ∑ m_i, por lo que una única puerta NAND produce la suma canónica de minterms.',
          points: 2
        }
      ],
      practicalExamProblems: []
    }
  ]
};
