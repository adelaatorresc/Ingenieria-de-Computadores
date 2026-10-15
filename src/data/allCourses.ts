import { Course } from '../types';
import { analisisMatematicoSubject } from './analisisMatematico';
import { fundamentosComputadoresSubject } from './fundamentosComputadores';
import { logicaMatematicaDiscretaSubject } from './logicaMatematicaDiscreta';
import { fundamentosProgramacionSubject } from './fundamentosProgramacion';
import { tallerSistemasOperativosSubject } from './tallerSistemasOperativos';

// Official ETSISI - UPM Plan de Estudios 61CI (2026/27)
export const allCourses: Course[] = [
  {
    id: '1',
    name: 'Primer Curso',
    semesters: [
      {
        id: '1',
        name: 'Primer Semestre (1.º)',
        subjects: [
          {
            ...analisisMatematicoSubject,
            code: '615000213'
          },
          {
            ...fundamentosComputadoresSubject,
            code: '615000214'
          },
          {
            ...fundamentosProgramacionSubject,
            code: '615000215'
          },
          {
            ...logicaMatematicaDiscretaSubject,
            code: '615000216'
          },
          {
            id: 'tp',
            name: 'Taller de Programación',
            shortName: 'TP',
            code: '615000221',
            ects: 3,
            color: 'violet',
            description: 'Prácticas de laboratorio en programación imperativa, depuración con gdb y desarrollo modular.',
            topics: []
          },
          {
            ...tallerSistemasOperativosSubject,
            code: '615000222'
          }
        ]
      },
      {
        id: '2',
        name: 'Segundo Semestre (2.º)',
        subjects: [
          {
            id: 'alg',
            name: 'Álgebra',
            shortName: 'ALG',
            code: '615000217',
            ects: 6,
            color: 'cyan',
            description: 'Espacios vectoriales, aplicaciones lineales, matrices, sistemas de ecuaciones lineales y diagonalización.',
            topics: []
          },
          {
            id: 'aes',
            name: 'Aspectos Éticos y Sociales',
            shortName: 'AES',
            code: '615000223',
            ects: 3,
            color: 'emerald',
            description: 'Deontología profesional de la ingeniería informática, impacto social y marcos normativos.',
            topics: []
          },
          {
            id: 'ec',
            name: 'Estructura de Computadores',
            shortName: 'EC',
            code: '615000218',
            ects: 6,
            color: 'rose',
            description: 'Organización básica de computadores, ejecución de instrucciones, lenguaje máquina y periféricos.',
            topics: []
          },
          {
            id: 'edat',
            name: 'Estructura de Datos',
            shortName: 'EDAT',
            code: '615000219',
            ects: 6,
            color: 'orange',
            description: 'Tipos abstractos de datos, listas, pilas, colas, árboles binarios, tablas hash y grafos.',
            topics: []
          },
          {
            id: 'fseg',
            name: 'Fundamentos de Seguridad',
            shortName: 'FSEG',
            code: '615000224',
            ects: 3,
            color: 'red',
            description: 'Principios de confidencialidad, integridad, disponibilidad, amenazas y mecanismos básicos de seguridad.',
            topics: []
          },
          {
            id: 'ffi',
            name: 'Fundamentos Físicos de la Informática',
            shortName: 'FFI',
            code: '615000220',
            ects: 6,
            color: 'blue',
            description: 'Leyes del electromagnetismo, teoría de circuitos, régimen transitorio y permanente, y semiconductores.',
            topics: []
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Segundo Curso',
    semesters: [
      {
        id: '1',
        name: 'Tercer Semestre (3.º)',
        subjects: [
          {
            id: 'acomp',
            name: 'Algorítmica y Complejidad',
            shortName: 'AC',
            code: '615000308',
            ects: 6,
            color: 'indigo',
            description: 'Análisis asintótico, divide y vencerás, algoritmos voraces, programación dinámica y complejidad computacional.',
            topics: []
          },
          {
            id: 'arc',
            name: 'Arquitectura de Computadores',
            shortName: 'ARC',
            code: '615000304',
            ects: 6,
            color: 'rose',
            description: 'Segmentación de cauce (pipelining), riesgos de datos y control, memorias caché y jerarquía de memoria.',
            topics: []
          },
          {
            id: 'bd',
            name: 'Bases de Datos',
            shortName: 'BD',
            code: '615000300',
            ects: 9,
            color: 'amber',
            description: 'Modelo relacional, álgebra relacional, diseño conceptual E/R, normalización, SQL y concurrencia.',
            topics: []
          },
          {
            id: 'ia',
            name: 'Inteligencia Artificial',
            shortName: 'IA',
            code: '615000309',
            ects: 3,
            color: 'purple',
            description: 'Búsqueda en espacios de estados, heurísticas, juegos adversarios, razonamiento y aprendizaje automático.',
            topics: []
          },
          {
            id: 'poo',
            name: 'Programación Orientada a Objetos',
            shortName: 'POO',
            code: '615000306',
            ects: 6,
            color: 'teal',
            description: 'Paradigmas de objetos, encapsulamiento, herencia, polimorfismo, interfaces y diseño con Java/C++.',
            topics: []
          }
        ]
      },
      {
        id: '2',
        name: 'Cuarto Semestre (4.º)',
        subjects: [
          {
            id: 'fee',
            name: 'Fundamentos de Economía y Empresa',
            shortName: 'FEE',
            code: '615000301',
            ects: 6,
            color: 'slate',
            description: 'Economía de la empresa, contabilidad, análisis financiero, costes y modelos de negocio en TI.',
            topics: []
          },
          {
            id: 'fis',
            name: 'Fundamentos de Ingeniería del Software',
            shortName: 'FIS',
            code: '615000303',
            ects: 9,
            color: 'blue',
            description: 'Modelos de ciclo de vida del software, requisitos, diseño UML, pruebas, integración continua y Scrum.',
            topics: []
          },
          {
            id: 'pe',
            name: 'Probabilidad y Estadística',
            shortName: 'PE',
            code: '615000302',
            ects: 6,
            color: 'cyan',
            description: 'Cálculo de probabilidades, variables aleatorias discretas y continuas, contrastes de hipótesis y regresión.',
            topics: []
          },
          {
            id: 'pca',
            name: 'Programación Concurrente y Avanzada',
            shortName: 'PCA',
            code: '615000305',
            ects: 6,
            color: 'orange',
            description: 'Hilos, semáforos, monitores, memoria compartida, paso de mensajes y patrones de diseño concurrente.',
            topics: []
          },
          {
            id: 'si',
            name: 'Seguridad de la Información',
            shortName: 'SI',
            code: '615000307',
            ects: 3,
            color: 'red',
            description: 'Criptografía, firmas digitales, certificados X.509, autenticación y análisis de vulnerabilidades.',
            topics: []
          }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Tercer Curso',
    semesters: [
      {
        id: '1',
        name: 'Quinto Semestre (5.º)',
        subjects: [
          {
            id: 'alp',
            name: 'Aspectos Legales y Profesionales',
            shortName: 'ALP',
            code: '615000310',
            ects: 3,
            color: 'gray',
            description: 'Protección de datos (RGPD), propiedad intelectual de software y contratos tecnológicos.',
            topics: []
          },
          {
            id: 'redes',
            name: 'Redes de Computadores',
            shortName: 'RC',
            code: '615000312',
            ects: 6,
            color: 'blue',
            description: 'Arquitectura TCP/IP, subredes IPv4/IPv6, protocolos de encaminamiento OSPF/BGP y sockets.',
            topics: []
          },
          {
            id: 'si_int',
            name: 'Sistemas Inteligentes',
            shortName: 'SINT',
            code: '615000470',
            ects: 6,
            color: 'purple',
            description: 'Redes neuronales, aprendizaje supervisado y no supervisado, y sistemas basados en conocimiento.',
            topics: []
          },
          {
            id: 'so_core',
            name: 'Sistemas Operativos',
            shortName: 'SO',
            code: '615000313',
            ects: 6,
            color: 'teal',
            description: 'Diseño interno del kernel, planificación de CPU, memoria virtual con paginación y drivers POSIX.',
            topics: []
          },
          {
            id: 'tec_comp',
            name: 'Tecnología de Computadores',
            shortName: 'TC',
            code: '615000318',
            ects: 6,
            color: 'emerald',
            description: 'Lógica secuencial síncrona, temporización en circuitos integrados y diseño con FPGAs.',
            topics: []
          },
          {
            id: 'opt_5',
            name: 'Asignaturas Optativas / Prácticas Externas',
            shortName: 'OPT5',
            code: '615001001',
            ects: 3,
            color: 'amber',
            description: 'Materias de especialización del 5.º semestre del catálogo oficial de optatividad.',
            topics: []
          }
        ]
      },
      {
        id: '2',
        name: 'Sexto Semestre (6.º)',
        subjects: [
          {
            id: 'arq_av',
            name: 'Arquitectura Avanzadas',
            shortName: 'AAV',
            code: '615000317',
            ects: 6,
            color: 'rose',
            description: 'Procesadores superescalares, predicción de saltos, ejecución especulativa y multiprocesadores.',
            topics: []
          },
          {
            id: 'phr',
            name: 'Programación de Hardware Reconfigurable',
            shortName: 'PHR',
            code: '615000319',
            ects: 6,
            color: 'emerald',
            description: 'Diseño digital con lenguaje VHDL/Verilog y síntesis sobre dispositivos FPGA.',
            topics: []
          },
          {
            id: 'ssr',
            name: 'Seguridad en Sistemas y Redes',
            shortName: 'SSR',
            code: '615000316',
            ects: 6,
            color: 'red',
            description: 'Firewalls, sistemas IDS/IPS, seguridad perimetral, VPNs IPsec/TLS y hardening de servidores.',
            topics: []
          },
          {
            id: 'tlp',
            name: 'Traductores de Lenguajes de Programación',
            shortName: 'TLP',
            code: '615000311',
            ects: 6,
            color: 'indigo',
            description: 'Compiladores, análisis léxico, sintáctico (LR/LL), tabla de símbolos y generación de código.',
            topics: []
          },
          {
            id: 'opt_6',
            name: 'Asignaturas Optativas / Prácticas Externas',
            shortName: 'OPT6',
            code: '615001002',
            ects: 6,
            color: 'amber',
            description: 'Materias de especialización del 6.º semestre del catálogo oficial de optatividad.',
            topics: []
          }
        ]
      }
    ]
  },
  {
    id: '4',
    name: 'Cuarto Curso',
    semesters: [
      {
        id: '1',
        name: 'Séptimo Semestre (7.º)',
        subjects: [
          {
            id: 'robotica',
            name: 'Robótica',
            shortName: 'ROB',
            code: '615000334',
            ects: 6,
            color: 'cyan',
            description: 'Cinemática, dinámica de manipuladores, sensores robóticos, actuadores y control en ROS.',
            topics: []
          },
          {
            id: 'english',
            name: 'English for Professional and Academic Communication',
            shortName: 'EPAC',
            code: '615000332',
            ects: 6,
            color: 'blue',
            description: 'Comunicación técnica en inglés para ingenieros, redacción de informes y presentaciones orales.',
            topics: []
          },
          {
            id: 'sbc',
            name: 'Sistemas Basados en Computador',
            shortName: 'SBC',
            code: '615000335',
            ects: 6,
            color: 'purple',
            description: 'Integración hardware/software a nivel de placa, buses industriales e interfaces avanzadas.',
            topics: []
          },
          {
            id: 'str',
            name: 'Sistemas de Tiempo Real',
            shortName: 'STR',
            code: '615000492',
            ects: 6,
            color: 'orange',
            description: 'Planificación determinista en tiempo real, análisis de tiempos de respuesta y núcleos RTOS.',
            topics: []
          },
          {
            id: 'se_emp',
            name: 'Sistemas Empotrados',
            shortName: 'SEMP',
            code: '615000491',
            ects: 6,
            color: 'teal',
            description: 'Microcontroladores ARM Cortex, periféricos integrados, bajo consumo y programación bare-metal.',
            topics: []
          }
        ]
      },
      {
        id: '2',
        name: 'Octavo Semestre (8.º)',
        subjects: [
          {
            id: 'opt_8',
            name: 'Asignaturas Optativas y/o Prácticas Académicas Externas',
            shortName: 'OPT8',
            code: '615001003',
            ects: 18,
            color: 'amber',
            description: 'Bloque de optatividad avanzada de 18 ECTS o prácticas profesionales en empresas del sector.',
            topics: []
          },
          {
            id: 'tfg',
            name: 'Trabajo Fin de Grado',
            shortName: 'TFG',
            code: '615000345',
            ects: 12,
            color: 'emerald',
            description: 'Proyecto individual original e integrador defendido ante tribunal universitario.',
            topics: []
          }
        ]
      }
    ]
  }
];
