import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  link?: string;
}

const WorkImage = (props: Props) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="work-image">
      <a
        className="work-image-in"
        href={props.link || "#"}
        target={props.link ? "_blank" : "_self"}
        data-cursor="disable"
      >
        {props.link && (
          <div className="work-link">
            <MdArrowOutward />
          </div>
        )}
        {!imgError ? (
          <img
            src={props.image}
            alt={props.alt}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="work-image-placeholder">
            <span>{props.alt}</span>
          </div>
        )}
      </a>
    </div>
  );
};

export default WorkImage;
