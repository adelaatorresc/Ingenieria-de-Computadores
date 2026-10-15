import { Subject } from '../types';

export const tallerSistemasOperativosSubject: Subject = {
  id: 'tso',
  name: 'Taller de Sistemas Operativos',
  shortName: 'TSO',
  code: '595000005',
  ects: 3,
  color: 'teal',
  description: 'Entorno Unix/Linux, terminal y consola, sistema de ficheros e i-nodos, permisos, editor vi, scripts bash, filtros y canalizaciones (pipes).',
  topics: [
    {
      id: 'tso-tema-1',
      number: 1,
      title: 'Práctica 01a: Introducción a la Shell y Sistema de Ficheros',
      subtitle: 'Entrar y salir, pwd, cd, ls, cat, head, tail, grep, comodines y redirecciones',
      description: 'Manejo básico de la consola de comandos de Linux/Unix, comandos de navegación, visualización de contenidos y redirección de flujos estándar.',
      subtopics: [
        {
          id: 'tso-t1-sub1',
          title: '1. Sesión de Usuario y Entorno Shell',
          summary: 'Inicio con login y contraseña. Comandos básicos de sesión: who (usuarios conectados), date (fecha y hora del sistema), cal (calendario). Salida con exit, logout o ^D (Control + D).',
          explanation: 'Comandos de inicio y control de terminal:\n- `login:` identificación con usuario y contraseña (no muestra caracteres en pantalla al teclear).\n- `who`: lista los usuarios activos en la máquina.\n- `date`: imprime fecha y hora actual.\n- `cal 2026`: genera el calendario del año 2026.\n- Para cerrar la sesión: teclear `exit`, `logout` o pulsar `Control + D` (`^D`).\n- `pwd`: (print working directory) indica la ruta absoluta del directorio actual en el árbol jerárquico.',
          keyFormulas: [
            'pwd \\implies \\text{directorio de trabajo actual}',
            'exit \\quad \\text{o} \\quad ^D \\implies \\text{finalizar sesión de shell}'
          ]
        },
        {
          id: 'tso-t1-sub2',
          title: '2. Navegación en el Árbol de Directorios (cd)',
          summary: 'cd para cambiar de directorio. cd .. sube un nivel. cd sin parámetros lleva al HOME del usuario. cd /etc para rutas absolutas.',
          explanation: 'Rutas relativas vs absolutas:\n- `cd ..`: retrocede al directorio padre.\n- `cd /etc`: salta a la ruta absoluta `/etc` desde la raíz.\n- `cd`: sin argumentos regresa siempre al directorio personal `$HOME`.\n- `cd tso/01/palabras`: navega por ruta relativa hacia el subdirectorio especificado.',
          keyFormulas: [
            'cd .. \\implies \\text{subir al directorio padre}',
            'cd \\implies \\text{volver al HOME personal}'
          ]
        },
        {
          id: 'tso-t1-sub3',
          title: '3. Listado e Inspección de Ficheros (ls, cat, head, tail)',
          summary: 'ls lista ficheros; opciones -l (formato largo con permisos, tamaño, fecha), -a (muestra ocultos que empiezan por punto .). Visualización: cat (completo), head -n (primeras n líneas), tail -n (últimas n líneas).',
          explanation: 'Comandos de visualización:\n- `ls -l`: muestra modo de acceso (rwxr-xr-x), número de enlaces/i-nodo, propietario, grupo, tamaño en bytes y fecha.\n- `ls -a`: incluye los ficheros y directorios ocultos (como `.` y `..`).\n- `cat dias`: vuelca todo el fichero por la salida estándar.\n- `cat dias meses`: concatena y muestra ambos ficheros consecutivamente.\n- `head -5 meses`: muestra las 5 primeras líneas.\n- `tail -3 meses`: muestra las 3 últimas líneas.',
          keyFormulas: [
            'ls -la \\implies \\text{listado detallado incluyendo ocultos}',
            'head -n 10 fichero \\implies \\text{primeras 10 líneas}',
            'tail -n 10 fichero \\implies \\text{últimas 10 líneas}'
          ]
        },
        {
          id: 'tso-t1-sub4',
          title: '4. Búsqueda con grep, Comodines y Redirección (> y >>)',
          summary: 'grep busca patrones de texto en ficheros. Comodín * representa cero o más caracteres. Redirección > sobrescribe el fichero de destino; >> añade contenido al final.',
          explanation: 'Ejemplos de la práctica 01a:\n- `grep es dias`: busca y muestra todas las líneas que contienen la subcadena "es".\n- `echo *`: expande e imprime todos los ficheros del directorio actual.\n- `echo *a*`: muestra los ficheros cuyo nombre contiene la letra \'a\'.\n- `echo mi tesoro > prifi`: crea o sobrescribe `prifi` con "mi tesoro".\n- `echo solo mio >> prifi`: añade la línea "solo mio" al final de `prifi` sin borrar lo anterior.\n- `cat prifi > gemelo`: copia el contenido de `prifi` en un nuevo fichero `gemelo` mediante redirección de salida.',
          keyFormulas: [
            '> fichero \\implies \\text{sobrescribe la salida estándar}',
            '>> fichero \\implies \\text{añade al final sin sobrescribir}',
            'grep \\text{patrón} \\text{fichero} \\implies \\text{filtra líneas que coinciden}'
          ]
        }
      ],
      exercises: [],
      examQuestions: [
        {
          id: 'tso-q1',
          question: '¿Cuál es la diferencia entre los operadores de redirección > y >> en la shell de Unix?',
          options: [
            '> añade al final y >> sobrescribe el fichero',
            '> sobrescribe el contenido del fichero destino, mientras que >> añade la salida al final del fichero existente',
            '> solo funciona con comandos del sistema y >> con scripts de usuario',
            'Ambos son idénticos'
          ],
          correctIndex: 1,
          explanation: '> trunca el fichero y escribe desde el principio; >> abre el fichero en modo append preservando el contenido previo.',
          points: 2
        },
        {
          id: 'tso-q2',
          question: '¿Qué comando muestra las primeras 4 líneas del fichero "dias"?',
          options: ['tail -4 dias', 'head -4 dias', 'cat -4 dias', 'grep -4 dias'],
          correctIndex: 1,
          explanation: 'El comando head con la opción -n (o -4) muestra las primeras n líneas del fichero.',
          points: 2
        }
      ],
      practicalExamProblems: []
    },
    {
      id: 'tso-tema-2',
      number: 2,
      title: 'Práctica 02a: Scripts Bash, Editor vi y Metacaracteres',
      subtitle: 'Creación de scripts pripro, comandos de vi, inspección recursiva con du y patrones con corchetes',
      description: 'Uso práctico del editor modal vi (modos comando e inserción), ejecución de scripts en bash, análisis del uso de disco con du y expansión de metacaracteres avanzados.',
      subtopics: [
        {
          id: 'tso-t1-sub5',
          title: '1. Scripts en Bash y Ejecución',
          summary: 'Un script es un fichero de texto con una secuencia de comandos ejecutables por el intérprete. Se ejecuta invocando bash nombreScript.',
          explanation: 'Ejemplo de la práctica:\nCrear el fichero `pripro` con:\n```bash\nhead -2 dias\ntail -2 dias\n```\nAl ejecutar `bash pripro`, la shell interpreta secuencialmente ambas órdenes mostrando las dos primeras y las dos últimas líneas del fichero `dias`.',
          keyFormulas: [
            'bash script.sh \\implies \\text{ejecuta el script con el intérprete bash}'
          ]
        },
        {
          id: 'tso-t1-sub6',
          title: '2. Editor vi Básico: Modos y Comandos Esenciales',
          summary: 'Editor modal estándar en Unix. Dos modos principales: modo comando (navegación y edición) y modo inserción (escritura de texto). Comandos: i, Escape, x, dd, :wq, :q!.',
          explanation: 'Comandos esenciales de vi:\n- Entrar: `vi nombreFichero`\n- `i`: entra en modo inserción justo antes del cursor.\n- `Escape` (`ESC`): sale del modo inserción y regresa al modo comando.\n- `x`: borra el carácter situado bajo el cursor.\n- `dd`: borra la línea completa actual.\n- `:wq`: escribe los cambios en disco y sale de vi.\n- `:q!`: sale de vi descartando cualquier modificación sin guardar.',
          keyFormulas: [
            'i \\implies \\text{modo inserción}',
            'ESC \\implies \\text{modo comando}',
            ':wq \\implies \\text{guardar y salir}',
            ':q! \\implies \\text{salir sin guardar cambios}'
          ]
        },
        {
          id: 'tso-t1-sub7',
          title: '3. Uso de Disco y Metacaracteres de Shell',
          summary: 'du calcula el espacio en disco en bloques de 1024 octetos; du -a incluye ficheros individuales. Metacaracteres: *, ?, [2-4], [42], comillas simples para anular expansión.',
          explanation: 'Comportamiento de metacaracteres:\n- `a*`: nombres que empiezan por \'a\' seguido de cualquier cosa.\n- `*1`: nombres que terminan por \'1\'.\n- `a[2-4]`: coincide con `a2`, `a3`, `a4`.\n- `a[42]`: coincide exclusivamente con `a4` y `a2`.\n- `??*`: al menos dos caracteres seguidos de cualquiera.\n- Comillas simples `\'??*\'`: la shell no expande los metacaracteres, los pasa como texto literal al comando.',
          keyFormulas: [
            '[a-z] \\implies \\text{rango de caracteres}',
            '[13F] \\implies \\text{cualquiera de los caracteres especificados}',
            '\'texto\' \\implies \\text{anula todo significado especial de metacaracteres}'
          ]
        }
      ],
      exercises: [],
      examQuestions: [
        {
          id: 'tso-q3',
          question: 'En el editor vi, ¿cómo se sale descartando todos los cambios realizados sin modificar el fichero en disco?',
          options: [':w', ':exit', ':q!', ':wq'],
          correctIndex: 2,
          explanation: ':q! fuerza la salida del editor sin escribir los cambios en el fichero original.',
          points: 2
        }
      ],
      practicalExamProblems: []
    },
    {
      id: 'tso-tema-3',
      number: 3,
      title: 'Práctica 03a y Filtros Unix: Procesamiento de Flujos y Sistema',
      subtitle: 'Comentarios, punto y coma, cp, mv, ln, i-nodos, parámetros posicionales ($1), man y catálogo de filtros',
      description: 'Diferencia fundamental entre copia (cp), renombrado (mv) y enlace rígido (ln) respecto al i-nodo. Parámetros en scripts ($1), páginas de manual man y tabla de filtros (cut, sort, uniq, sed, awk).',
      subtopics: [
        {
          id: 'tso-t1-sub8',
          title: '1. Ficheros e i-Nodos: cp, mv, ln y rm',
          summary: 'Un i-nodo es el identificador único del fichero en disco. cp crea un nuevo fichero con NUEVO i-nodo. mv y ln NO crean nuevo i-nodo. ln añade un nuevo nombre que comparte el MISMO i-nodo.',
          explanation: 'Comportamiento de los comandos con los i-nodos (`ls -li`):\n- `cp a1 a2`: duplica el contenido físico en disco y asigna a `a2` un número de i-nodo nuevo y distinto del de `a1`.\n- `mv b1 b2`: cambia el nombre o ubicación en el directorio, pero el número de i-nodo se conserva exactamente igual.\n- `ln c1 c2`: crea un enlace rígido (hard link); `c1` y `c2` apuntan al mismo i-nodo idéntico. Si modificas `c1`, se modifica `c2` al ser el mismo fichero físico.\n- `rm c1`: decrementa el contador de enlaces del i-nodo; los datos físicos solo se liberan cuando el contador de enlaces llega a 0.',
          keyFormulas: [
            '\\text{cp: crea nuevo i-nodo}',
            '\\text{mv y ln: conservan el mismo i-nodo}',
            'ls -i \\quad \\text{o} \\quad ls -li \\implies \\text{muestra número de i-nodo}'
          ]
        },
        {
          id: 'tso-t1-sub9',
          title: '2. Parámetros en Scripts ($1) y Manuales man',
          summary: 'Los scripts reciben argumentos accesibles mediante $1, $2, etc. El comando man muestra la documentación de un comando (se sale pulsando q).',
          explanation: 'Uso de parámetros:\nEn un script `terpro`:\n```bash\nhead -2 $1\ntail -2 $1\n```\nAl ejecutar `bash terpro dias`, la variable especial `$1` toma el valor "dias".\nAl ejecutar `bash terpro meses`, `$1` toma el valor "meses".\nConsulta de manuales:\n- `man printf`: manual del comando de shell printf.\n- `man 3 printf`: manual de la función de biblioteca de C printf(3) (sección 3 del manual).\n- `q`: salir del paginador man.',
          keyFormulas: [
            '$1, $2, \\dots \\implies \\text{parámetros posicionales pasados al script}',
            'man 3 funcion \\implies \\text{documentación de la función C en sección 3}'
          ]
        },
        {
          id: 'tso-t1-sub10',
          title: '3. Filtros y Comandos Unix Esenciales',
          summary: 'Catálogo de filtros de la ETSISI: cut (extraer campos), sort (ordenar), uniq (eliminar líneas consecutivas repetidas), wc (contar líneas, palabras, caracteres), tr (sustituir caracteres), sed y awk.',
          explanation: 'Filtros fundamentales para procesamiento en tubería (`pipe |`):\n- `cut -d: -f1 /etc/passwd`: extrae el primer campo delimitado por dos puntos (los nombres de usuario).\n- `sort -n`: ordena numéricamente; `sort -r`: orden inverso decreciente.\n- `uniq -c`: cuenta repeticiones de líneas consecutivas idénticas (suele combinarse con `sort | uniq -c`).\n- `wc -l`: cuenta el número total de líneas.\n- `tr \'a-z\' \'A-Z\'`: convierte todas las letras minúsculas a mayúsculas.',
          keyFormulas: [
            'cmd1 \\mid cmd2 \\implies \\text{la salida estándar de cmd1 se conecta a la entrada de cmd2}',
            'sort \\mid uniq -c \\implies \\text{conteo de ocurrencias únicas}'
          ]
        }
      ],
      exercises: [],
      examQuestions: [
        {
          id: 'tso-q4',
          question: 'Si ejecutamos "ln f1 f2", ¿qué ocurre con el número de i-nodo de f2?',
          options: [
            'f2 recibe un número de i-nodo nuevo y superior',
            'f2 comparte exactamente el mismo número de i-nodo que f1',
            'f2 no tiene i-nodo porque es un archivo temporal',
            'Se borra el i-nodo de f1'
          ],
          correctIndex: 1,
          explanation: 'ln crea un enlace duro (hard link), lo que añade una nueva entrada de directorio que referencia al mismo i-nodo existente en el sistema de ficheros.',
          points: 2
        },
        {
          id: 'tso-q5',
          question: '¿Qué comando permite consultar la página de manual de la función C printf (librería estándar, sección 3)?',
          options: ['man printf', 'man 3 printf', 'man -c printf', 'help printf'],
          correctIndex: 1,
          explanation: 'man 3 printf consulta específicamente la sección 3 del manual de Unix dedicada a las funciones de biblioteca de C.',
          points: 2
        }
      ],
      practicalExamProblems: []
    }
  ]
};
