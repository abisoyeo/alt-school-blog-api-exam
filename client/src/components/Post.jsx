// import { formatISO9075 } from "date-fns";
// import { Link } from "react-router-dom";

export default function Post() {
  return (
    <div className="post">
      <div className="image">
        <img src="https://images.unsplash.com/photo-1546074177-ffdda98d214f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
      </div>
      <div className="texts">
        <h2>Lorem ipsum, dolor sit amet consectetur adipisicing.</h2>
        <p className="info">
          <a className="author">David Bowers</a>
          <time>2024-01-06 16:45</time>
        </p>
        <p className="summary">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
          assumenda natus fugit eius et nemo eveniet odio, id porro autem.
          Necessitatibus reiciendis vel exercitationem odio excepturi expedita,
          officiis at nihil? Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Labore adipisci rerum magni, incidunt consectetur accusamus
          aliquid illo, assumenda magnam natus doloremque error vitae. Eius,
          possimus!lorem25 Lorem ipsum dolor sit, amet consectetur adipisicing
          elit. Voluptatibus voluptate eum, unde saepe mollitia quibusdam
          aliquid? Recusandae totam exercitationem eaque enim dolore similique
          dolorum ipsum?
        </p>
      </div>
    </div>
  );
}
