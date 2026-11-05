# Perfil de skills: lo que tengo

Solo skills que poseo, a nivel **[solido]** (lo defiendo en entrevista, con
evidencia en un proyecto) o **[parcial]** (lo he tocado, no lo domino). Aquí nunca
hay huecos: lo que me falta vive en radar-huecos.md. Un término entra aquí solo
cuando confirmo que lo tengo, con certificación, proyecto o experiencia.

Revisa los niveles y corrígeme los que no cuadren con cómo te ves.

---

## Lenguajes de programación
- [solido] Java (Java 8, un año en Indra más el backend del proyecto WhatsApp)
- [solido] Python (proyectos de IA, scripting, fine-tuning)
- [parcial] JavaScript y TypeScript
- [parcial] C# (Star-Group, stack .NET)
- [parcial] SQL

## Backend
- [solido] Spring y Spring Boot
- [solido] Testing: JUnit5, Mockito, cobertura de código
- [parcial] ASP.NET
- [parcial] Diseño de APIs y webhooks (controller de webhooks de WhatsApp con Spring Boot)
- [parcial] JBoss, Maven
- [parcial] Node.js + Express en producción (Migré una aplicación de Java/Spring a Node.js, transformando los objetos de dominio a JSON para servir al mismo frontend que ya los consumía.)

## Frontend
- [solido] React
- [solido] HTML y CSS
- [parcial] Angular
- [parcial] Next.js

## Datos y persistencia
- [solido] PostgreSQL
- [solido] Supabase
- [parcial] Oracle
- [parcial] Modelado de datos

## Infraestructura, DevOps y despliegue
- [solido] Docker y contenerización: Dockerfile, imágenes, contenedores y volúmenes
- [solido] Despliegue self-hosted: Hetzner VPS, nginx, Let's Encrypt
- [solido] CI/CD con GitHub Actions: workflows en YAML, eventos, jobs, actions y runners
- [solido] Git
- [solido] CI/CD como disciplina: integración continua, entrega continua y despliegue continuo
- [parcial] RunPod y GPU cloud (usado para fine-tuning, no en producción)
- [parcial] Green software / green DevOps: pipelines eficientes, intensidad de carbono, optimización de recursos

## Ingeniería de LLM e IA aplicada
- [solido] Fine-tuning: LoRA, PEFT, Unsloth (mi diferenciador, demostrado en Scannet)
- [solido] Integración de APIs de LLM: DeepSeek, Gemini, Gemma
- [solido] OCR aplicado: OCR.space, DeepSeek-OCR, pipeline OCR a JSON en producción
- [solido] Transcripción de audio con Whisper
- [parcial] Teoría de transformers, ViT, DeepSeek-VL (marco teórico del TFG)
- [parcial] Integración de Meta Cloud API y webhooks de WhatsApp
- [solido] Gobernanza de IA / AI governance (ISO/IEC 42001: uso ético, trazabilidad, gestión de riesgos y seguridad del contexto; ISO/IEC 5060: evaluación de sistemas de IA)
- [solido] Vibe coding / natural language programming: orquestar la implementación por prompts y delegar la escritura de código al LLM
- [parcial] Tool use / function calling: el LLM decide cuándo consultar fuera, estructura el JSON de argumentos e invoca la herramienta
- [parcial] Alucinaciones semánticas: código sintácticamente impecable pero lógicamente incorrecto, obsoleto o inseguro
- [solido] TDD invertido / guard-rail driven TDD: los tests como red de seguridad que acota el rango de soluciones de la IA

## Fundamentos de informática
- [solido] Estructuras de datos y algoritmos (EDA I y II)
	- TreeSet, Par, TreeMap, HashMap, LinkedList, Programación dinamica, 
- [parcial] Concurrencia, hilos y sincronización
- [parcial] Diseño de sistemas (nivel junior)

## Dominio industrial
- [parcial] SCADA
- [parcial] PLCs
- [parcial] Modbus

## Herramientas y protocolos
- [solido] MCP (Model Context Protocol): servidor propio en TypeScript con el SDK de Anthropic sobre stdio, además de filesystem y Gmail en Claude Desktop

## Estándares internacionales y normativa de calidad
- [parcial] ISO/IEC 12207: ciclo de vida del software, procesos primarios, de apoyo y organizacionales
- [solido] ISO/IEC 25010: modelo de calidad de producto; mantenibilidad como modularidad, reusabilidad, analizabilidad, modificabilidad y testeabilidad
- [parcial] ISO/IEC 5055: medidas de calidad a nivel de código (confiabilidad, eficiencia, seguridad, mantenibilidad) mapeadas a CWE
- [parcial] ISO/IEC 5060: evaluación de calidad de sistemas de IA, trazabilidad de propiedad intelectual y Zero Trust
- [parcial] ISO/IEC 19506 / KDM: modernización impulsada por arquitectura (ADM) sobre legacy, en 4 capas
- [parcial] ISO/IEC/IEEE 26514: ingeniería documental; análisis, derivación y validación para el público objetivo
- [parcial] ISO/IEC 5230 (OpenChain): cumplimiento de licencias de código abierto
- [solido] ISO/IEC 42001: sistema de gestión de IA (ver también Ingeniería de LLM e IA aplicada)
- [parcial] ISO/IEC/IEEE 29119: marco de pruebas, estáticas y dinámicas, de componente e integración

## Métricas y diagnóstico de código
- [parcial] CK metrics: WMC, DIT, NOC, CBO, RFC y LCOM
- [parcial] Complejidad ciclomática de McCabe: caminos linealmente independientes y mínimo de casos de prueba
- [parcial] Carga cognitiva: esfuerzo mental de leer el código, anidamiento y abstracciones insuficientes
- [parcial] LOC frente a puntos de función: tamaño técnico contra tamaño funcional
- [parcial] Deuda técnica automatizada: capital (coste de refactor) frente a intereses (sobrecoste diario)

## Diseño, arquitectura y código legacy
- [solido] SOLID: responsabilidad única, abierto/cerrado, sustitución de Liskov, segregación de interfaces e inversión de dependencias
- [parcial] Inyección de dependencias e inversión de control
- [parcial] Arquitectura hexagonal: puertos y adaptadores aislando el dominio de la infraestructura
- [solido] Patrones GoF: creacionales, estructurales y de comportamiento
- [parcial] Singleton como antipatrón: estado global oculto, acoplamiento invisible y pérdida de testabilidad
- [parcial] Legacy code según Feathers: código sin tests
- [parcial] Costuras (seams) de compilación, enlace y ejecución para aislar dependencias
- [parcial] Patrón estrangulador (Strangler Fig) para sustituir monolitos por partes
- [parcial] Over-engineering y complejidad accidental

## Metodologías de desarrollo
- [solido] TDD: ciclo red-green-refactor
- [solido] SDD (spec-driven development): la especificación como única fuente de verdad

## Calidad continua y gobernanza (DevQualOps)
- [parcial] DevQualOps: aseguramiento de calidad continuo dentro del ciclo CI/CD
- [parcial] Quality gates: umbrales booleanos de cobertura y complejidad que bloquean la integración
- [parcial] SAST frente a DAST: análisis estático del fuente contra pruebas de caja negra en ejecución
- [parcial] OpenAPI Specification: contratos de API REST en YAML/JSON, mocks y validación

## Marco legal, ético y documental
- [parcial] Docs as Code: documentación en Markdown con Git, pull requests y CI/CD
- [parcial] LPI: derechos morales y patrimoniales sobre el software
- [parcial] RGPD: licitud, limitación de finalidad, minimización y derechos ARSULIPO
- [parcial] Derecho a la interoperabilidad (Directiva 2009/24/CE, art. 6): descompilación por encima del EULA
- [parcial] Factor bus: riesgo por concentración de conocimiento crítico

## Idiomas
- [solido] Español (nativo)
- [solido] Inglés (bilingüe)
