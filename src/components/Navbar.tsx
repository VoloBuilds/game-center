import { ShoppingCart, User, Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface NavbarProps {
  theme: string;
  toggleTheme: () => void;
}

export function Navbar({ theme, toggleTheme }: NavbarProps) {
  return (
    <nav className="bg-background shadow-md p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ShopClone</h1>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
          <Button variant="ghost">
            <ShoppingCart className="mr-2" size={20} />
            Cart
          </Button>
          <Button variant="ghost">
            <User className="mr-2" size={20} />
            Account
          </Button>
        </div>
      </div>
    </nav>
  )
}
