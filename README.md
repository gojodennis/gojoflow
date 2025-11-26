# GojoFlow

GojoFlow is a modern, high-performance task management application designed to help you stay in the flow. Built with a keyboard-first approach, it combines AI-powered intelligence, focus tools, and a beautiful glassmorphism UI to enhance your productivity.

![GojoFlow Banner](public/og-image.png)

## ✨ Features

-   **⌨️ Keyboard-First Workflow**: Navigate and manage tasks efficiently using the command menu (`Cmd/Ctrl + K`) without lifting your hands from the keyboard.
-   **🧠 AI-Powered Intelligence**: Smart task parsing and duration extraction to streamline your planning.
-   **🍅 Pomodoro Focus Mode**: Integrated timer to help you maintain focus and manage your energy levels.
-   **⚡ Energy Level Tracking**: Monitor your energy throughout the day to optimize your schedule.
-   **📅 Unified Timeline**: A clear view of your tasks and schedule.
-   **🎨 Stunning UI**: A premium, glassmorphism-inspired design with smooth animations and dark/light mode support.
-   **🔐 Secure Authentication**: Powered by Supabase for reliable and secure user management.

## 🛠️ Tech Stack

-   **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
-   **Backend & Auth**: [Supabase](https://supabase.com/)
-   **Routing**: [React Router](https://reactrouter.com/)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/gojoflow.git
    cd gojoflow
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Set up Environment Variables**

    Create a `.env` file in the root directory and add your Supabase credentials:

    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## 📜 Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the app for production.
-   `npm run lint`: Runs ESLint to check for code quality issues.
-   `npm run preview`: Locally preview the production build.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
