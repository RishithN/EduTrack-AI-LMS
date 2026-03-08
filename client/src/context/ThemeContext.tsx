import { createContext, useContext, useEffect, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    toggleTheme: () => { },
    isDark: true,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    useEffect(() => {
        const root = document.documentElement;
        root.classList.add('dark');
        root.classList.remove('light');
        localStorage.setItem('edutrack-theme', 'dark');
    }, []);

    const toggleTheme = () => { }; // No-op since light mode is removed

    return (
        <ThemeContext.Provider value={{ theme: 'dark', toggleTheme, isDark: true }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
