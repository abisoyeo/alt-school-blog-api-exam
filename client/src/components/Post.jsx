import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/UserContext";
export default function Post({
  _id,
  title,
  description,
  image,
  createdAt,
  author,
}) {
  const { userInfo } = useContext(UserContext);
  const isAuthor = userInfo?.id?.toString() === author?._id?.toString();

  return isAuthor ? (
    <div className="post">
      <div className="image">
        <Link to={`/author-posts/${_id}`}>
          <img src={image} alt="" />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/author-posts/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author">
            {author.first_name} {author.last_name}
          </a>
          <time>{format(new Date(createdAt), "MMMM d, yyyy h:mm a")}</time>
        </p>
        <Link to={`/author-posts/${_id}`}>
          <p className="summary">{description}</p>
        </Link>
      </div>
    </div>
  ) : (
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
        <Link to={`/post/${_id}`}>
          <p className="summary">{description}</p>
        </Link>
      </div>
    </div>
  );
}
