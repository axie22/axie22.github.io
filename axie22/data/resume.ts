export interface Project {
  title: string;
  techStack: string[];
  date: string;
  points: string[];
  github?: string;
  link?: string;
  image?: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  location: string;
  date: string;
  logo: string | null;
  techStack: string[];
  points: string[];
}

export const resumeData = {
  personalInfo: {
    name: "Alexander Xie",
    role: "Systems & ML Engineer",
    contact: {
      email: "alexxie9667@gmail.com",
      linkedin: "https://linkedin.com/in/alexanderxie04",
      github: "https://github.com/axie22",
    },
    bio: "Senior at NYU studying Computer Science and Data Science. I build systems and infrastructure that people depend on — from low-latency real-time pipelines to ML infrastructure and cloud automation.",
  },
  education: [
    {
      school: "New York University",
      degree: "Dual Major in Computer Science and Data Science",
      date: "Aug 2022 - May 2026",
      gpa: "3.7/4.0",
      coursework:
        "LLMs, Software Engineering, Machine Learning, Algorithms, Data Management, Operating Systems, Causal Inference",
    },
  ],
  experience: [
    {
      company: "Amazon",
      role: "Software Development Engineer Intern",
      location: "Boston, MA",
      date: "Jun 2025 - Aug 2025",
      logo: "/amazon.png",
      techStack: ["Bedrock", "Lambda", "DynamoDB", "OpenSearch", "CDK"],
      points: [
        "Built a Bedrock AI agent that automated config generation, reducing creation time by 93% for 400+ developers",
        "Engineered a data pipeline using Lambda, DDB, and OpenSearch to auto validate and process 3K+ configs per day",
        "Published agent to Amazon's package manager with evaluation layer, boosting config correctness by 40% org-wide",
        "Scaled adoption across PXT as teams integrated package to streamline workflows and cut config turnaround by 75%",
      ],
    },
    {
      company: "ColAI",
      role: "Machine Learning Research Intern",
      location: "Remote",
      date: "Jul 2024 - Dec 2024",
      logo: null,
      techStack: ["PyTorch", "Python", "Pandas", "Scikit-learn"],
      points: [
        "Automated ETL pipelines for ingest, cleaning, and feature engineering in PyTorch, cutting runtime by 50%",
        "Developed transformer forecasting pipeline across 30 datasets, improving accuracy 18% and anomaly detection 22%",
      ],
    },
    {
      company: "New York University",
      role: "Student Computer Technician and Developer",
      location: "New York, NY",
      date: "Feb 2024 - Present",
      logo: "/nyu.png",
      techStack: ["Bash", "Linux", "Python", "Networking"],
      points: [
        "Automated security configuration enforcement in Bash across 700+ systems, reducing misconfigurations by 45%",
        "Built monitoring workflows for network reliability, enabling early detection of failure and cutting downtime by 30%",
        "Designed Tisch IT intranet into internal dev platform, improving tool discoverability and team efficiency",
      ],
    },
    {
      company: "Fortinet",
      role: "Software Application Intern",
      location: "Sunnyvale, CA",
      date: "Jun 2023 - Aug 2023",
      logo: "/fortinet.png",
      techStack: ["Python", "Burp Suite", "SAST", "SQL"],
      points: [
        "Detected and remediated 400+ vulnerabilities, preventing XSS, SQL injection, and privilege-escalation attacks",
        "Reproduced 150+ suspected flaws in sandbox environment to verify exploitability and confirm patch success",
        "Partnered with InfoSec to improve scanning coverage and coding patterns, increasing protected codebase by 20%",
      ],
    },
  ] satisfies ExperienceEntry[],
  projects: [
    {
      title: "Orbit",
      techStack: [
        "Next.js",
        "TypeScript",
        "LiveKit",
        "Vertex AI (Gemini)",
        "Docker",
      ],
      date: "Sept 2025 - Present",
      link: "https://orbit-mmos8.ondigitalocean.app/",
      github: "https://github.com/axie22/Orbit",
      image: "/Orbit.png",
      points: [
        "Built a real-time AI tech interviewer using LiveKit for low-latency audio streaming and session orchestration",
        "Designed an end-to-end STT → LLM → TTS pipeline using Vertex AI and ElevenLabs for real-time voice feedback",
        "Implemented context-aware prompting and conversation memory to deliver structured, interview-style guidance",
        "Deployed a containerized Next.js application with a dedicated inference worker to isolate real-time LLM workloads",
      ],
    },
    {
      title: "Chip8 Emulator",
      techStack: ["C++", "SDL2", "CMake", "Emulation"],
      date: "Jan 2025 - Feb 2025",
      github: "https://github.com/axie22/Chip8Emulator",
      image: "/Chip8.png",
      points: [
        "Built a fully functional Chip-8 emulator in C++ implementing all 35 opcodes for accurate ROM execution",
        "Engineered a display system using SDL2 to render a 64×32 framebuffer at 60 Hz with configurable scaling",
        "Implemented precise CPU timing and sound timer logic to ensure authentic gameplay speed and audio feedback",
        "Added debug tooling including register dumps and memory inspection to streamline opcode troubleshooting",
      ],
    },
    {
      title: "Turtl.Bio",
      techStack: [
        "System Architecture",
        "LLMs",
        "Retrieval-Augmented Generation",
        "API Design",
      ],
      date: "Aug 2025 - Present",
      link: "https://turtl-bio-p8aqj.ondigitalocean.app/",
      github: "https://github.com/axie22/Turtl.Bio",
      image: "/Turtl.png",
      points: [
        "Led 15+ customer discovery interviews with pharma and biotech teams to understand regulatory pain points",
        "Leading AI and infra roadmap for a regulatory intelligence platform serving insights from 1,000+ FDA documents",
        "Designing scalable APIs and RAG pipelines to answer regulatory questions from FDA filings",
      ],
    },
    {
      title: "ASLingo",
      techStack: ["Python", "TensorFlow", "MediaPipe", "OpenCV"],
      date: "Feb 2025 - Aug 2025",
      github: "https://github.com/axie22/ASLingo",
      points: [
        "Built a real-time ASL alphabet recognition system using MediaPipe Hands to extract 21 3D hand landmarks per frame",
        "Trained a TensorFlow classifier on labeled gesture frames to recognize 26 ASL letter signs",
        "Engineered an OpenCV video pipeline for end-to-end frame processing with low-latency inference",
        "Implemented a live overlay displaying confidence scores and predicted sign output for interactive feedback",
      ],
    },
    {
      title: "Aura",
      techStack: ["GitHub Apps", "Gemini 1.5 Flash", "Playwright", "Next.js"],
      date: "Feb 2025 - Present",
      github: "https://github.com/axie22/Aura",
      points: [
        "Developed a GitHub App that automatically generates video walkthroughs for UI changes in Pull Requests",
        "Integrated Gemini 1.5 Flash to analyze code diffs and synthesize Playwright scripts for visual verification",
        "Orchestrated a secure, sandboxed execution environment to run generated tests and capture video artifacts",
        "Streamlined code review by embedding visual proof-of-work directly into PR comments, reducing review time",
      ],
    },
  ] satisfies Project[],
  skills: {
    languages: ["C++", "Python", "TypeScript", "Go", "Java", "C", "SQL", "JavaScript"],
    frameworks: [
      "PyTorch",
      "TensorFlow",
      "React",
      "Node.js",
      "MediaPipe",
      "OpenCV",
      "Pandas",
      "Scikit-learn",
      "Linux",
      "Bash",
    ],
    infrastructure: [
      "AWS",
      "Docker",
      "PostgreSQL",
      "Google Cloud",
      "Redis",
      "MongoDB",
      "Cloudant",
    ],
    certifications: [
      {
        name: "AWS Certified Cloud Practitioner",
        image: "/AWS_CCP.png",
        link: "https://www.credly.com/badges/c7405f9d-927b-402f-b089-e96e91d7c3bf/public_url",
      },
      {
        name: "IBM Accelerate Software Developer",
        image: "/IBM_Accelerate.png",
        link: "https://www.credly.com/badges/a6c826a1-7fb7-41e3-bf99-6dd28a9c6df6/public_url",
      },
    ],
  },
  aboutPage: {
    title:
      "Exploring the systems infrastructure that makes machine learning reliable at scale.",
    bio: [
      "I'm a Senior at NYU graduating with a dual major in Computer Science and Data Science. I enjoy building systems and tools that help people, with a focus on machine learning and its applications.",
      "My work is driven by a curiosity for how systems behave at scale and how strong infrastructure unlocks reliable machine learning applications. I'm most excited by problems that sit between systems engineering and applied ML.",
    ],
    philosophy: [
      {
        title: "Systems Under Real-World Constraints",
        description:
          "I'm drawn to learning systems that operate under physical and timing constraints, where decisions must be made quickly and imperfectly. My current work focuses on low-latency applications and distributed systems, and I'm increasingly curious about how similar constraints appear in robotics and embodied systems.",
      },
      {
        title: "ML Infrastructure",
        description:
          "I'm interested in the engineering work that supports machine learning systems beyond the model itself. At Amazon, I worked on automating and hardening configuration workflows that supported ML-backed services, reducing setup time by 93% and removing operational bottlenecks for teams deploying at scale.",
      },
      {
        title: "Human-Centered Interactive Systems",
        description:
          "I care about building software that responds to people's needs. While working on Orbit, I designed systems that coordinate speech recognition, language models, and audio playback under tight latency constraints, so users receive feedback that feels timely and usable rather than delayed or fragmented.",
      },
    ],
  },
};
