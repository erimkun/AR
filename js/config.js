/**
 * Tailwind CSS Configuration
 * Shared across all pages
 */
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#D0BB95",
                "background-light": "#f7f7f6",
                "background-dark": "#1d1a15",
                "surface-dark": "#1a2332"
            },
            fontFamily: {
                display: ["Space Grotesk", "sans-serif"],
                body: ["Space Grotesk", "sans-serif"]
            },
            borderRadius: {
                DEFAULT: "0.25rem",
                lg: "0.5rem",
                xl: "0.75rem",
                full: "9999px"
            },
            animation: {
                float: "float 6s ease-in-out infinite"
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-20px)" }
                }
            }
        }
    }
};
