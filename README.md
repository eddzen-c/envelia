<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=Envelia%20Studio&fontSize=48&fontColor=ffffff&animation=fadeIn&fontAlignY=40&desc=Invitaciones%20que%20cobran%20vida&descAlignY=60&descSize=18" width="100%"/>

<a href="https://github.com/eddzen-c">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=A855F7&center=true&vCenter=true&width=600&lines=Editor+drag-and-drop+en+tiempo+real;Sobres+animados+%2B+RSVP+inteligente;Mobile-first+%C2%B7+Accesible+%C2%B7+Modular" alt="Typing SVG" />
</a>

<br/>

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white" />
  <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
</p>

<p>
  <img src="https://img.shields.io/badge/status-en%20construcción-blueviolet?style=flat-square" />
  <img src="https://img.shields.io/badge/node-24%20LTS-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/presupuesto-%240%20infra-success?style=flat-square" />
  <img src="https://img.shields.io/github/last-commit/eddzen-c/envelia?style=flat-square" />
</p>

</div>

<br/>

## ✨ ¿Qué es Envelia Studio?

**Envelia Studio** es una plataforma SaaS premium para crear, personalizar y enviar **invitaciones digitales interactivas** — bodas, XV años, cumpleaños, graduaciones y eventos corporativos — con un editor visual, sobres animados y micrositios propios para cada evento.

<table>
<tr>
<td width="50%" valign="top">

### 🎨 Para el anfitrión
- Editor **drag-and-drop** sobre canvas
- Sobres animados con apertura interactiva
- Micrositio único por evento
- Gestión de invitados centralizada

</td>
<td width="50%" valign="top">

### 💌 Para el invitado
- Confirmación **RSVP** en segundos
- Experiencia mobile-first
- Animaciones fluidas y accesibles
- Soporte nativo de `prefers-reduced-motion`

</td>
</tr>
</table>

<br/>

## 🧭 Índice

<div align="center">

[Principios](#-principios-del-producto) · [Arquitectura](#-arquitectura) · [Stack](#-stack-técnico) · [Requisitos](#-requisitos-de-desarrollo) · [Empezar](#-cómo-empezar) · [Flujo de trabajo](#-flujo-de-trabajo) · [Roadmap](#-estado-y-roadmap) · [Comunidad](#-comunidad-y-políticas) · [Licencia](#-licencia-y-propiedad)

</div>

<br/>

## 🧱 Principios del producto

```txt
✔ Mobile-first en cada decisión de diseño
✔ Personalización visual mediante editor de canvas
✔ Animaciones optimizadas, accesibles y reducibles
✔ Arquitectura modular preparada para escalar
✔ Seguridad y protección de datos desde el día uno
✔ Infraestructura operable con presupuesto de $0
```

<br/>

## 🏗️ Arquitectura

Monorepo administrado con **Turborepo**, separando producto, dominio y presentación:

```mermaid
flowchart LR
    subgraph Monorepo["📦 Envelia Studio — Monorepo"]
        direction LR
        WEB["apps/web\nNext.js"]
        API["apps/api\nNestJS"]
        UI["packages/ui\nDesign System"]
        ANIM["packages/animations\nMotor de animación"]
        CONF["packages/config\nConfig compartida"]
        INFRA["infra\nContenedores y despliegue"]
    end

    WEB -->|consume| UI
    WEB -->|usa| ANIM
    WEB -->|HTTP/REST| API
    API -->|se apoya en| CONF
    WEB -->|se apoya en| CONF
    INFRA -->|despliega| WEB
    INFRA -->|despliega| API

    style WEB fill:#7c3aed,color:#fff,stroke:none
    style API fill:#e0234e,color:#fff,stroke:none
    style UI fill:#0ea5e9,color:#fff,stroke:none
    style ANIM fill:#f59e0b,color:#fff,stroke:none
    style CONF fill:#475569,color:#fff,stroke:none
    style INFRA fill:#10b981,color:#fff,stroke:none
```

<details>
<summary><strong>📂 Ver estructura de carpetas</strong></summary>

```
envelia-studio/
├── apps/
│   ├── web/            # Frontend — Next.js
│   └── api/            # Backend — NestJS
├── packages/
│   ├── ui/             # Sistema de diseño compartido
│   ├── animations/     # Motor propio de animaciones
│   └── config/         # Configuraciones compartidas
├── infra/              # Infraestructura, contenedores y despliegues
├── turbo.json
└── pnpm-workspace.yaml
```

</details>

<br/>

## ⚙️ Stack técnico

| Capa | Tecnología |
|---|---|
| Frontend | Next.js |
| Backend | NestJS |
| Monorepo | Turborepo |
| Gestor de paquetes | pnpm |
| Diseño | `packages/ui` (design system propio) |
| Animación | `packages/animations` (motor propio) |

<br/>

## 📋 Requisitos de desarrollo

| Herramienta | Versión |
|---|---|
| Git | última estable |
| Node.js | `24 LTS` |
| pnpm | `11.x` |
| Editor recomendado | Visual Studio Code |

<br/>

## 🚀 Cómo empezar

```bash
# Clona el repositorio
git clone https://github.com/eddzen-c/envelia.git
cd envelia

# Instala dependencias
pnpm install

# Levanta todo el monorepo en modo desarrollo
pnpm dev
```

<br/>

## 🔀 Flujo de trabajo

Este proyecto sigue **trunk-based development**:

```mermaid
gitGraph
   commit id: "main estable"
   branch feature/editor-canvas
   checkout feature/editor-canvas
   commit id: "feat: canvas base"
   commit id: "feat: drag and drop"
   checkout main
   merge feature/editor-canvas tag: "PR aprobado"
   branch fix/rsvp-validation
   checkout fix/rsvp-validation
   commit id: "fix: validación RSVP"
   checkout main
   merge fix/rsvp-validation
```

1. `main` representa siempre el estado estable del proyecto.
2. Cada cambio se desarrolla en una rama `feature/*`, `fix/*` o `chore/*`.
3. Los cambios ingresan a `main` únicamente mediante **Pull Requests**.
4. Los commits siguen la especificación **[Conventional Commits](https://www.conventionalcommits.org/)**.

<br/>

## 🗺️ Estado y roadmap

> Proyecto en fase de **configuración inicial** del repositorio y definición de su base técnica.

- [x] Definición de arquitectura y principios
- [x] Configuración del monorepo
- [ ] Editor drag-and-drop (MVP)
- [ ] Motor de animaciones de sobres
- [ ] Sistema de RSVP
- [ ] Micrositios por evento

<br/>

## 🤝 Comunidad y políticas

Envelia Studio recibe reportes de errores y propuestas de funcionalidad mediante los formularios configurados en GitHub.

Durante la preliberación no se aceptan contribuciones externas de código, documentación, diseño, recursos visuales ni otros materiales de implementación.

- [Guía de contribución](.github/CONTRIBUTING.md)
- [Código de conducta](.github/CODE_OF_CONDUCT.md)
- [Política de seguridad](.github/SECURITY.md)
- [Política de soporte](.github/SUPPORT.md)
- [Reportar un error](https://github.com/eddzen-c/envelia/issues/new?template=bug-report.yml)
- [Proponer una funcionalidad](https://github.com/eddzen-c/envelia/issues/new?template=feature-request.yml)

<br/>

## 🔒 Licencia y propiedad

Envelia Studio es software propietario. Su disponibilidad pública en GitHub no concede permiso para usar, copiar, modificar, distribuir, desplegar o comercializar el software.

Copyright © 2026 Edwin Hernandez. Todos los derechos reservados.

Consulta [LICENSE.md](LICENSE.md) para conocer los términos aplicables.

<br/>

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>

Hecho con 💜 por <a href="https://github.com/eddzen-c">@eddzen-c</a>

</div>
