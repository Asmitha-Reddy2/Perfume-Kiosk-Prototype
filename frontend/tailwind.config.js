/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base dark theme colors
        background: 'hsl(222 47% 11%)', // Shadcn Dark "background"
        foreground: 'hsl(210 40% 98%)', // Shadcn Dark "foreground"
        card: 'hsl(222 47% 14%)',       // Custom darker card
        'card-foreground': 'hsl(210 40% 98%)',
        popover: 'hsl(222 47% 11%)',
        'popover-foreground': 'hsl(210 40% 98%)',
        primary: 'hsl(210 40% 98%)',
        'primary-foreground': 'hsl(222 47% 11%)',
        secondary: 'hsl(217 33% 17%)',
        'secondary-foreground': 'hsl(210 40% 98%)',
        border: 'hsl(217 33% 25%)',
        input: 'hsl(217 33% 25%)',
        ring: 'hsl(213 94% 68%)', // Shadcn Dark "ring"
      },
      borderRadius: {
        lg: `0.5rem`,
        md: `calc(0.5rem - 2px)`,
        sm: "calc(0.5rem - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-strong": {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.7, transform: 'scale(1.05)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-strong": "pulse-strong 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
}