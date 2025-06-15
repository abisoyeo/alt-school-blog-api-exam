import { formatISO9075, format } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({
  _id,
  title,
  description,
  image,
  createdAt,
  author,
}) {
  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={image} alt="" />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>

        <p className="info">
          <a className="author">
            {author.first_name} {author.last_name}
          </a>
          <time>{format(new Date(createdAt), "MMMM d, yyyy h:mm a")}</time>
        </p>
        <p className="summary">{description}</p>
      </div>
    </div>
  );
}
