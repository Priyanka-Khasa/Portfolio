import { Link } from "react-router-dom";
import "./MyWorks.css";
import { config } from "../config";
import { MdArrowOutward, MdArrowBack } from "react-icons/md";
import { FaGithub } from "react-icons/fa6";

interface ProjectLink {
  github?: string;
  demo?: string;
}

interface ExtendedProject {
  id: number;
  title: string;
  category: string;
  technologies: string;
  image: string;
  description: string;
  links?: ProjectLink;
}

const allProjects: ExtendedProject[] = [
  {
    ...config.projects[0],
    links: {
      github: "https://github.com/Priyanka-Khasa/GestureOS",
    },
  },
  {
    ...config.projects[1],
    links: {
      github: "https://github.com/Priyanka-Khasa/ClassConnect",
    },
  },
  {
    ...config.projects[2],
    links: {
      github: "https://github.com/Priyanka-Khasa/Wanderlust",
      demo: "https://wanderlust-app.onrender.com",
    },
  },
  {
    ...config.projects[3],
    links: {
      github: "https://github.com/Priyanka-Khasa/MediCap",
    },
  },
  {
    id: 5,
    title: "AI Fitness Evaluator",
    category: "AI / Computer Vision / Web",
    technologies: "React.js, MediaPipe Pose Detection, JavaScript, WebRTC",
    image: "/images/Gestra.png",
    description:
      "Real-time AI fitness evaluation app with MediaPipe Pose Detection, rep counting, posture scoring, voice feedback, and a 30fps client-side ML inference pipeline.",
    links: {
      github: "https://github.com/Priyanka-Khasa",
    },
  },
];

const MyWorks = () => {
  return (
    <div className="myworks-page">
      <div className="myworks-header">
        <Link to="/" className="back-link" data-cursor="disable">
          <MdArrowBack /> Back
        </Link>
        <h1>
          All <span>Works</span>
        </h1>
        <p>A collection of projects I've built and shipped</p>
      </div>

      <div className="myworks-grid">
        {allProjects.map((project) => (
          <div className="mywork-card" key={project.id}>
            <div className="mywork-image">
              <img
                src={project.image}
                alt={project.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).parentElement!.classList.add(
                    "no-image"
                  );
                }}
              />
              <div className="mywork-image-overlay"></div>
            </div>
            <div className="mywork-info">
              <div className="mywork-meta">
                <span className="mywork-category">{project.category}</span>
              </div>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <div className="mywork-tech">
                {project.technologies.split(", ").map((tech, i) => (
                  <span key={i} className="mywork-tag">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mywork-links">
                {project.links?.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mywork-link"
                    data-cursor="disable"
                  >
                    <FaGithub /> GitHub
                  </a>
                )}
                {project.links?.demo && (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mywork-link mywork-link-demo"
                    data-cursor="disable"
                  >
                    <MdArrowOutward /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="myworks-footer">
        <p>
          More on{" "}
          <a
            href={config.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="disable"
          >
            GitHub <MdArrowOutward />
          </a>
        </p>
        <Link to="/" data-cursor="disable" className="back-home-btn">
          ← Back to Portfolio
        </Link>
      </div>
    </div>
  );
};

export default MyWorks;
