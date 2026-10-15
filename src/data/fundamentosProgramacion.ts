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
          explanation: 'Estructura fundamental:\n```c\n#include <stdio.h>\n\nint main() {\n    printf("Hola Mundo\\n");\n    return 0;\n}\n```\n- `#include <stdio.h>`: Directiva de preprocesador que importa la biblioteca estándar de entrada y salida (Standard I/O).\n- `int main()`: Punto de entrada obligatorio de todo ejecutable.\n- `printf()`: Función para imprimir cadenas formateadas por la salida estándar (consola).\n- `\\n`: Carácter de escape de salto de línea.\n- `return 0;`: Devuelve el código de estado 0 al sistema operativo (terminación sin errores).',
          keyFormulas: [
            '#include <stdio.h>',
            'int main() { ... return 0; }',
            'printf("texto\\n");'
          ]
        },
        {
          id: 'fp-t1-sub2',
          title: '2. Variables y Entrada de Datos con scanf',
          summary: 'Declaración de variables enteras (int) y lectura desde teclado mediante scanf con el especificador de formato %d y el operador de dirección (&).',
          explanation: 'Para leer un dato introducido por el usuario:\n```c\nint num;\nprintf("Introduce un número: ");\nscanf("%d", &num);\n```\nEl símbolo `&` pasa la dirección de memoria de la variable para que `scanf` pueda almacenar allí el valor leído.\nOperaciones aritméticas elementales:\n`suma = num1 + num2;`\n`printf("La suma es %d\\n", suma);`',
          keyFormulas: [
            'int nombreVariable;',
            'scanf("%d", &variable);',
            'printf("Resultado: %d\\n", variable);'
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
        },
        {
          id: 'fp-ej-1-5',
          title: 'Actividad 1.5: Sucesor de un número',
          difficulty: 'fácil',
          statement: 'Escribe un programa en C que pida por consola un número e imprima el sucesor de ese número.',
          hints: ['Lee con scanf("%d", &num) e imprime num + 1.'],
          solution: {
            finalAnswer: 'Lee el número y muestra num + 1 con printf.',
            stepByStep: [
              '1. Declarar variable entera int num.',
              '2. Pedir el número por pantalla con printf.',
              '3. Leerlo con scanf("%d", &num).',
              '4. Imprimir num + 1.'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    int num;\n    printf("Introduce un número: ");\n    scanf("%d", &num);\n    printf("El sucesor es %d\\n", num + 1);\n    return 0;\n}'
          }
        }
      ],
      examQuestions: [
        {
          id: 'fp-q1',
          question: '¿Por qué es necesario anteponer el símbolo & al nombre de la variable en la llamada a scanf("%d", &num)?',
          options: [
            'Para indicar que es un número entero',
            'Para pasar la dirección de memoria de la variable y permitir que scanf modifique su valor',
            'Para evitar que se produzca un salto de línea',
            'Es un operador estético opcional'
          ],
          correctIndex: 1,
          explanation: 'C pasa los argumentos por valor; para que una función externa modifique una variable local debe recibir un puntero a su dirección de memoria (&).',
          points: 2
        }
      ],
      practicalExamProblems: []
    },
    {
      id: 'fp-tema-2',
      number: 2,
      title: 'Tema 2: Tipos, Variables, Operadores y Expresiones',
      subtitle: 'Tipos simples (int, char, float), operadores aritméticos, asignación, relacionales y lógicos',
      description: 'Sistemas de tipos en C, tamaños en memoria, código ASCII, división entera vs división real (cast), operadores lógicos y precedencia.',
      subtopics: [
        {
          id: 'fp-t2-sub1',
          title: '1. Tipos de Datos Simples y Tabla de Tamaños',
          summary: 'Tipos fundamentales en C: int (4 bytes), char (1 byte, 0-255 en ASCII), float (4 bytes), double (8 bytes), unsigned int (4 bytes, sin signo).',
          explanation: 'Tabla oficial de tipos (ETSISI):\n- `int`: 4 bytes (-2.147.483.648 a 2.147.483.647), formato `%d`\n- `char`: 1 byte (0 a 255), formato `%c`\n- `float`: 4 bytes (reales de precisión simple), formato `%f`\n- `double`: 8 bytes (reales de doble precisión), formato `%lf`\n- `unsigned int`: 4 bytes (0 a 4.294.967.295), formato `%u`\n- `short int`: 2 bytes (-32.768 a 32.767), formato `%hd`\nCódigo ASCII: cada carácter es internamente un entero de 1 byte:\n- \'A\' = 65, \'Z\' = 90\n- \'a\' = 97, \'z\' = 122 (diferencia de 32: \'a\' - \'A\' = 32)\n- \'0\' = 48, \'9\' = 57.',
          keyFormulas: [
            '\\text{\'a\'} - \\text{\'A\'} = 32',
            '\\text{Conversión a mayúscula: } c - 32 \\quad \\text{o} \\quad c + \\text{\'A\'} - \\text{\'a\'}',
            '\\text{Conversión carácter a dígito: } c - \\text{\'0\'}'
          ]
        },
        {
          id: 'fp-t2-sub2',
          title: '2. Operadores Aritméticos y División (División Entera vs Cast)',
          summary: 'Operadores: +, -, *, /, %. Si ambos operandos de / son enteros, el resultado es el cociente entero truncado (ej. 7/3 = 2). Para división real se requiere un cast explícito: (float) a / b.',
          explanation: 'División entera vs real:\n- `7 / 3` da `2` (división entera).\n- `7 % 3` da `1` (resto o módulo de la división).\n- Para obtener `2.333333` es imprescindible convertir al menos un operando a float: `(float) 7 / 3` o `7.0 / 3`.\nOperadores compactos de asignación:\n- `num += 10;` (equivale a `num = num + 10;`)\n- `num++;` (incremento en 1)\n- `num--;` (decremento en 1)',
          keyFormulas: [
            'a / b \\quad \\text{(división entera si } a, b \\in \\mathbb{Z}\\text{)}',
            '(float) a / b \\quad \\text{(fuerza división con decimales)}',
            'a \\% b \\quad \\text{(resto de la división entera)}'
          ]
        },
        {
          id: 'fp-t2-sub3',
          title: '3. Operadores Relacionales y Lógicos',
          summary: 'Comparación: >, <, >=, <=, == (igual), != (distinto). Operadores lógicos: && (AND), || (OR), ! (NOT). En C, 0 representa FALSO y cualquier valor distinto de 0 representa VERDADERO (por defecto 1).',
          explanation: 'Evaluación de expresiones lógicas:\n- `(7 > 1) && !(3 > 10)`: `(7 > 1)` es 1 (Verdadero). `(3 > 10)` es 0 (Falso), por tanto `!(0)` es 1. 1 && 1 da 1.\n- `(num1 < 1) || !(num2 > 10)` con num1=7 y num2=3:\n  (7 < 1) es 0.\n  !(3 > 10) es !0 = 1.\n  0 || 1 da 1.\nEvaluación en cortocircuito: en `A && B`, si A es falso, B no se evalúa. En `A || B`, si A es verdadero, B no se evalúa.',
          keyFormulas: [
            '\\&\\& \\text{ (AND lógico)}',
            '|| \\text{ (OR lógico)}',
            '! \\text{ (Negación lógica)}'
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
              '5. Segundos finales: seg = resto % 60;',
              '6. Mostrar con formato: %d segundos equivalen a %d horas, %d minutos y %d segundos.'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    int total_seg, h, min, seg;\n    printf("Introduce una cantidad de segundos: ");\n    scanf("%d", &total_seg);\n    h = total_seg / 3600;\n    seg = total_seg % 3600;\n    min = seg / 60;\n    seg = seg % 60;\n    printf("%d segundos equivalen a %d horas, %d minutos y %d segundos.\\n", total_seg, h, min, seg);\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-2-p5',
          title: 'Problema 5 (Tema 2): Distancia euclídea entre dos puntos en el plano',
          difficulty: 'medio',
          statement: 'Hacer un programa que lea dos puntos en el plano (cada punto está formado por dos coordenadas reales x, y) y devuelva la distancia entre esos dos puntos.',
          hints: ['Incluye <math.h> para sqrt() y pow(). La distancia es √((x₂ - x₁)² + (y₂ - y₁)²).'],
          solution: {
            finalAnswer: 'distancia = sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));',
            stepByStep: [
              '1. Incluir <stdio.h> y <math.h>.',
              '2. Declarar float x1, y1, x2, y2, distancia.',
              '3. Leer las coordenadas con scanf("%f %f", ...).',
              '4. Calcular distancia = sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));',
              '5. Imprimir con printf("%.2f\\n", distancia);'
            ],
            codeSnippet: '#include <stdio.h>\n#include <math.h>\n\nint main() {\n    float x1, y1, x2, y2, distancia;\n    printf("Introduce las coordenadas del primer punto (x1 y1): ");\n    scanf("%f %f", &x1, &y1);\n    printf("Introduce las coordenadas del segundo punto (x2 y2): ");\n    scanf("%f %f", &x2, &y2);\n    distancia = sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));\n    printf("La distancia entre los dos puntos es: %.2f\\n", distancia);\n    return 0;\n}'
          }
        }
      ],
      examQuestions: [
        {
          id: 'fp-q2',
          question: 'En lenguaje C, ¿cuál es el resultado de evaluar la expresión (7 / 2)?',
          options: ['3.5', '3', '4', 'Error de compilación'],
          correctIndex: 1,
          explanation: 'Ambos operandos son de tipo int, por lo que el compilador ejecuta una división entera truncando los decimales a 3.',
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
      description: 'Estructuras de selección e iteración en C: control de errores (división por cero), bucles anidados, contadores, acumuladores e inversión de números.',
      subtopics: [
        {
          id: 'fp-t3-sub1',
          title: '1. Sentencias Condicionales (if, if...else, switch...case)',
          summary: 'if (condición) sentencia; else sentencia; permite bifurcar la ejecución. switch (variable) case valor: ... break; permite selección múltiple eficiente.',
          explanation: 'Reglas clave:\n- Control de división por cero:\n```c\nif (divisor == 0) {\n    printf("Error: división por cero\\n");\n} else {\n    printf("Resultado: %d\\n", dividendo / divisor);\n}\n```\n- En la sentencia `switch`, cada caso debe terminar con `break;` para evitar que la ejecución continúe en el siguiente caso (fall-through). La cláusula `default:` captura valores no contemplados.',
          keyFormulas: [
            'if (condición) { ... } else { ... }',
            'switch(exp) { case 1: ... break; default: ... }'
          ]
        },
        {
          id: 'fp-t3-sub2',
          title: '2. Bucle for y Bucle while',
          summary: 'for (inicialización; condición; incremento) para bucles con número conocido de iteraciones (ej. factorial, recorridos). while (condición) cuando el número de iteraciones depende de una condición dinámica.',
          explanation: 'Ejemplo de factorial con bucle for:\n```c\nint r = 1;\nfor (int i = 1; i <= n; i++) {\n    r = r * i;\n}\n```\nValidación de entrada con bucle while:\n```c\nint n = 0;\nwhile (n <= 0) {\n    printf("Introduce un número positivo: ");\n    scanf("%d", &n);\n}\n```',
          keyFormulas: [
            'for (int i = 0; i < N; i++) { ... }',
            'while (condición) { ... }',
            'do { ... } while (condición);'
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
              '1. Leer el carácter con scanf(" %c", &c) (el espacio previo ignora espacios en blanco o saltos de línea).',
              '2. Si (c >= \'0\' && c <= \'9\') ⟹ Dígito.',
              '3. Si ((c >= \'a\' && c <= \'z\') || c == \'ñ\') ⟹ Letra minúscula.',
              '4. Si ((c >= \'A\' && c <= \'Z\') || c == \'Ñ\') ⟹ Letra mayúscula.',
              '5. En otro caso ⟹ Otro tipo de carácter.'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    char c;\n    printf("Introduce un carácter: ");\n    scanf(" %c", &c);\n    if (c >= \'0\' && c <= \'9\') {\n        printf("El carácter es un digito.\\n");\n    } else if ((c >= \'a\' && c <= \'z\') || c == \'ñ\') {\n        printf("El carácter es una letra minúscula.\\n");\n    } else if ((c >= \'A\' && c <= \'Z\') || c == \'Ñ\') {\n        printf("El carácter es una letra mayúscula.\\n");\n    } else {\n        printf("El carácter es otro tipo de carácter.\\n");\n    }\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-3-p7',
          title: 'Problema 7 (Tema 3): Cuadrado hueco de caracteres \'X\' con bucles anidados',
          difficulty: 'medio',
          statement: 'Escribir un programa que lea un número positivo e imprima por pantalla un cuadrado hueco de caracteres \'X\' con lado ese número.',
          hints: ['Bucle exterior para filas (i de 1 a lado), bucle interior para columnas (j de 1 a lado). Imprime \'X\' si estás en el borde (i=1, i=lado, j=1, j=lado); en otro caso espacio \' \'.'],
          solution: {
            finalAnswer: 'Bucle for anidado con condición de borde.',
            stepByStep: [
              '1. Leer el lado del cuadrado.',
              '2. Bucle for i = 1 hasta lado:',
              '3.   Bucle for j = 1 hasta lado:',
              '4.     Si (i == 1 || i == lado || j == 1 || j == lado) printf("X");',
              '5.     En caso contrario printf(" ");',
              '6.   printf("\\n");'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    int lado;\n    printf("Introduce el tamaño del lado del cuadrado: ");\n    scanf("%d", &lado);\n    for (int i = 1; i <= lado; i++) {\n        for (int j = 1; j <= lado; j++) {\n            if (i == 1 || i == lado || j == 1 || j == lado) {\n                printf("X");\n            } else {\n                printf(" ");\n            }\n        }\n        printf("\\n");\n    }\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-3-p17',
          title: 'Problema 17 (Tema 3): Invertir las cifras de un número',
          difficulty: 'medio',
          statement: 'Hacer un programa que lea por teclado un número y escriba el número inverso (el que resulta de colocar las cifras en orden contrario). Si se lee el 456 se escribirá el 654.',
          hints: ['Extrae la última cifra con resto = num % 10, acumula inverso = inverso * 10 + resto, y reduce num /= 10 en un bucle while.'],
          solution: {
            finalAnswer: 'Algoritmo clásico de inversión modular: inverso = inverso * 10 + (num % 10); num /= 10;',
            stepByStep: [
              '1. Leer int num.',
              '2. Inicializar int inverso = 0, resto;',
              '3. Mientras num != 0:\n   resto = num % 10;\n   inverso = inverso * 10 + resto;\n   num /= 10;',
              '4. Imprimir inverso.'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    int num, inverso = 0, resto;\n    printf("Introduce un numero entero: ");\n    scanf("%d", &num);\n    while (num != 0) {\n        resto = num % 10;\n        inverso = inverso * 10 + resto;\n        num /= 10;\n    }\n    printf("El numero inverso es: %d\\n", inverso);\n    return 0;\n}'
          }
        }
      ],
      examQuestions: [
        {
          id: 'fp-q3',
          question: '¿Qué ocurre si se omite la sentencia break al final de un bloque case en un switch?',
          options: [
            'Error de sintaxis en tiempo de compilación',
            'La ejecución continúa ("cae") automáticamente en el siguiente case sin evaluar su condición',
            'El programa se detiene de inmediato',
            'Se reinicia el switch desde el primer caso'
          ],
          correctIndex: 1,
          explanation: 'En C, los casos de switch no son excluyentes por defecto; sin un break se produce el fenómeno conocido como fall-through.',
          points: 2
        }
      ],
      practicalExamProblems: []
    },
    {
      id: 'fp-tema-4',
      number: 4,
      title: 'Tema 4: Funciones',
      subtitle: 'Paso por valor, paso por referencia (punteros), modularidad y recursividad',
      description: 'Diseño modular de funciones, ámbito y tiempo de vida de variables, paso por valor vs punteros (* y &), procedimientos void y funciones recursivas con pila de llamadas.',
      subtopics: [
        {
          id: 'fp-t4-sub1',
          title: '1. Definición y Modularidad de Funciones',
          summary: 'Una función encapsula una tarea con un tipo de retorno, parámetros y cuerpo. Permite reutilizar código y mejorar la legibilidad.',
          explanation: 'Ejemplo: cálculo de combinaciones m sobre n:\n```c\nint factorial(int n) {\n    int r = 1;\n    for (int i = 1; i <= n; i++) r *= i;\n    return r;\n}\n\nint combinaciones(int n, int m) {\n    return factorial(n) / (factorial(n - m) * factorial(m));\n}\n```\nEn vez de triplicar bucles de cálculo de factorial, se invoca la función tres veces.',
          keyFormulas: [
            'tipo_retorno nombreFuncion(tipo_param param1, ...) { ... return valor; }'
          ]
        },
        {
          id: 'fp-t4-sub2',
          title: '2. Paso por Valor vs Paso por Referencia (Punteros)',
          summary: 'En C, el paso de parámetros siempre se realiza por valor (se copia el dato). Para modificar la variable original de la función invocante se deben pasar punteros usando & en la llamada y * en la definición.',
          explanation: '¿Por qué no intercambia las variables esta función?\n```c\nvoid intercambiar(int a, int b) {\n    int aux = a; a = b; b = aux;\n}\n```\nPorque modifica copias locales en la pila. La versión correcta con paso por referencia es:\n```c\nvoid intercambiar(int* a, int* b) {\n    int aux = *a;\n    *a = *b;\n    *b = aux;\n}\n// Llamada en main: intercambiar(&x, &y);\n```',
          keyFormulas: [
            '&variable \\implies \\text{dirección de memoria}',
            '*puntero \\implies \\text{acceso al valor apuntado (desreferenciación)}'
          ]
        },
        {
          id: 'fp-t4-sub3',
          title: '3. Funciones Recursivas y Pila de Llamadas (Call Stack)',
          summary: 'Una función es recursiva si se llama a sí misma. Consta de al menos un caso base (para detener la recursión) y un paso recursivo.',
          explanation: 'Traza de factorial recursivo `factorial(3)`:\n```c\nint factorial(int n) {\n    if (n <= 1) return 1; // Caso base\n    else return n * factorial(n - 1); // Paso recursivo\n}\n```\n1. `factorial(3)` llama a `factorial(2)` y queda pausada esperando resultado.\n2. `factorial(2)` llama a `factorial(1)` y queda pausada.\n3. `factorial(1)` alcanza el caso base y retorna `1`.\n4. `factorial(2)` reanuda: `2 * 1 = 2` y retorna `2`.\n5. `factorial(3)` reanuda: `3 * 2 = 6` y retorna `6`.',
          keyFormulas: [
            '\\text{Caso Base: } n \\le 1 \\implies 1',
            '\\text{Paso Recursivo: } n! = n \\cdot (n-1)!'
          ]
        }
      ],
      exercises: [
        {
          id: 'fp-ej-4-p4',
          title: 'Problema 4 (Tema 4): Función es_digito',
          difficulty: 'fácil',
          statement: 'Escribe una función que, dado un carácter, devuelva 1 si ese carácter corresponde a un dígito, y 0 en caso contrario.',
          hints: ['Comprueba si caracter >= \'0\' && caracter <= \'9\'.'],
          solution: {
            finalAnswer: 'Función int es_digito(char c).',
            stepByStep: [
              '1. Recibir char caracter como argumento.',
              '2. Evaluar if (caracter >= \'0\' && caracter <= \'9\') return 1;',
              '3. En caso contrario return 0;'
            ],
            codeSnippet: 'int es_digito(char caracter) {\n    if (caracter >= \'0\' && caracter <= \'9\') {\n        return 1;\n    } else {\n        return 0;\n    }\n}'
          }
        },
        {
          id: 'fp-ej-4-p5',
          title: 'Problema 5 (Tema 4): Función es_primo optimizada',
          difficulty: 'medio',
          statement: 'Escribe una función que, dado un entero positivo, devuelva 1 si es primo, y 0 si no lo es.',
          hints: ['Si num <= 1 devuelve 0. Comprueba divisores desde i = 2 mientras i * i <= num.'],
          solution: {
            finalAnswer: 'Función int es_primo(int num) con bucle hasta √num.',
            stepByStep: [
              '1. Si num <= 1, no es primo ⟹ return 0.',
              '2. Inicializar i = 2.',
              '3. Mientras i * i <= num: si num % i == 0 ⟹ return 0; i++;',
              '4. Si no se encontró divisor ⟹ return 1;'
            ],
            codeSnippet: 'int es_primo(int num) {\n    if (num <= 1) {\n        return 0;\n    }\n    int i = 2;\n    while (i * i <= num) {\n        if (num % i == 0) {\n            return 0;\n        }\n        i++;\n    }\n    return 1;\n}'
          }
        },
        {
          id: 'fp-ej-4-p7',
          title: 'Problema 7 (Tema 4): Función es_perfecto (Suma de divisores propios)',
          difficulty: 'avanzado',
          statement: 'Un número es perfecto si la suma de sus divisores propios positivos, exceptuando él mismo, es igual al número (ej. 6 es perfecto porque 1 + 2 + 3 = 6). Escribe una función que, dado un entero positivo, devuelva 1 si es un número perfecto, y 0 si no lo es.',
          hints: ['Suma los divisores propios i y num/i mientras i * i <= num.'],
          solution: {
            finalAnswer: 'Función int es_perfecto(int num) sumando divisores propios.',
            stepByStep: [
              '1. Si num <= 1, return 0.',
              '2. Inicializar int suma_divisores = 1 (el 1 siempre es divisor propio).',
              '3. Bucle i desde 2 hasta √num (i * i <= num): si num % i == 0, suma_divisores += i; y si i * i != num, suma_divisores += num / i;',
              '4. Si suma_divisores == num ⟹ return 1; si no, return 0;'
            ],
            codeSnippet: 'int es_perfecto(int num) {\n    if (num <= 1) return 0;\n    int suma = 1;\n    for (int i = 2; i * i <= num; i++) {\n        if (num % i == 0) {\n            suma += i;\n            if (i * i != num) suma += num / i;\n        }\n    }\n    return (suma == num) ? 1 : 0;\n}'
          }
        }
      ],
      examQuestions: [
        {
          id: 'fp-q4',
          question: 'Si una función recursiva no incluye un caso base correctamente definido, ¿qué ocurre en tiempo de ejecución?',
          options: [
            'Devuelve 0 automáticamente',
            'Desbordamiento de pila (Stack Overflow) por llamadas recursivas infinitas',
            'El compilador optimiza el bucle y no hay error',
            'Se ejecuta solo una vez'
          ],
          correctIndex: 1,
          explanation: 'Cada llamada a función añade un nuevo marco de activación a la pila de llamadas; sin caso base la pila agota su memoria disponible y el sistema aborta el programa.',
          points: 2
        }
      ],
      practicalExamProblems: []
    },
    {
      id: 'fp-tema-5',
      number: 5,
      title: 'Tema 5: Arrays (Vectores)',
      subtitle: 'Indexación, paso a funciones, algoritmos de selección y burbuja, búsqueda y cadenas',
      description: 'Estructuras de datos contiguas homogéneas, paso implícito por referencia de arrays, ordenación por selección y burbuja, eliminación de duplicados y manipulación de strings.',
      subtopics: [
        {
          id: 'fp-t5-sub1',
          title: '1. Concepto de Array, Declaración y Acceso',
          summary: 'Colección homogénea de elementos almacenados en posiciones contiguas de memoria. Declaración: int x[100]; acceso de 0 a tam-1 mediante x[i].',
          explanation: 'Puntos esenciales:\n- Los arrays en C comienzan en el índice 0 y terminan en tam - 1.\n- Al pasar un array como parámetro a una función (ej. `float media(int x[], int tam)`), se pasa la dirección del primer elemento (de facto por referencia). Cualquier modificación dentro de la función afecta al array original en memoria.',
          keyFormulas: [
            'int miArray[N];',
            '\\text{Primer elemento: } miArray[0]',
            '\\text{Último elemento: } miArray[N - 1]'
          ]
        },
        {
          id: 'fp-t5-sub2',
          title: '2. Algoritmos de Ordenación: Selección y Burbuja',
          summary: 'Ordenación por Selección: busca el elemento mínimo en el subarray restante e intercambia. Ordenación por Burbuja: compara elementos adyacentes sucesivos intercambiándolos si están desordenados.',
          explanation: 'Código de ordenación por Selección:\n```c\nvoid ordenarPorSeleccion(int vector[], int tam) {\n    for (int i = 0; i < tam; i++) {\n        int k = i;\n        for (int j = i + 1; j < tam; j++) {\n            if (vector[j] < vector[k]) k = j;\n        }\n        int aux = vector[i];\n        vector[i] = vector[k];\n        vector[k] = aux;\n    }\n}\n```\nCódigo de ordenación por Burbuja (Bubble Sort):\nCompara pares `vector[j]` y `vector[j+1]` intercambiándolos hasta que no queden inversiones.',
          keyFormulas: [
            '\\text{Complejidad temporal Selección: } O(n^2)',
            '\\text{Complejidad temporal Burbuja: } O(n^2)'
          ]
        }
      ],
      exercises: [
        {
          id: 'fp-ej-5-p2',
          title: 'Problema 2 (Tema 5): Rotación de un array una posición a la derecha',
          difficulty: 'medio',
          statement: 'Escribe un programa que lea por consola 10 números en un array y los rote una posición a la derecha. El último elemento debe pasar a la primera posición.',
          hints: ['Guarda el último elemento en una variable auxiliar, desplaza los demás elementos hacia la derecha de atrás hacia adelante, y coloca el auxiliar en la posición 0.'],
          solution: {
            finalAnswer: 'int aux = arr[tam-1]; for (int i = tam-1; i > 0; i--) arr[i] = arr[i-1]; arr[0] = aux;',
            stepByStep: [
              '1. Leer los 10 enteros en arr[10].',
              '2. Guardar el último elemento: int ultimo = arr[9];',
              '3. Desplazar hacia la derecha desde el final: for (int i = 9; i > 0; i--) arr[i] = arr[i - 1];',
              '4. Asignar el último elemento a la primera posición: arr[0] = ultimo;',
              '5. Imprimir el array resultante.'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    int arr[10];\n    printf("Introduce 10 números: ");\n    for (int i = 0; i < 10; i++) scanf("%d", &arr[i]);\n    int ultimo = arr[9];\n    for (int i = 9; i > 0; i--) {\n        arr[i] = arr[i - 1];\n    }\n    arr[0] = ultimo;\n    printf("Array rotado a la derecha:\\n");\n    for (int i = 0; i < 10; i++) printf("%d ", arr[i]);\n    printf("\\n");\n    return 0;\n}'
          }
        },
        {
          id: 'fp-ej-5-p3',
          title: 'Problema 3 (Tema 5): Eliminar elementos duplicados de un array',
          difficulty: 'avanzado',
          statement: 'Escribe un programa que lea 8 números y elimine los duplicados, dejando sólo los valores únicos en el array en tres fases: lectura, eliminación de repetidos e impresión del array resultante.',
          hints: ['Usa un segundo contador para la longitud efectiva del array resultante sin repetidos.'],
          solution: {
            finalAnswer: 'Algoritmo de filtrado en sitio o con array auxiliar de únicos.',
            stepByStep: [
              '1. Fase 1: Leer los 8 números sin validación previa.',
              '2. Fase 2: Recorrer el array buscando repetidos; si un elemento no ha aparecido antes, copiarlo al array de únicos y aumentar nuevo_tam.',
              '3. Fase 3: Imprimir el array de únicos con tamaño nuevo_tam.'
            ],
            codeSnippet: '#include <stdio.h>\n\nint main() {\n    int a[8], unicos[8], n_unicos = 0;\n    printf("Introduce 8 números: ");\n    for (int i = 0; i < 8; i++) scanf("%d", &a[i]);\n    for (int i = 0; i < 8; i++) {\n        int repetido = 0;\n        for (int j = 0; j < n_unicos; j++) {\n            if (a[i] == unicos[j]) repetido = 1;\n        }\n        if (!repetido) {\n            unicos[n_unicos++] = a[i];\n        }\n    }\n    printf("Array sin duplicados (%d elementos):\\n", n_unicos);\n    for (int i = 0; i < n_unicos; i++) printf("%d ", unicos[i]);\n    printf("\\n");\n    return 0;\n}'
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
