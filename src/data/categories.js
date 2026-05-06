import { 
  Smartphone, 
  Shirt, 
  Laptop, 
  Headphones, 
  Watch, 
  Home,
  Dumbbell,
  Camera
} from "lucide-react"

const categories = [
  { id: 1, name: "Phones",      icon: Smartphone,  color: "bg-blue-100 text-blue-600",    count: 120 },
  { id: 2, name: "Fashion",     icon: Shirt,        color: "bg-pink-100 text-pink-600",    count: 340 },
  { id: 3, name: "Laptops",     icon: Laptop,       color: "bg-purple-100 text-purple-600",count: 85  },
  { id: 4, name: "Audio",       icon: Headphones,   color: "bg-yellow-100 text-yellow-600",count: 60  },
  { id: 5, name: "Watches",     icon: Watch,        color: "bg-green-100 text-green-600",  count: 95  },
  { id: 6, name: "Home & Living",icon: Home,        color: "bg-red-100 text-red-600",      count: 210 },
  { id: 7, name: "Fitness",     icon: Dumbbell,     color: "bg-orange-100 text-orange-600",count: 75  },
  { id: 8, name: "Cameras",     icon: Camera,       color: "bg-teal-100 text-teal-600",    count: 50  },
]

export default categories