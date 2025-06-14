# 📝 Kanban Board (Vue 3)

[![Vue 3](https://img.shields.io/badge/Vue-3.x-brightgreen?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Pinia](https://img.shields.io/badge/Pinia-Store-yellow?logo=pinia&logoColor=white)](https://pinia.vuejs.org/)
[![Deployed on Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-Deployed-orange?logo=cloudflare&logoColor=white)](https://vue-kanban.pages.dev/)
[![Live Demo](https://img.shields.io/badge/Demo-Online-green?style=flat-square)](https://vue-kanban.pages.dev/)

A fully-functional **Kanban board application** built entirely with **Vue 3** — no UI libraries, fully custom components, clean code structure and feature-complete functionality.

![image](https://github.com/user-attachments/assets/dc66682b-30a3-4ae7-a1c6-afd876e50688)

---

## 🔗 Live Demo

👉 [**Try the Kanban Board here**](https://vue-kanban.pages.dev/)

---

## 🚀 Features

### Board Actions
- ✅ **New Column** — add new columns dynamically
- 🔀 **Shuffle Columns** — randomize column order
- 🔀 **Shuffle Cards** — randomize cards within columns
- 🔒 **Disable Editing** — globally lock editing mode

### Column Management
- ➕ Add columns via `Board Actions → New Column`
- ✏️ Rename columns with `contenteditable` (save on Enter)
- ❌ Delete columns (`Delete Column`)
- 🔐 Disable editing for all columns with `Disable Editing`
- 🔢 Sort columns alphabetically (`Sort`)
- 🗑️ Clear all columns (`Clear All`)

### Card Management
- ➕ Add new cards via `New Card` button (confirm with Enter)
- ✏️ Edit cards on double-click
  - Edit both `title` and `description` via `contenteditable`
  - Buttons `Save Changes` and `Cancel` appear during editing
  - `Save` button disabled if no changes detected
- ❌ Delete cards via right-click (`contextmenu`)

### Extra Features
- ✅ **Three default columns**: TODO, In Progress, Done
- ✅ Custom hover, active, and focus states for better UX
- ✅ Custom sorting logic for cards within columns
- ✅ Persistent state saving (optional)
- ✅ Fully custom **Drag & Drop** — no external libraries used

---

## 🛠️ Tech Stack

- ⚡ **Vue 3 (Composition API)**
- ⚡ **TypeScript**
- ⚡ **Pinia** for state management
- ⚡ Fully custom UI, no external UI libraries

---
