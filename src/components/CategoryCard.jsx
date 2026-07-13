import { useNavigate } from "react-router-dom"

function CategoryCard({ name, icon: Icon, color, count }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/products?category=${encodeURIComponent(name)}`)}
      className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white shadow-sm hover:shadow-md cursor-pointer transition group border border-gray-100 hover:border-primary"
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        <Icon size={26} />
      </div>
      <p className="text-sm font-semibold text-gray-700 text-center">{name}</p>
      <p className="text-xs text-gray-400">
        {count !== undefined ? `${count} item${count !== 1 ? "s" : ""}` : "..."}
      </p>
    </div>
  )
}

export default CategoryCard