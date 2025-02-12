import { Home, ShoppingBag, Shirt, Watch, Smartphone } from 'lucide-react'
import { cn } from "@/lib/utils"

const categories = [
  { name: 'All', icon: Home },
  { name: 'Clothing', icon: Shirt },
  { name: 'Accessories', icon: Watch },
  { name: 'Electronics', icon: Smartphone },
]

export function Sidebar() {
  return (
    <aside className={cn(
      "w-64 h-screen p-4",
      "bg-background border-r border-border",
      "transition-colors duration-300"
    )}>
      <h2 className="text-xl font-bold mb-4 text-foreground">Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.name} className="mb-2 p-2">
            <a href="#" className={cn(
              "flex items-center",
              "text-muted-foreground hover:text-foreground",
              "transition-colors duration-200"
            )}>
              <category.icon className="mr-2" size={20} />
              {category.name}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
