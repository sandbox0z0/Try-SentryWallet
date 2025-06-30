# 🛡️ SentryWallet

<div align="center">

**A lightweight and intuitive browser-based wallet interface for interacting with decentralized applications (dApps)**

[![Live Preview](https://img.shields.io/badge/🌐_Live_Preview-Visit_App-blue?style=for-the-badge)](https://sentrywallet.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/📦_GitHub-Repository-black?style=for-the-badge)](https://github.com/ghatak0982/SentryWallet)

Built with **React** • **Supabase** • **Tailwind CSS** • **CRACO**

</div>

---

## ✨ Features

<table>
<tr>
<td>🔐</td>
<td><strong>Secure Authentication</strong><br/>Supabase authentication with seamless Google login integration</td>
</tr>
<tr>
<td>🎨</td>
<td><strong>Modern UI Design</strong><br/>Clean interface inspired by MetaMask with Tailwind CSS styling</td>
</tr>
<tr>
<td>⚡</td>
<td><strong>Fast & Responsive</strong><br/>Built with Create React App (CRA) and CRACO for optimal performance</td>
</tr>
<tr>
<td>🧩</td>
<td><strong>Beautiful Icons</strong><br/>Lucide Icons for consistent and elegant visual elements</td>
</tr>
<tr>
<td>🌍</td>
<td><strong>Multi-page Navigation</strong><br/>React Router DOM for smooth page transitions</td>
</tr>
<tr>
<td>💨</td>
<td><strong>Smooth Animations</strong><br/>Framer Motion for delightful user interactions</td>
</tr>
<tr>
<td>🧠</td>
<td><strong>Session Management</strong><br/>Intelligent Supabase session handling and secure token storage</td>
</tr>
</table>

---

## 🚀 Quick Start

### 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** `≥ 16.x` installed
- **Yarn** or **npm** package manager
- **Supabase project** with credentials ready

### 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ghatak0982/SentryWallet.git
   cd SentryWallet/frontend
   ```

2. **Install dependencies**
   ```bash
   # Using yarn (recommended)
   yarn install
   
   # Or using npm
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the frontend root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Configure Supabase**
   - Enable Google authentication: `Authentication → Providers → Google`
   - Add your redirect URL (e.g., `https://sentrywallet.vercel.app/`)

5. **Start development server**
   ```bash
   yarn start
   # or
   npm start
   ```

---

## 📜 Available Scripts

<div align="center">

| Command | Description |
|---------|-------------|
| `yarn start` | 🚀 Run development server at `http://localhost:3000` |
| `yarn build` | 📦 Build optimized production bundle |
| `yarn test` | 🧪 Launch interactive test runner |
| `yarn eject` | ⚠️ Expose build configuration (irreversible) |

</div>

---

## 🛠️ Tech Stack

<div align="center">

| Frontend | Backend & Auth | Styling | Tools |
|----------|----------------|---------|-------|
| ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react) | ![Supabase](https://img.shields.io/badge/Supabase-v2-3ECF8E?style=flat-square&logo=supabase) | ![Tailwind](https://img.shields.io/badge/Tailwind-3.0-06B6D4?style=flat-square&logo=tailwindcss) | ![CRACO](https://img.shields.io/badge/CRACO-Latest-FF6B6B?style=flat-square) |
| ![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=flat-square&logo=reactrouter) | | ![Lucide](https://img.shields.io/badge/Lucide_Icons-Latest-000000?style=flat-square) | ![Framer Motion](https://img.shields.io/badge/Framer_Motion-Latest-0055FF?style=flat-square&logo=framer) |

</div>

---

## 📁 Project Structure

```
SentryWallet/
├── 📁 frontend/
│   ├── 📁 public/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   ├── 📁 pages/
│   │   ├── 📁 utils/
│   │   └── 📄 App.js
│   ├── 📄 package.json
│   ├── 📄 craco.config.js
│   └── 📄 tailwind.config.js
├── 📄 README.md
└── 📄 LICENSE
```

---

## 🚀 Deployment

### Deploy with Vercel (Recommended)

1. **Fork/Clone** the repository
2. **Connect** to Vercel and set project root as `frontend`
3. **Configure** build settings:
   - **Build Command:** `yarn build`
   - **Output Directory:** `build`
4. **Add environment variables** in Vercel project settings
5. **Deploy** 🎉

### Deploy with Netlify

1. **Build** the project: `yarn build`
2. **Upload** the `build` folder to Netlify
3. **Configure** environment variables
4. **Set** redirects for React Router

---

## ⚠️ Troubleshooting

<details>
<summary><strong>🔧 Authentication Issues</strong></summary>

- Verify Google OAuth is enabled in Supabase
- Check redirect URLs match your deployment URL
- Ensure environment variables are correctly set
- Redeploy after configuration changes

</details>

<details>
<summary><strong>🌐 Build/Deployment Issues</strong></summary>

- Clear node_modules and reinstall dependencies
- Check Node.js version compatibility
- Verify all environment variables are set
- Check build logs for specific error messages

</details>

---

## 📚 Resources & Documentation

<div align="center">

| Resource | Link |
|----------|------|
| 📖 **Supabase Docs** | [supabase.com/docs](https://supabase.com/docs) |
| ⚛️ **React Documentation** | [reactjs.org/docs](https://reactjs.org/docs) |
| 🏗️ **Create React App** | [create-react-app.dev/docs](https://create-react-app.dev/docs) |
| 🎨 **Tailwind CSS** | [tailwindcss.com/docs](https://tailwindcss.com/docs) |
| 🔧 **CRACO** | [github.com/dilanx/craco](https://github.com/dilanx/craco) |

</div>

---

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. **Fork** the project
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request


<sub>Built with ❤️ by [ghatak0982 and team](https://github.com/ghatak0982)</sub>

**⭐ Star this repo if you find it helpful!**

</div>
