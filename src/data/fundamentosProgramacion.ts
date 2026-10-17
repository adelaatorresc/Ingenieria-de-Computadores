import { Subject } from '../types';

export const fundamentosProgramacionSubject: Subject = {
  id: 'fp',
  name: 'Fundamentos de Programación',
  shortName: 'FP',
  code: '595000002',
  ects: 6,
  color: 'amber',
  description: 'Programación estructurada en lenguaje C: tipos de datos, operadores, estructuras de control (if, switch, for, while), funciones, paso por valor y referencia, recursividad y arrays.',
  topics: [
    {
      id: 'fp-tema-1',
      number: 1,
      title: 'Tema 1: Introducción a la programación en C',
      subtitle: 'Estructura de un programa en C, printf, scanf, variables y trazas de ejecución',
      description: 'Primer contacto con el lenguaje C, compilación, librerías estándar (#include <stdio.h>), entrada y salida básica y análisis de trazas de memoria.',
      subtopics: [
        {
          id: 'fp-t1-sub1',
          title: '1. Estructura de un Programa en C y Función Principal',
          summary: 'Todo programa en C comienza su ejecución en la función int main(). Se incluye <stdio.h> para funciones de entrada/salida y termina con return 0; para indicar éxito.',
          simplifiedExplanation: 'Un programa en C es como una receta de cocina paso a paso: siempre empieza en la cocina principal llamada `main`. Al principio le dices los ingredientes que necesitas (#include) y al final dices `return 0` para avisar al ordenador de que todo ha salido perfecto.',
          explanation: 'Estructura fundamental:\n```c\n#include <stdio.h>\n\nint main() {\n    printf("Hola Mundo\\n");\n    return 0;\n}\n```\n- `#include <stdio.h>`: Directiva de preprocesador que importa la biblioteca estándar de entrada y salida (Standard I/O).\n- `int main()`: Punto de entrada obligatorio de todo ejecutable.\n- `printf()`: Función para imprimir cadenas formateadas por la salida estándar (consola).\n- `\\n`: Carácter de escape de salto de línea.\n- `return 0;`: Devuelve el código de estado 0 al sistema operativo (terminación sin errores).',
          keyFormulas: [
            '#include <stdio.h>',
            'int main() { ... return 0; }',
            'printf("texto\\n");'
          ],
          examTips: [
            'No olvides nunca el punto y coma al final de cada sentencia.',
            'printf lleva comillas dobles, no simples.'
          ]
        },
        {
          id: 'fp-t1-sub2',
          title: '2. Variables y Entrada de Datos con scanf',
          summary: 'Declaración de variables enteras (int) y lectura desde teclado mediante scanf con el especificador de formato %d y el operador de dirección (&).',
          simplifiedExplanation: 'Una variable es una cajita con una etiqueta en la memoria donde guardas un dato. `scanf` es el mensajero que escucha lo que escribes en el teclado y lo mete dentro de la cajita usando su dirección (`&cajita`).',
          explanation: 'Para leer un dato introducido por el usuario:\n```c\nint num;\nprintf("Introduce un número: ");\nscanf("%d", &num);\n```\nEl símbolo `&` pasa la dirección de memoria de la variable para que `scanf` pueda almacenar allí el valor leído.\nOperaciones aritméticas elementales:\n`suma = num1 + num2;`\n`printf("La suma es %d\\n", suma);`',
          keyFormulas: [
            'int nombreVariable;',
            'scanf("%d", &variable);',
            'printf("Resultado: %d\\n", variable);'
          ],
          examTips: [
            'El error más típico en el examen es olvidar el & delante de la variable en scanf. Si lo olvidas, el programa sufrirá un fallo de segmentación (Segmentation fault).'
          ]
        }
      ],
      exercises: [
        {
          id: 'fp-ej-1-1',
          title: 'Actividad 1.1: Hola Mundo y variantes',
          difficulty: 'fácil',
          statement: 'Escribe un programa en C que imprima por pantalla la frase: "Mi primer programa".',
          hints: ['Utiliza printf y la librería <stdio.h>.'],
          solution: {
            finalAnswer: 'Programa básico con printf("Mi primer programa\\n");',
            stepByStep: [
              '1. Incluir la cabecera estándar: #include <stdio.h>',
              '2. Definir int main()',
              '3. Invocar printf("Mi primer programa\\n");',
              '4. Finalizar con return 0;'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    printf("Mi primer programa\\n");\n    return 0;\n}'
          }
        }
      ],
      examQuestions: [
        {
          id: 'fp-q1',
          question: '¿Qué ocurre si se omite el operador & en la llamada a scanf("%d", variable)?',
          options: [
            'Se compila y funciona igual',
            'Fallo de segmentación (Segmentation Fault) en tiempo de ejecución al intentar escribir en una dirección inválida',
            'El compilador convierte la variable a float automáticamente',
            'Imprime un aviso pero devuelve 0'
          ],
          correctIndex: 1,
          explanation: 'scanf necesita la dirección de memoria real de la variable para escribir el valor leído; pasar el valor sin & intenta acceder a una dirección arbitraria.',
          points: 2
        }
      ],
      practicalExamProblems: []
    },
    {
      id: 'fp-tema-2',
      number: 2,
      title: 'Tema 2: Tipos, Expresiones y Entrada/Salida',
      subtitle: 'int, float, double, char, operadores aritméticos, conversiones de tipo (casting) y operadores lógicos',
      description: 'Representación de datos en memoria, aritmética entera vs decimal, código ASCII y cálculo de expresiones con precedencia.',
      subtopics: [
        {
          id: 'fp-t2-sub1',
          title: '1. Tipos de Datos Básicos y Código ASCII',
          summary: 'int (enteros, 4 bytes), float (coma flotante simple, 4 bytes), double (doble precisión, 8 bytes), char (caracteres ASCII, 1 byte). En C, un char es internamente un número entero de 8 bits.',
          simplifiedExplanation: 'En C las letras son números disfrazados: la letra \'A\' es el número 65 y la \'a\' es 97. Como se llevan exactamente 32 de diferencia (\'a\' - \'A\' = 32), pasar de mayúscula a minúscula solo requiere sumar o restar 32.',
          explanation: 'Puntos clave sobre ASCII:\n- Mayúsculas: \'A\' (65) a \'Z\' (90).\n- Minúsculas: \'a\' (97) a \'z\' (122).\n- Relación fundamental: `\'a\' - \'A\' = 32`. Para pasar a minúscula: `c + 32` o `c + \'a\' - \'A\'`. Para pasar a mayúscula: `c - 32`.\n- Dígitos como caracteres: \'0\' (48) a \'9\' (57). Para obtener el valor numérico de un char: `c - \'0\'`.',
          keyFormulas: [
            'char letraMay = letramin + \'A\' - \'a\';',
            'int digito = caracter - \'0\';',
            'cm = metros * 100;'
          ]
        },
        {
          id: 'fp-t2-sub2',
          title: '2. Operadores Aritméticos y División Entera',
          summary: 'Operadores +, -, *, /, %. Si ambos operandos en la división son enteros, el resultado se trunca (división entera). El operador % calcula el resto de la división entera.',
          simplifiedExplanation: 'Si divides dos enteros como 7 entre 2 en C, da 3, ¡no 3.5! Los decimales se caen a la basura a menos que fuerces a uno de los dos a tener decimales escribiendo `(float)7 / 2` o `7.0 / 2`.',
          explanation: 'La expresión `7 / 2` evalúa a `3`. Para obtener decimales, al menos un operando debe ser float o double: `(float)7 / 2` da `3.5`. El operador `%` (módulo) solo es aplicable a tipos enteros.',
          keyFormulas: [
            'int cociente = a / b;',
            'int resto = a % b;',
            'float decimal = (float) a / b;'
          ]
        }
      ],
      exercises: [
        {
          id: 'fp-ej-2-p1',
          title: 'Problema 1 (Tema 2): Metros a centímetros',
          difficulty: 'fácil',
          statement: 'Escribe un programa que pida un número refiriéndose a una longitud en metros, e imprima por pantalla esa longitud en centímetros.',
          hints: ['Multiplica los metros por 100.'],
          solution: {
            finalAnswer: 'cm = metros * 100 con formato %.2f.',
            stepByStep: [
              '1. Declarar variables float metros, cm.',
              '2. Pedir y leer con scanf("%f", &metros).',
              '3. cm = metros * 100;',
              '4. Imprimir con printf("%.2f m equivalen a %.2f cm.\\n", metros, cm);'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    float metros, cm;\n    printf("Introduce una longitud en metros: ");\n    scanf("%f", &metros);\n    cm = metros * 100;\n    printf("%.2f m equivalen a %.2f cm.\\n", metros, cm);\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-2-p2',
          title: 'Problema 2 (Tema 2): Área de un triángulo',
          difficulty: 'fácil',
          statement: 'Escribe un programa que pida la base y la altura de un triángulo e imprima por pantalla el área del triángulo con esa base y esa altura.',
          hints: ['Área = (base * altura) / 2.'],
          solution: {
            finalAnswer: 'sup = (base * altura) / 2;',
            stepByStep: [
              '1. Leer float base, altura;',
              '2. Calcular sup = (base * altura) / 2;',
              '3. Imprimir el área formateada a 2 decimales.'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    float base, altura, sup;\n    printf("Introduce la base del triangulo: ");\n    scanf("%f", &base);\n    printf("Introduce la altura del triangulo: ");\n    scanf("%f", &altura);\n    sup = (base * altura) / 2;\n    printf("El área del triángulo es: %.2f\\n", sup);\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-2-p3',
          title: 'Problema 3 (Tema 2): Letra minúscula a mayúscula',
          difficulty: 'fácil',
          statement: 'Escribe un programa que pida una letra minúscula y escriba la letra que ha introducido el usuario en mayúscula.',
          hints: ['En ASCII: letraMay = letramin + \'A\' - \'a\' (o letramin - 32).'],
          solution: {
            finalAnswer: 'letraMay = letramin + \'A\' - \'a\';',
            stepByStep: [
              '1. Leer char con scanf(" %c", &letramin);',
              '2. Aplicar el desplazamiento ASCII: letraMay = letramin + \'A\' - \'a\';',
              '3. Imprimir con printf("%c\\n", letraMay);'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    char letramin, letraMay;\n    printf("Introduce una letra minuscula: ");\n    scanf(" %c", &letramin);\n    letraMay = letramin + \'A\' - \'a\';\n    printf("La letra en mayuscula es: %c\\n", letraMay);\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-2-p4',
          title: 'Problema 4 (Tema 2): Desglose de segundos en horas, minutos y segundos',
          difficulty: 'medio',
          statement: 'Escribe un programa que pida al usuario una cantidad en segundos, y muestre las horas, minutos y segundos a las que equivale.',
          hints: ['1 hora = 3600 segundos, 1 minuto = 60 segundos. Utiliza división entera (/) y módulo (%).'],
          solution: {
            finalAnswer: 'h = seg_total / 3600; min = (seg_total % 3600) / 60; seg = (seg_total % 3600) % 60;',
            stepByStep: [
              '1. Leer el total de segundos: scanf("%d", &total_seg);',
              '2. Horas enteras: h = total_seg / 3600;',
              '3. Segundos restantes tras extraer horas: resto = total_seg % 3600;',
              '4. Minutos: min = resto / 60;',
              '5. Segundos finales: seg = resto % 60;'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    int total_seg, h, min, seg;\n    printf("Introduce una cantidad de segundos: ");\n    scanf("%d", &total_seg);\n    h = total_seg / 3600;\n    seg = total_seg % 3600;\n    min = seg / 60;\n    seg = seg % 60;\n    printf("%d segundos equivalen a %d horas, %d minutos y %d segundos.\\n", total_seg, h, min, seg);\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-2-p5',
          title: 'Problema 5 (Tema 2): Distancia euclídea entre dos puntos en el plano',
          difficulty: 'medio',
          statement: 'Hacer un programa que lea dos puntos en el plano (cada punto está formado por dos coordenadas reales x, y) y devuelva la distancia entre esos dos puntos.',
          hints: ['Incluye <math.h> para sqrt() y pow(). Distancia = √((x₂ - x₁)² + (y₂ - y₁)²).'],
          solution: {
            finalAnswer: 'distancia = sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));',
            stepByStep: [
              '1. Leer x1, y1 y x2, y2.',
              '2. Aplicar la fórmula euclídea con pow y sqrt.',
              '3. Imprimir el resultado con 2 decimales.'
            ],
            codeSnippet: '#include <stdio.h>\n#include <math.h>\n\nint main() {\n    float x1, y1, x2, y2, distancia;\n    printf("Introduce las coordenadas del primer punto (x1 y1): ");\n    scanf("%f %f", &x1, &y1);\n    printf("Introduce las coordenadas del segundo punto (x2 y2): ");\n    scanf("%f %f", &x2, &y2);\n    distancia = sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));\n    printf("La distancia entre los dos puntos es: %.2f\\n", distancia);\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-2-p6',
          title: 'Problema 6 (Tema 2): Volumen de un cubo',
          difficulty: 'fácil',
          statement: 'Hacer un programa que lea el valor de una arista en un cubo y devuelva el volumen del cubo.',
          hints: ['Volumen = arista * arista * arista.'],
          solution: {
            finalAnswer: 'volumen = arista * arista * arista;',
            stepByStep: [
              '1. Leer float arista.',
              '2. Calcular volumen = arista * arista * arista;',
              '3. Imprimir el volumen con formato %.2f.'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    float arista, volumen;\n    printf("Introduce la longitud de la arista del cubo: ");\n    scanf("%f", &arista);\n    volumen = arista * arista * arista;\n    printf("El volumen del cubo es: %.2f\\n", volumen);\n    return 0;\n}'
          }
        }
      ],
      examQuestions: [
        {
          id: 'fp-q2',
          question: 'En lenguaje C, ¿cuál es el resultado de evaluar la expresión (7 / 2)?',
          options: ['3.5', '3', '4', 'Error de compilación'],
          correctIndex: 1,
          explanation: 'Ambos operandos son enteros, por lo que el compilador trunca los decimales y devuelve 3.',
          points: 2
        }
      ],
      practicalExamProblems: []
    },
    {
      id: 'fp-tema-3',
      number: 3,
      title: 'Tema 3: Control de Flujo',
      subtitle: 'Condicionales if...else, switch...case, bucles for, while y do...while',
      description: 'Estructuras de selección e iteración en C: control de errores (división por cero), bucles anidados, contadores, acumuladores, generación de figuras con caracteres e inversión de números.',
      subtopics: [
        {
          id: 'fp-t3-sub1',
          title: '1. Sentencias Condicionales (if, if...else, switch...case)',
          summary: 'if (condición) sentencia; else sentencia; permite bifurcar la ejecución. switch (variable) case valor: ... break; permite selección múltiple eficiente.',
          simplifiedExplanation: 'Un `if` es una bifurcación en el camino: si el semáforo está en verde avanzas, si no te detienes. `switch` es como un menú de restaurante donde eliges el plato 1, 2 o 3 directamente.',
          explanation: 'Reglas clave:\n- Control de división por cero:\n```c\nif (divisor == 0) {\n    printf("Error: división por cero\\n");\n} else {\n    printf("Resultado: %d\\n", dividendo / divisor);\n}\n```\n- En `switch`, cada caso debe terminar con `break;` para evitar el fall-through.',
          keyFormulas: [
            'if (condición) { ... } else { ... }',
            'switch(exp) { case 1: ... break; default: ... }'
          ]
        },
        {
          id: 'fp-t3-sub2',
          title: '2. Bucles for, while y Bucles Anidados para Figuras',
          summary: 'for para iteraciones con contador, while para condiciones dinámicas, do-while para ejecutar al menos una vez. Los bucles anidados permiten dibujar matrices o patrones de caracteres (filas i, columnas j).',
          simplifiedExplanation: 'Un bucle anidado es como un reloj: por cada vuelta completa del minutero (bucle interno j), la aguja de las horas (bucle externo i) avanza un solo paso. Así se dibujan rectángulos, triángulos y tablas.',
          explanation: 'Para dibujar figuras con caracteres, la variable exterior `i` controla las filas y la interior `j` controla las columnas.\nUn número se invierte extrayendo su última cifra con `% 10` y desplazando con `* 10 + resto`.',
          keyFormulas: [
            'for (int i = 1; i <= filas; i++) { for (int j = 1; j <= cols; j++) { ... } }',
            'inverso = inverso * 10 + (num % 10); num /= 10;'
          ]
        }
      ],
      exercises: [
        {
          id: 'fp-ej-3-p1',
          title: 'Problema 1 (Tema 3): Clasificación de caracteres',
          difficulty: 'fácil',
          statement: 'Escribe un programa que pida un carácter e imprima por pantalla si ese carácter corresponde a un dígito, a una letra minúscula, a una letra mayúscula o bien a otro tipo de carácter.',
          hints: ['Compara rangos: c >= \'0\' && c <= \'9\', c >= \'a\' && c <= \'z\', c >= \'A\' && c <= \'Z\'.'],
          solution: {
            finalAnswer: 'Clasificación con if...else if anidados.',
            stepByStep: [
              '1. Leer el carácter con scanf(" %c", &c).',
              '2. Comprobar si es dígito (\'0\' a \'9\').',
              '3. Comprobar si es minúscula (\'a\' a \'z\' o \'ñ\').',
              '4. Comprobar si es mayúscula (\'A\' a \'Z\' o \'Ñ\').',
              '5. En otro caso, es otro tipo de carácter.'
            ],
            codeSnippet: '#include <stdio.h>\n#include <ctype.h>\n\nint main() {\n    char c;\n    printf("Introduce un carácter: ");\n    scanf(" %c", &c);\n    if (c >= \'0\' && c <= \'9\') {\n        printf("El carácter es un digito.\\n");\n    } else if ((c >= \'a\' && c <= \'z\') || c == \'ñ\') {\n        printf("El carácter es una letra minúscula.\\n");\n    } else if ((c >= \'A\' && c <= \'Z\') || c == \'Ñ\') {\n        printf("El carácter es una letra mayúscula.\\n");\n    } else {\n        printf("El carácter es otro tipo de carácter.\\n");\n    }\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-3-p2',
          title: 'Problema 2 (Tema 3): Comprobar si un número es divisor de otro',
          difficulty: 'fácil',
          statement: 'Escribe un programa que determine si un número entero es divisor de otro número entero.',
          hints: ['num2 es divisor de num1 si num2 != 0 y num1 % num2 == 0.'],
          solution: {
            finalAnswer: 'if (num2 != 0 && num1 % num2 == 0)',
            stepByStep: [
              '1. Leer num1 y num2.',
              '2. Verificar que el divisor no sea 0 para evitar excepción aritmética.',
              '3. Si num1 % num2 == 0, num2 es divisor de num1.'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    int num1, num2;\n    printf("Introduce el primer número: ");\n    scanf("%d", &num1);\n    printf("Introduce el segundo número: ");\n    scanf("%d", &num2);\n    if (num2 != 0 && num1 % num2 == 0) {\n        printf("%d es divisor de %d.\\n", num2, num1);\n    } else {\n        printf("%d NO es divisor de %d.\\n", num2, num1);\n    }\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-3-p3',
          title: 'Problema 3 (Tema 3): Valor absoluto de un número',
          difficulty: 'fácil',
          statement: 'Escribe un programa que lea un número entero e imprima por pantalla su valor absoluto.',
          hints: ['Si num < 0, abs = -num; en caso contrario, abs = num.'],
          solution: {
            finalAnswer: 'abs = (num < 0) ? -num : num;',
            stepByStep: [
              '1. Leer número entero con scanf("%d", &num);',
              '2. Si num < 0 asignar -num, de lo contrario num.',
              '3. Imprimir el resultado.'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    int num, abs;\n    printf("Introduce un numero entero: ");\n    scanf("%d", &num);\n    if (num < 0) {\n        abs = -num;\n    } else {\n        abs = num;\n    }\n    printf("El valor absoluto es: %d\\n", abs);\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-3-p4',
          title: 'Problema 4 (Tema 3): Menor y mayor de dos valores',
          difficulty: 'fácil',
          statement: 'Escribir un programa en C que lea dos valores enteros por teclado, e imprima el menor y el mayor de los valores leídos o si son iguales.',
          hints: ['Usa if (num1 > num2) ... else if (num2 > num1) ... else ...'],
          solution: {
            finalAnswer: 'Comparación binaria de dos enteros.',
            stepByStep: [
              '1. Leer num1 y num2.',
              '2. Si num1 > num2, mayor es num1 y menor num2.',
              '3. Si num2 > num1, mayor es num2 y menor num1.',
              '4. Si no, ambos son iguales.'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    int num1, num2;\n    printf("Introduce el primer número: ");\n    scanf("%d", &num1);\n    printf("Introduce el segundo número: ");\n    scanf("%d", &num2);\n    if (num1 > num2) {\n        printf("El mayor es: %d\\nEl menor es: %d\\n", num1, num2);\n    } else if (num2 > num1) {\n        printf("El mayor es: %d\\nEl menor es: %d\\n", num2, num1);\n    } else {\n        printf("Ambos números son iguales: %d\\n", num1);\n    }\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-3-p5',
          title: 'Problema 5 (Tema 3): Tabla ASCII del 32 al 255',
          difficulty: 'fácil',
          statement: 'Escribir un programa que imprima los caracteres correspondientes a los códigos ASCII del 32 al 255.',
          hints: ['Bucle for desde i = 32 hasta 255 usando printf("Código %d: %c\\n", i, (char)i);'],
          solution: {
            finalAnswer: 'Bucle for (int i = 32; i <= 255; i++).',
            stepByStep: [
              '1. Iniciar bucle en 32 (primer carácter imprimible: espacio).',
              '2. En cada iteración imprimir el entero i y castearlo a (char)i.',
              '3. Incrementar hasta 255.'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    printf("Tabla de caracteres ASCII del 32 al 255:\\n");\n    for (int i = 32; i <= 255; i++) {\n        printf("Código %d: %c\\n", i, (char)i);\n    }\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-3-p6',
          title: 'Problema 6 (Tema 3): Tabla de multiplicar del 1 al 10 con validación',
          difficulty: 'fácil',
          statement: 'Escribir un programa que lea un número (del 1 al 9) e imprima por pantalla la tabla de multiplicar de ese número hasta 10.',
          hints: ['Verifica if (num >= 1 && num <= 9) y ejecuta for (int i = 1; i <= 10; i++).'],
          solution: {
            finalAnswer: 'for (int i = 1; i <= 10; i++) printf("%d x %d = %d\\n", i, num, i * num);',
            stepByStep: [
              '1. Leer num.',
              '2. Comprobar que esté en el rango [1, 9].',
              '3. Bucle del 1 al 10 mostrando multiplicaciones.'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    int num;\n    printf("Introduce un número (1-9): ");\n    scanf("%d", &num);\n    if (num >= 1 && num <= 9) {\n        printf("Tabla de multiplicar del %d:\\n", num);\n        for (int i = 1; i <= 10; i++) {\n            printf("%d x %d = %d\\n", i, num, i * num);\n        }\n    } else {\n        printf("Número fuera del rango permitido.\\n");\n    }\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-3-p7',
          title: 'Problema 7 (Tema 3): Cuadrado hueco de caracteres \'X\'',
          difficulty: 'medio',
          statement: 'Escribir un programa que lea un número positivo e imprima por pantalla un cuadrado hueco de caracteres \'X\' con lado ese número.',
          hints: ['Imprime \'X\' si i == 1 || i == lado || j == 1 || j == lado, de lo contrario espacio \' \'.'],
          solution: {
            finalAnswer: 'Condición de contorno: i==1 || i==lado || j==1 || j==lado',
            stepByStep: [
              '1. Leer int lado;',
              '2. Bucle externo for i = 1 a lado (filas).',
              '3. Bucle interno for j = 1 a lado (columnas).',
              '4. Imprimir \'X\' solo en los 4 bordes.'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    int lado;\n    printf("Introduce el tamaño del lado del cuadrado: ");\n    scanf("%d", &lado);\n    for (int i = 1; i <= lado; i++) {\n        for (int j = 1; j <= lado; j++) {\n            if (i == 1 || i == lado || j == 1 || j == lado) {\n                printf("X");\n            } else {\n                printf(" ");\n            }\n        }\n        printf("\\n");\n    }\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-3-p10',
          title: 'Problema 10 (Tema 3): Triángulo rectángulo relleno de \'X\'',
          difficulty: 'fácil',
          statement: 'Escribir un programa que lea un número positivo e imprima por pantalla un triángulo rectángulo relleno de caracteres \'X\' con altura ese número.',
          hints: ['Bucle interno j desde 1 hasta i.'],
          solution: {
            finalAnswer: 'for (int i = 1; i <= altura; i++) { for (int j = 1; j <= i; j++) printf("X"); }',
            stepByStep: [
              '1. Leer altura.',
              '2. Fila i tiene i caracteres \'X\'.',
              '3. Salto de línea tras cada fila.'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    int altura;\n    printf("Introduce la altura del triángulo: ");\n    scanf("%d", &altura);\n    for (int i = 1; i <= altura; i++) {\n        for (int j = 1; j <= i; j++) {\n            printf("X");\n        }\n        printf("\\n");\n    }\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-3-p12',
          title: 'Problema 12 (Tema 3): Triángulo isósceles relleno de \'X\'',
          difficulty: 'medio',
          statement: 'Escribir un programa que lea un número positivo e imprima por pantalla un triángulo isósceles relleno de caracteres \'X\' con altura ese número.',
          hints: ['En fila i: imprimir (altura - i) espacios y luego (2 * i - 1) caracteres \'X\'.'],
          solution: {
            finalAnswer: 'Espacios: altura - i; Caracteres X: 2 * i - 1.',
            stepByStep: [
              '1. Leer altura.',
              '2. Bucle for i = 1 hasta altura.',
              '3. Primer bucle interior: j desde 1 hasta altura - i para los espacios de centrado.',
              '4. Segundo bucle interior: k desde 1 hasta 2*i - 1 para las \'X\'.',
              '5. Imprimir salto de línea.'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    int altura;\n    printf("Introduce la altura del triángulo isósceles: ");\n    scanf("%d", &altura);\n    for (int i = 1; i <= altura; i++) {\n        for (int j = 1; j <= altura - i; j++) printf(" ");\n        for (int k = 1; k <= 2 * i - 1; k++) printf("X");\n        printf("\\n");\n    }\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-3-p17',
          title: 'Problema 17 (Tema 3): Invertir las cifras de un número',
          difficulty: 'medio',
          statement: 'Hacer un programa que lea por teclado un número y escriba el número inverso (el que resulta de colocar las cifras en orden contrario, ej. 456 -> 654).',
          hints: ['Extrae la última cifra con resto = num % 10 y acumula inverso = inverso * 10 + resto; reduce con num /= 10.'],
          solution: {
            finalAnswer: 'inverso = inverso * 10 + (num % 10); num /= 10;',
            stepByStep: [
              '1. Leer num.',
              '2. Inicializar int inverso = 0.',
              '3. Bucle while (num != 0): resto = num % 10; inverso = inverso * 10 + resto; num /= 10;',
              '4. Imprimir inverso.'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    int num, inverso = 0, resto;\n    printf("Introduce un numero entero: ");\n    scanf("%d", &num);\n    while (num != 0) {\n        resto = num % 10;\n        inverso = inverso * 10 + resto;\n        num /= 10;\n    }\n    printf("El numero inverso es: %d\\n", inverso);\n    return 0;\n}'
          }
        }
      ],
      examQuestions: [
        {
          id: 'fp-q3',
          question: 'En un bucle while (num != 0) que invierte cifras con num /= 10, ¿cuántas iteraciones realiza si num = 456?',
          options: ['2 iteraciones', '3 iteraciones', '4 iteraciones', 'Infinitas'],
          correctIndex: 1,
          explanation: 'Primera iteración num pasa de 456 a 45; segunda pasa a 4; tercera pasa a 0 y el bucle termina (3 iteraciones, una por cada dígito).',
          points: 2
        }
      ],
      practicalExamProblems: []
    },
    {
      id: 'fp-tema-4',
      number: 4,
      title: 'Tema 4: Funciones',
      subtitle: 'Diseño modular, parámetros por valor y referencia, variables locales y recursividad',
      description: 'Modularización del software, paso de parámetros, ámbitos de variables, librerías y recursión con análisis de pila.',
      subtopics: [
        {
          id: 'fp-t4-sub1',
          title: '1. Declaración, Definición e Invocación de Funciones',
          summary: 'Prototipo: tipo_retorno nombre(parámetros); define la interfaz. En C el paso por defecto es por valor (se trabaja con una copia del dato original).',
          simplifiedExplanation: 'Una función es una pequeña máquina especializada a la que le metes ingredientes (parámetros) y te devuelve un plato preparado (retorno). Permite no repetir código una y otra vez.',
          explanation: 'Estructura:\n```c\nchar siguiente_letra(char letra) {\n    if ((letra >= \'a\' && letra < \'z\') || (letra >= \'A\' && letra < \'Z\')) return letra + 1;\n    else if (letra == \'z\') return \'a\';\n    else if (letra == \'Z\') return \'A\';\n    return \'*\';\n}\n```',
          keyFormulas: [
            'tipo_retorno nombre(tipo param1, tipo param2);',
            'return resultado;'
          ]
        },
        {
          id: 'fp-t4-sub2',
          title: '2. Funciones de Clasificación y Aritmética Numérica',
          summary: 'Implementación de funciones booleanas que devuelven 1 (verdadero) o 0 (falso), como es_digito, es_primo y es_perfecto.',
          simplifiedExplanation: 'Como en C antiguo no existía el tipo booleano, las funciones de comprobación devuelven un 1 si la respuesta es Sí, y un 0 si la respuesta es No.',
          explanation: 'Para comprobar si un número es primo, basta buscar divisores hasta la raíz cuadrada del número (`i * i <= num`), reduciendo la complejidad de O(n) a O(√n).',
          keyFormulas: [
            'int es_primo(int num); // 1 si es primo, 0 si no',
            'int es_perfecto(int num); // suma divisores propios == num'
          ]
        }
      ],
      exercises: [
        {
          id: 'fp-ej-4-p1',
          title: 'Problema 1 (Tema 4): Función siguiente_letra',
          difficulty: 'fácil',
          statement: 'Escribe una función que, dada una letra devuelva la siguiente letra en el abecedario. En caso de que el carácter de entrada no sea una letra, devolverá el carácter \'*\'. Para \'z\' debe devolver \'a\', y para \'Z\' debe devolver \'A\'.',
          hints: ['Comprueba rangos \'a\'-\'z\' y \'A\'-\'Z\' y maneja los casos extremos de la z.'],
          solution: {
            finalAnswer: 'char siguiente_letra(char letra)',
            stepByStep: [
              '1. Si es letra entre \'a\' y \'y\' o \'A\' y \'Y\', retornar letra + 1.',
              '2. Si es \'z\', retornar \'a\'.',
              '3. Si es \'Z\', retornar \'A\'.',
              '4. Si no es letra, retornar \'*\'.'
            ],
            codeSnippet: 'char siguiente_letra(char letra) {\n    if ((letra >= \'a\' && letra < \'z\') || (letra >= \'A\' && letra < \'Z\')) {\n        return letra + 1;\n    } else if (letra == \'z\') {\n        return \'a\';\n    } else if (letra == \'Z\') {\n        return \'A\';\n    } else {\n        return \'*\';\n    }\n}'
          }
        },
        {
          id: 'fp-ej-4-p2',
          title: 'Problema 2 (Tema 4): Función mayuscula',
          difficulty: 'fácil',
          statement: 'Escribe una función que, dada una letra, si es minúscula la devuelva en mayúscula, y si es mayúscula la deje igual. En caso de que el carácter de entrada no sea una letra, devolverá el carácter \'*\'.',
          hints: ['En ASCII las minúsculas se convierten restando 32.'],
          solution: {
            finalAnswer: 'letra - 32 para minúsculas, letra para mayúsculas, \'*\' para otros.',
            stepByStep: [
              '1. Si letra >= \'a\' && letra <= \'z\' return letra - 32;',
              '2. Si letra >= \'A\' && letra <= \'Z\' return letra;',
              '3. En otro caso return \'*\';'
            ],
            codeSnippet: 'char mayuscula(char letra) {\n    if (letra >= \'a\' && letra <= \'z\') {\n        return letra - 32;\n    } else if (letra >= \'A\' && letra <= \'Z\') {\n        return letra;\n    } else {\n        return \'*\';\n    }\n}'
          }
        },
        {
          id: 'fp-ej-4-p3',
          title: 'Problema 3 (Tema 4): Función perimetro_circunferencia',
          difficulty: 'fácil',
          statement: 'Escribe una función que, dado el radio de una circunferencia, devuelva su perímetro. En caso de que el radio de entrada sea negativo, devolverá -1.',
          hints: ['Perímetro = 2 * PI * radio.'],
          solution: {
            finalAnswer: '2 * 3.14159 * radio (o -1 si radio < 0)',
            stepByStep: [
              '1. Si radio < 0 return -1;',
              '2. Retornar 2 * 3.14159 * radio;'
            ],
            codeSnippet: 'float perimetro_circunferencia(float radio) {\n    if (radio < 0) {\n        return -1;\n    }\n    return 2 * 3.14159 * radio;\n}'
          }
        },
        {
          id: 'fp-ej-4-p4',
          title: 'Problema 4 (Tema 4): Función es_digito',
          difficulty: 'fácil',
          statement: 'Escribe una función que, dado un carácter, devuelva 1 si ese carácter corresponde a un dígito, y 0 en caso contrario.',
          hints: ['caracter >= \'0\' && caracter <= \'9\'.'],
          solution: {
            finalAnswer: 'int es_digito(char c)',
            stepByStep: [
              '1. Evaluar si caracter está entre \'0\' y \'9\'.',
              '2. Retornar 1 si se cumple, 0 si no.'
            ],
            codeSnippet: 'int es_digito(char caracter) {\n    if (caracter >= \'0\' && caracter <= \'9\') {\n        return 1;\n    } else {\n        return 0;\n    }\n}'
          }
        },
        {
          id: 'fp-ej-4-p5',
          title: 'Problema 5 (Tema 4): Función es_primo optimizada con raíz cuadrada',
          difficulty: 'medio',
          statement: 'Escribe una función que, dado un entero positivo, devuelva 1 si es primo, y 0 si no lo es.',
          hints: ['Bucle while (i * i <= num) buscando divisores con num % i == 0.'],
          solution: {
            finalAnswer: 'int es_primo(int num) con límite i*i <= num.',
            stepByStep: [
              '1. Si num <= 1 retornar 0.',
              '2. Desde i = 2 hasta √num comprobar si num % i == 0.',
              '3. Si ningún número divide a num, retornar 1.'
            ],
            codeSnippet: 'int es_primo(int num) {\n    if (num <= 1) return 0;\n    int i = 2;\n    while (i * i <= num) {\n        if (num % i == 0) return 0;\n        i++;\n    }\n    return 1;\n}'
          }
        },
        {
          id: 'fp-ej-4-p7',
          title: 'Problema 7 (Tema 4): Función es_perfecto',
          difficulty: 'avanzado',
          statement: 'Un número es perfecto si la suma de sus divisores propios positivos, exceptuando él mismo, es igual al número (ej. 6 = 1 + 2 + 3). Escribe una función que devuelva 1 si es perfecto y 0 si no.',
          hints: ['Suma los divisores propios i y num/i mientras i * i <= num.'],
          solution: {
            finalAnswer: 'suma_divisores == num',
            stepByStep: [
              '1. Si num <= 1 return 0.',
              '2. Acumular divisores desde 1.',
              '3. Si suma_divisores == num return 1, si no 0.'
            ],
            codeSnippet: 'int es_perfecto(int num) {\n    if (num <= 1) return 0;\n    int suma_divisores = 1;\n    int i = 2;\n    while (i * i <= num) {\n        if (num % i == 0) {\n            suma_divisores += i;\n            if (i * i != num) suma_divisores += num / i;\n        }\n        i++;\n    }\n    return (suma_divisores == num) ? 1 : 0;\n}'
          }
        }
      ],
      examQuestions: [
        {
          id: 'fp-q4',
          question: 'En C, ¿qué tipo de paso de parámetros se realiza por defecto cuando se pasa una variable simple (int, float, char) a una función?',
          options: [
            'Paso por referencia',
            'Paso por valor (la función recibe una copia independiente)',
            'Paso por nombre',
            'Paso por puntero constante'
          ],
          correctIndex: 1,
          explanation: 'C solo soporta paso por valor de manera nativa; para modificar la variable original se debe pasar explícitamente un puntero con su dirección.',
          points: 2
        }
      ],
      practicalExamProblems: []
    },
    {
      id: 'fp-tema-5',
      number: 5,
      title: 'Tema 5: Arrays (Vectores)',
      subtitle: 'Indexación, paso a funciones, algoritmos de selección y burbuja, eliminación de duplicados, frecuencias y cadenas',
      description: 'Estructuras de datos contiguas homogéneas, paso implícito por referencia de arrays, ordenación por selección y burbuja, eliminación de duplicados y manipulación de strings.',
      subtopics: [
        {
          id: 'fp-t5-sub1',
          title: '1. Concepto de Array, Declaración y Acceso',
          summary: 'Colección homogénea de elementos almacenados en posiciones contiguas de memoria. Declaración: int x[100]; acceso de 0 a tam-1 mediante x[i].',
          simplifiedExplanation: 'Un array es como un clasificador con cajones numerados del 0 al 9. Todos los cajones guardan el mismo tipo de cosa (por ejemplo, enteros) y puedes abrir cualquiera al instante sabiendo su número de cajón.',
          explanation: 'Puntos esenciales:\n- Los arrays en C comienzan en el índice 0 y terminan en tam - 1.\n- Al pasar un array a una función (`void func(int v[], int tam)`), se pasa un puntero al primer elemento (de facto por referencia).\n- No existe comprobación de límites (out of bounds) en tiempo de compilación.',
          keyFormulas: [
            'int miArray[N];',
            'miArray[0] \\implies \\text{primer elemento}',
            'miArray[N-1] \\implies \\text{último elemento}'
          ]
        },
        {
          id: 'fp-t5-sub2',
          title: '2. Algoritmos Clásicos: Burbuja, Rotaciones y Palíndromos',
          summary: 'Burbuja: compara e intercambia pares adyacentes desordenados. Rotación: desplaza elementos preservando el extremo. Palíndromo: compara simétricamente desde los extremos hacia el centro.',
          simplifiedExplanation: 'El método de la burbuja es como dejar que las burbujas de gas suban a la superficie: en cada pasada, el número más pesado se va desplazando hacia el final hasta que todos quedan perfectamente ordenados.',
          explanation: 'Algoritmo de Burbuja:\n```c\nfor (int i = 0; i < tam - 1; i++) {\n    for (int j = 0; j < tam - 1 - i; j++) {\n        if (v[j] > v[j + 1]) {\n            int aux = v[j]; v[j] = v[j + 1]; v[j + 1] = aux;\n        }\n    }\n}\n```\nPalíndromo con cadena de caracteres:\nCompara `cadena[i] == cadena[len - 1 - i]` para i desde 0 hasta len/2.',
          keyFormulas: [
            '\\text{Burbuja: } v[j] > v[j+1] \\implies \\text{swap}',
            '\\text{Palíndromo: } str[i] == str[len - 1 - i]'
          ]
        }
      ],
      exercises: [
        {
          id: 'fp-ej-5-p1-hoja',
          title: 'Ejercicio 1: Suma acumulada de un array',
          difficulty: 'fácil',
          statement: 'Escribe un programa que pida al usuario 10 números enteros, los guarde en un array y luego imprima por consola un nuevo array en el que cada posición contenga la suma acumulada hasta ese índice (ej: si se introduce 2 5 3, el nuevo array será 2 7 10...).',
          hints: ['acumulado[i] = acumulado[i-1] + arr[i].'],
          solution: {
            finalAnswer: 'nuevo[0] = orig[0]; nuevo[i] = nuevo[i-1] + orig[i];',
            stepByStep: [
              '1. Leer 10 enteros en orig[10].',
              '2. Asignar nuevo[0] = orig[0];',
              '3. Para i de 1 a 9: nuevo[i] = nuevo[i-1] + orig[i];',
              '4. Imprimir el nuevo array.'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    int orig[10], acum[10];\n    printf("Introduce 10 enteros: ");\n    for (int i = 0; i < 10; i++) scanf("%d", &orig[i]);\n    acum[0] = orig[0];\n    for (int i = 1; i < 10; i++) acum[i] = acum[i - 1] + orig[i];\n    printf("Array de sumas acumuladas:\\n");\n    for (int i = 0; i < 10; i++) printf("%d ", acum[i]);\n    printf("\\n");\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-5-p2',
          title: 'Ejercicio 2: Rotación de un array una posición a la derecha',
          difficulty: 'medio',
          statement: 'Escribe un programa que lea por consola 10 números en un array y los rote una posición a la derecha (el último elemento pasa al primero). Ejemplo: 1 2 3 ... 10 -> 10 1 2 ... 9.',
          hints: ['Guarda el último elemento en una variable auxiliar y desplaza de derecha a izquierda.'],
          solution: {
            finalAnswer: 'ultimo = arr[9]; for (int i = 9; i > 0; i--) arr[i] = arr[i-1]; arr[0] = ultimo;',
            stepByStep: [
              '1. Guardar el último elemento: ultimo = arr[9];',
              '2. Bucle desde el final hacia el inicio desplazando: arr[i] = arr[i-1];',
              '3. Colocar el último en la posición 0: arr[0] = ultimo;',
              '4. Imprimir el resultado.'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    int a[10];\n    printf("Introduce 10 números: ");\n    for (int i = 0; i < 10; i++) scanf("%d", &a[i]);\n    int ult = a[9];\n    for (int i = 9; i > 0; i--) a[i] = a[i - 1];\n    a[0] = ult;\n    printf("Resultado rotado a la derecha:\\n");\n    for (int i = 0; i < 10; i++) printf("%d ", a[i]);\n    printf("\\n");\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-5-p3',
          title: 'Ejercicio 3: Eliminar duplicados en 3 fases',
          difficulty: 'avanzado',
          statement: 'Escribe un programa que lea 8 números y elimine los duplicados, dejando sólo los valores únicos en el array en tres fases: 1) lectura, 2) filtrado de repetidos, 3) impresión.',
          hints: ['Usa un segundo contador para los elementos únicos insertados.'],
          solution: {
            finalAnswer: 'Filtrado en tres fases con array de valores únicos.',
            stepByStep: [
              '1. Fase 1: Leer los 8 números sin comprobación.',
              '2. Fase 2: Comprobar si cada número ya está en el array de únicos; si no está, añadirlo.',
              '3. Fase 3: Imprimir los elementos únicos resultantes.'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    int a[8], unicos[8], n_unicos = 0;\n    printf("Introduce 8 números: ");\n    for (int i = 0; i < 8; i++) scanf("%d", &a[i]);\n    for (int i = 0; i < 8; i++) {\n        int ya_esta = 0;\n        for (int j = 0; j < n_unicos; j++) {\n            if (a[i] == unicos[j]) ya_esta = 1;\n        }\n        if (!ya_esta) unicos[n_unicos++] = a[i];\n    }\n    printf("Array resultante sin repetidos:\\n");\n    for (int i = 0; i < n_unicos; i++) printf("%d ", unicos[i]);\n    printf("\\n");\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-5-p4-burbuja',
          title: 'Ejercicio 4: Ordenar array con el Método de la Burbuja',
          difficulty: 'medio',
          statement: 'Escribe un programa que pida 6 números enteros y los ordene de menor a mayor usando el método de la burbuja, comparando e intercambiando pares adyacentes.',
          hints: ['Dos bucles for anidados: el externo de 0 a tam-1 y el interno comparando v[j] > v[j+1].'],
          solution: {
            finalAnswer: 'Algoritmo Bubble Sort con intercambio de pares adyacentes.',
            stepByStep: [
              '1. Leer 6 enteros en v[6].',
              '2. for i de 0 a 5: for j de 0 a 4 - i.',
              '3. Si v[j] > v[j+1], intercambiar con variable auxiliar.',
              '4. Imprimir el array ordenado.'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    int v[6];\n    printf("Introduce 6 números: ");\n    for (int i = 0; i < 6; i++) scanf("%d", &v[i]);\n    for (int i = 0; i < 5; i++) {\n        for (int j = 0; j < 5 - i; j++) {\n            if (v[j] > v[j + 1]) {\n                int aux = v[j];\n                v[j] = v[j + 1];\n                v[j + 1] = aux;\n            }\n        }\n    }\n    printf("Array ordenado de menor a mayor:\\n");\n    for (int i = 0; i < 6; i++) printf("%d ", v[i]);\n    printf("\\n");\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-5-p5-frecuencia',
          title: 'Ejercicio 5: Frecuencia de números con funciones leerArray y mostrarFrecuencia',
          difficulty: 'avanzado',
          statement: 'Haz un programa que pida 10 enteros y muestre cuántas veces aparece cada número en el array. Crea una función leerArray encargada de solicitar los datos y otra función mostrarFrecuencia que compruebe y calcule la frecuencia.',
          hints: ['Marca los números ya contados para no repetir la impresión de su frecuencia.'],
          solution: {
            finalAnswer: 'Funciones modularizadas void leerArray(int a[], int n) y void mostrarFrecuencia(int a[], int n).',
            stepByStep: [
              '1. Implementar leerArray con bucle scanf.',
              '2. En mostrarFrecuencia, usar un array booleano visitado[10] para no contar el mismo número dos veces.',
              '3. Por cada número no visitado, contar apariciones e imprimir.'
            ],
            codeSnippet: '#include <stdio.h>\n\nvoid leerArray(int a[], int n) {\n    for (int i = 0; i < n; i++) scanf("%d", &a[i]);\n}\n\nvoid mostrarFrecuencia(int a[], int n) {\n    int visitado[10] = {0};\n    for (int i = 0; i < n; i++) {\n        if (visitado[i]) continue;\n        int count = 1;\n        for (int j = i + 1; j < n; j++) {\n            if (a[i] == a[j]) {\n                visitado[j] = 1;\n                count++;\n            }\n        }\n        printf("Número %d: aparece %d veces\\n", a[i], count);\n    }\n}\n\nint main() {\n    int a[10];\n    printf("Introduce 10 enteros:\\n");\n    leerArray(a, 10);\n    mostrarFrecuencia(a, 10);\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-5-p15-palindromo',
          title: 'Ejercicio 15: Comprobación de Palíndromo con cadena de caracteres',
          difficulty: 'medio',
          statement: 'Escribe un programa que pida al usuario una palabra (como array de caracteres) y luego imprima por consola si esa palabra es un palíndromo (se lee igual de izquierda a derecha que de derecha a izquierda).',
          hints: ['Usa strlen para conocer la longitud y compara palabra[i] con palabra[len - 1 - i].'],
          solution: {
            finalAnswer: 'Comprobación simétrica de caracteres desde los extremos.',
            stepByStep: [
              '1. Leer palabra con scanf("%s", palabra).',
              '2. Calcular len = strlen(palabra).',
              '3. Bucle desde i = 0 hasta len/2: si palabra[i] != palabra[len - 1 - i], no es palíndromo.',
              '4. Si todas coinciden, es palíndromo.'
            ],
            codeSnippet: '#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char str[100];\n    printf("Introduce una palabra: ");\n    scanf("%s", str);\n    int len = strlen(str);\n    int esPal = 1;\n    for (int i = 0; i < len / 2; i++) {\n        if (str[i] != str[len - 1 - i]) {\n            esPal = 0;\n            break;\n        }\n    }\n    if (esPal) printf("La palabra %s ES un palíndromo.\\n", str);\n    else printf("La palabra %s NO es un palíndromo.\\n", str);\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-5-p16-notas',
          title: 'Ejercicio 16: Notas de alumnos (máxima, mínima y promedio en funciones independientes)',
          difficulty: 'medio',
          statement: 'Haz un programa que lea las notas de 6 alumnos (valores tipo float entre 0 y 10), y determine la nota máxima, la mínima y el promedio en funciones independientes.',
          hints: ['float notaMaxima(float n[], int tam), float notaMinima(float n[], int tam), float promedio(float n[], int tam).'],
          solution: {
            finalAnswer: 'Tres funciones modulares para estadística de notas.',
            stepByStep: [
              '1. notaMaxima recorre el array actualizando max si n[i] > max.',
              '2. notaMinima recorre el array actualizando min si n[i] < min.',
              '3. promedio suma todas las notas y divide entre tam.'
            ],
            codeSnippet: '#include <stdio.h>\n\nfloat notaMaxima(float n[], int tam) {\n    float max = n[0];\n    for (int i = 1; i < tam; i++) if (n[i] > max) max = n[i];\n    return max;\n}\n\nfloat notaMinima(float n[], int tam) {\n    float min = n[0];\n    for (int i = 1; i < tam; i++) if (n[i] < min) min = n[i];\n    return min;\n}\n\nfloat promedio(float n[], int tam) {\n    float suma = 0;\n    for (int i = 0; i < tam; i++) suma += n[i];\n    return suma / tam;\n}\n\nint main() {\n    float notas[6];\n    printf("Introduce las 6 notas: ");\n    for (int i = 0; i < 6; i++) scanf("%f", &notas[i]);\n    printf("Nota máxima: %.2f\\n", notaMaxima(notas, 6));\n    printf("Nota mínima: %.2f\\n", notaMinima(notas, 6));\n    printf("Promedio: %.2f\\n", promedio(notas, 6));\n    return 0;\n}'
          }
        }
      ],
      examQuestions: [
        {
          id: 'fp-q5',
          question: 'Al pasar un array unidimensional como parámetro a una función en C:',
          options: [
            'Se copia todo el array elemento por elemento en la memoria de la función',
            'Se pasa la dirección de memoria del primer elemento del array, permitiendo modificar su contenido',
            'Solo se puede acceder en modo de solo lectura',
            'Provoca un error si no se especifica el operador &'
          ],
          correctIndex: 1,
          explanation: 'En C, el identificador de un array decae en un puntero a su primer elemento, pasando la referencia directa.',
          points: 2
        }
      ],
      practicalExamProblems: []
    }
  ]
};
