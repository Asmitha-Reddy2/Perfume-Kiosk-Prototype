import { tv } from 'tailwind-variants';

// Define theme variants for the kiosk using tailwind-variants
export const kioskTheme = tv({
  slots: {
    base: "w-full min-h-screen p-8 transition-colors duration-500",
    card: "bg-card text-card-foreground border rounded-lg shadow-xl transition-all",
    title: "font-bold tracking-tight",
    slider: "accent-indigo-500", // Default accent
    button: "" // Handled by button component
  },
  variants: {
    perfume: {
      // Default theme
      default: {
        base: "bg-background",
        card: "border-border",
      },
      // Ocean Blue Theme
      ocean_blue: {
        base: "bg-gradient-to-br from-blue-950 via-gray-900 to-gray-900",
        card: "border-blue-700/50",
        title: "text-blue-300",
        slider: "accent-blue-500",
      },
      // Rose Mist Theme
      rose_mist: {
        base: "bg-gradient-to-br from-pink-950 via-gray-900 to-gray-900",
        card: "border-pink-700/50",
        title: "text-pink-300",
        slider: "accent-pink-500",
      },
      // Night Amber Theme
      night_amber: {
        base: "bg-gradient-to-br from-amber-950 via-gray-900 to-gray-900",
        card: "border-amber-700/50",
        title: "text-amber-300",
        slider: "accent-amber-500",
      }
    }
  },
  defaultVariants: {
    perfume: "default"
  }
});