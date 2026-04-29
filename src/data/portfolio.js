export const profile = {
  name: "Priyanka Khasa",
  role: "Full Stack, Android, and AI Developer",
  specialty: "B.Tech ECE student building MERN, Android, AI, and embedded product experiences",
  email: "priyankakhasa937@gmail.com",
  phone: "+91 8168429699",
  location: "India",
  college: "BPS Mahila Vishwavidyalaya, Sonipat",
  summary:
    "I design and build practical full-stack, Android, AI, and embedded systems with clear interfaces, reliable backends, and product thinking shaped by internships, hackathons, and real projects.",
  highlights: ["Open to internships", "Full-stack + Android", "AI product builder"],
  stats: [
    ["8.65", "B.Tech CGPA"],
    ["2024-28", "ECE degree"],
    ["2", "Internships"],
    ["30+", "Tools in ClassConnect"],
  ],
  links: [
    ["GitHub", "https://github.com/Priyanka-Khasa"],
    ["LinkedIn", "https://linkedin.com/in/priyanka-khasa"],
    ["Resume", "https://drive.google.com/file/d/12nFl4d8jqQor7WHHLaHvEKyqXzxX-gix/view?usp=sharing"],
  ],
};

const wanderlustImage = new URL("../../images/Wonderlust.png", import.meta.url).href;
const classConnectImage = new URL("../../images/ClassConnect.png", import.meta.url).href;
const gestraImage = new URL("../../images/GuestureOs.png", import.meta.url).href;

export const featuredProjects = [
  {
    title: "Gestra",
    image: gestraImage,
    type: "Gesture-controlled desktop workspace",
    period: "Mar 2026 - Present",
    copy:
      "A real-time touchless desktop interface using MediaPipe hand landmarks, OpenCV, WebSocket communication, and a React dashboard for FPS, confidence, and live action feedback.",
    stack: ["Python", "OpenCV", "MediaPipe", "React", "Node", "WebSocket"],
    links: [["GitHub", "https://github.com/Priyanka-Khasa"]],
  },
  {
    title: "ClassConnect",
    image: classConnectImage,
    type: "AI-powered Android student platform",
    period: "Nov 3 - Dec 28, 2025",
    copy:
      "A Kotlin and Jetpack Compose student platform with group chat, smart task dashboard, Deep Focus Mode, AI-assisted resume builder, Room DB, and 30+ ECE/developer tools.",
    stack: ["Kotlin", "Jetpack Compose", "MVVM", "Room DB", "On-Device AI"],
    links: [["GitHub", "https://github.com/Priyanka-Khasa"]],
  },
  {
    title: "Wanderlust",
    image: wanderlustImage,
    type: "Full-stack MERN travel platform",
    period: "Feb 24 - Apr 21, 2025",
    copy:
      "An Airbnb-style travel product with CRUD listings, JWT/Passport authentication, Cloudinary image storage, Mapbox geolocation, MongoDB Atlas, and deployment-ready backend structure.",
    stack: ["Node", "Express", "MongoDB", "Cloudinary", "Mapbox", "Passport.js"],
    links: [
      ["Live", "https://wonderlust-by34.onrender.com/listings"],
      ["GitHub", "https://github.com/Priyanka-Khasa"],
    ],
  },
  {
    title: "MediCap",
    type: "Offline-first medicine safety app",
    period: "Jan 2 - Mar 10, 2026",
    copy:
      "An Android healthcare app for medicine identification and dosage guidance, designed for low-connectivity and rural healthcare scenarios.",
    stack: ["Kotlin", "Jetpack Compose", "Room Database", "Offline-first UX"],
    links: [["GitHub", "https://github.com/Priyanka-Khasa"]],
  },
];

export const skillGroups = [
  ["Languages", "Java, JavaScript, Kotlin, C, C++, Python"],
  ["Web and Backend", "React.js, Node.js, Express.js, REST APIs, MongoDB, SQL, HTML5, CSS3, Tailwind CSS"],
  ["Android and AI", "Jetpack Compose, MVVM, Coroutines, MediaPipe, RunAnywhere On-Device AI SDK"],
  ["ECE and Embedded", "Arduino ATmega328P, MATLAB, Proteus, Tinkercad, LTspice, KiCad, ADC/DAC, UART, I2C, SPI"],
  ["Tools", "Git, GitHub, Postman, Cloudinary, Mapbox, Android Studio, Firebase, VS Code"],
];

export const experienceItems = [
  {
    role: "Backend Developer Intern",
    company: "Vishvena Techno Solutions",
    period: "Oct 2025 - Feb 2026",
    details:
      "Built RESTful APIs and backend services with Node.js, Express.js, MongoDB, JWT authentication, Mongoose ORM, validation middleware, and scalable production patterns.",
  },
  {
    role: "Software Development Intern",
    company: "Realfy Oasis",
    period: "April 2025",
    details:
      "Built an AI-powered fitness evaluation web app with React.js and MediaPipe Pose Detection, real-time rep counting, posture scoring, voice feedback, and a 30fps client-side ML pipeline.",
  },
];

export const places = [
  {
    id: "home",
    nav: "Home",
    title: "Engineering useful products with full-stack, Android, and AI craft.",
    kicker: "Portfolio Island",
    position: [-12, 0, 18],
    color: "#f6b84f",
    copy:
      "Welcome to my interactive portfolio island. The world is playful, but the work is serious: full-stack systems, Android platforms, AI interfaces, and embedded ideas built around real user needs.",
    items: [
      "B.Tech ECE student at BPS Mahila Vishwavidyalaya, Sonipat with an 8.65 CGPA.",
      "Backend Developer Intern at Vishvena Techno Solutions and Software Development Intern at Realfy Oasis.",
      "Projects span MERN, Android, AI pose/gesture systems, offline-first healthcare, and embedded tooling.",
    ],
    links: profile.links,
  },
  {
    id: "education",
    nav: "Education",
    title: "A library of engineering foundations",
    kicker: "Library",
    position: [-17, 0, -2],
    color: "#7dd8ff",
    copy:
      "My engineering foundation connects software product development with hardware-aware thinking, embedded systems, and communication fundamentals.",
    items: [
      "B.Tech in Electronics and Communication Engineering, BPS Mahila Vishwavidyalaya, Sonipat: CGPA 8.65, 2024-2028.",
      "Class XII, DBM Public School, HBSE: CGPA 8.67, 2024.",
      "Class X, DBM Public School, HBSE: CGPA 10.00, 2022.",
    ],
  },
  {
    id: "projects",
    nav: "Projects",
    title: "Selected products and experiments",
    kicker: "Selected Build Work",
    position: [17, 0, -3],
    color: "#72eef4",
    copy:
      "These projects show how I move from idea to interface to backend behavior, with attention to deployment, real-time AI, mobile architecture, and low-connectivity use cases.",
    items: featuredProjects.map((project) => `${project.title}: ${project.type}.`),
    links: [
      ["Wanderlust Live", "https://wonderlust-by34.onrender.com/listings"],
      ["GitHub Projects", "https://github.com/Priyanka-Khasa"],
    ],
  },
  {
    id: "skills",
    nav: "Skills",
    title: "Technical toolkit with range",
    kicker: "Technical Toolkit",
    position: [-28, 0, -30],
    color: "#9edb66",
    copy:
      "My toolkit covers full-stack web, Android architecture, AI interaction, and ECE/embedded development, with hands-on tools from API testing to circuit simulation.",
    items: skillGroups.map(([label, value]) => `${label}: ${value}.`),
  },
  {
    id: "achievements",
    nav: "Wins",
    title: "Milestones and momentum",
    kicker: "Achievements",
    position: [14, 0, -24],
    color: "#ffd36c",
    copy:
      "The strongest signal is momentum: internships, hackathon recognition, certifications, academics, and projects that turn learning into useful products.",
    items: [
      "Grand Finalist at Vibestate Hackathon 2025 and Singularity Hackathon Finalist for ClassConnect.",
      "Google Cloud Skills Boost: Generative AI Explorer, 2025.",
      "DSA with Java and Full-Stack MERN from Apna College, 2025.",
      "Python Programming from NIELIT Lucknow: Grade S, 60 hours, Jun-Jul 2025.",
      "Arduino Programming from Sofcon India / NSDC, Jun-Jul 2025, plus IBM Data Analytics.",
      "Awards include Best Academic Performance twice, Vedic Mathematics Medal, Poster Making, and Shlok Reciting.",
    ],
  },
  {
    id: "experience",
    nav: "Practice",
    title: "Internships and production practice",
    kicker: "Experience",
    position: [0, 0, -35],
    color: "#ff9874",
    copy:
      "I like projects where the interface, backend, AI pipeline, and real-world constraints all matter. My internships gave me production-style practice across APIs and client-side AI.",
    items: experienceItems.map((item) => `${item.role}, ${item.company} (${item.period}): ${item.details}`),
  },
  {
    id: "contact",
    nav: "Contact",
    title: "Let us build something useful.",
    kicker: "Post Office",
    position: [26, 0, -16],
    color: "#ff9fc0",
    copy:
      "Reach out for internships, projects, collaborations, or a focused technical conversation.",
    items: [
      `Email: ${profile.email}`,
      `Phone: ${profile.phone}`,
      "LinkedIn: linkedin.com/in/priyanka-khasa",
      "GitHub: github.com/Priyanka-Khasa",
    ],
    links: [
      ["Email", `mailto:${profile.email}`],
      ["LinkedIn", "https://linkedin.com/in/priyanka-khasa"],
      ["GitHub", "https://github.com/Priyanka-Khasa"],
    ],
    hasLetter: true,
  },
];
