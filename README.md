
<p align="center">
  <img src="https://github.com/CyberArcenal/WebMify-Admin/blob/main/public/logo.png?raw=true" alt="Webmify Admin Logo" width="120"/>
</p>

<h1 align="center">Webmify Admin</h1>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4.1-06B6D4?logo=tailwindcss" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue" />
</p>

<p align="center">
  A modern, full‑featured admin dashboard and portfolio interface.<br/>
  Built with <strong>React + TypeScript</strong> and designed to consume any REST API – perfect for managing content, displaying projects, blog posts, and analytics.
</p>

---

## ✨ Features

- ⚡ **Vite** – lightning‑fast development and builds.
- 🧩 **React Router** – seamless client‑side navigation.
- 🎨 **Tailwind CSS** – utility‑first styling, fully responsive.
- 📊 **Charts** – beautiful statistics with Chart.js / Recharts.
- 📝 **React Hook Form** – simple and performant forms.
- 🖼️ **Swiper** – touch‑enabled sliders for galleries.
- 🔔 **Toast notifications** – (implement via your own UI).
- 🔗 **Axios** – easy API integration.
- 🛡️ **TypeScript** – type safety and better developer experience.

---

## 🧰 Tech Stack

- **Core:** React 19, TypeScript 5.9
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4 + `tailwind-merge`
- **Routing:** React Router 7
- **Forms:** React Hook Form
- **Charts:** Chart.js, Recharts
- **HTTP Client:** Axios
- **Utilities:** date-fns, lucide-react, swiper

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm / yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CyberArcenal/WebMify-Admin.git
   cd WebMify-Admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

4. **Build for production**
   ```bash
   npm run build
   ```
   Output files are placed in the `dist` folder.

---

## 🔗 API Integration

This frontend is designed to work with any backend API.  
If you're using the **Django backend** (provided separately), make sure to set the API base URL in your environment:

```global
export function global_base_url(): string {
  const urlLocal = "http://127.0.0.1:8000";
  const serverUrl = "https://...";

  // For now we always return the local URL.
  return urlLocal;
}
```

Axios is pre‑configured – adjust the instance in `src/lib/global.ts` to match your needs.

---

## 📁 Project Structure

```
WebMify-Admin/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Route pages (Dashboard, Projects, Blog, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # API calls (Axios)
│   ├── types/            # TypeScript interfaces
│   └── main.tsx          # Entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 👤 Author

**CyberArcenal** – [cyberarcenal1@gmail.com](mailto:cyberarcenal1@gmail.com)

---

## 📄 License

MIT – free to use and modify.
