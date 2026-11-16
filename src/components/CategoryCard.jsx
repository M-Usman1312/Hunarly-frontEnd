import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function CategoryCard({ category }) {
  const { name, icon: Icon, count } = category;

  return (
    <Link
      className="category-card"
      to={`/find-workers?category=${encodeURIComponent(name)}`}
      aria-label={`Find a ${name.toLowerCase()} — ${count}`}
    >
      <span className="category-icon">
        <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span className="category-card-copy">
        <strong>{name}</strong>
        <span>{count}</span>
      </span>
      <ArrowUpRight className="category-arrow" size={17} aria-hidden="true" />
    </Link>
  );
}

export default CategoryCard;
