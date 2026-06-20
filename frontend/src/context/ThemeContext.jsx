import { use } from "react";
import { useContext, createContext, useEffect, useState } from "react";

const ThemeContext = createContext(null)

export default function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    })

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode])

    const toggleTheme = () => {
        setDarkMode((currentMode) => !currentMode)
    }

    return(
        <ThemeContext.Provider value = {{darkMode, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}