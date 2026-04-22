# Arquitectura de Agentes IA

Este repositorio contiene un motor de automatización semántica para Google Ads basado en un pipeline de agentes IA separados. Los principales agentes y sus responsabilidades son:

## 1. Ingestor (Scraper)
- Ubicación principal: `/src/scraper/`
- Responsabilidad: Extracción de contenido HTML de landing pages o sitios web para obtener contexto y analizar el producto o servicio ofrecido.

## 2. Red Team (Generador de intención)
- Ubicación principal: `/src/agents/`
- Responsabilidad: Encargado de analizar el contenido extraído y generar palabras clave e intenciones de búsqueda de alta conversión. Actúa como el cerebro principal para la estrategia de las campañas.

## 3. Financiero (Validador de Google Ads)
- Ubicación principal: `/src/ads/`
- Responsabilidad: Interactúa directamente con la API de Google Ads. Su función principal es aplicar el candado financiero estricto asegurando que las campañas nunca excedan el `MAX_DAILY_BUDGET_USD` configurado. Además, es responsable de orquestar la creación de anuncios y grupos de anuncios validados.
