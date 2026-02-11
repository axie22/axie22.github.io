export const resumeData = {
  personalInfo: {
    name: "Alexander Xie",
    role: "Student and Software Engineer",
    contact: {
      email: "alexxie9667@gmail.com",
      linkedin: "https://linkedin.com/in/alexanderxie04",
      github: "https://github.com/axie22",
    },
    bio: "Senior at NYU studying Computer Science and Data Science. Enjoy building systems and infrastructure that people depend on and can benefit from. Passionate about solving complex problems in systems and ML infra.",
  },
  education: [
    {
      school: "New York University",
      degree: "Dual Major in Computer Science and Data Science",
      date: "Aug 2022 - May 2026",
      gpa: "3.7/4.0",
      coursework:
        "LLMS, Software Engineering, ML, Algorithms, Data Management, OS, Causal Inference",
    },
  ],
  experience: [
    {
      company: "Amazon",
      role: "Software Development Engineer Intern",
      location: "Boston, MA",
      date: "Jun 2025 - Aug 2025",
      logo: "/amazon.png",
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
      logo: null, // Will use initials
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
      points: [
        "Detected and remediated 400+ vulnerabilities, preventing XSS, SQL injection, and privilege-escalation attacks",
        "Reproduced 150+ suspected flaws in sandbox environment to verify exploitability and confirm patch success",
        "Partnered with InfoSec to improve scanning coverage and coding patterns, increasing protected codebase by 20%",
      ],
    },
  ],
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
        "Designed an end-to-end STT -> LLM -> TTS pipeline using Vertex AI and ElevenLabs for real-time voice feedback",
        "Implemented context-aware prompting and conversation memory to deliver structured, interview-style guidance",
        "Deployed a containerized Next.js application with a dedicated inference worker to isolate real-time LLM workloads",
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
        "Developed a Minecraft server plugin to entertain kids during free time for a previous job",
        "Published plugin to websites gaining 2K+ downloads and an average 4.5/5-star review",
        "Implemented continuous delivery using TravisCI to build the plugin upon new a release",
        "Collaborated with Minecraft server administrators to suggest features and get feedback about the plugin",
      ],
    },
    {
      title: "Chip8 Emulator",
      techStack: ["C++", "SDL2", "Emulation", "CMake"],
      date: "Jan 2025 - Feb 2025",
      link: "https://github.com/axie22/Chip8Emulator",
      image: "/Chip8.png",
      points: [
        "Built a fully functional Chip-8 emulator in C++ implementing all 35 opcodes for accurate ROM execution",
        "Engineered a dynamic display system using SDL2 to render graphics at 60Hz with configurable scaling",
        "Implemented precise CPU timing and sound timer logic to ensure authentic gameplay speed and audio feedback",
        "Added debug features including register dumps and memory views to streamline opcode troubleshooting",
      ],
    },
    {
      title: "Aura",
      techStack: ["GitHub Apps", "Gemini 1.5 Flash", "Playwright", "Next.js"],
      date: "Feb 2025 - Present",
      link: "https://github.com/axie22/Aura",
      // image: "/Aura.png",
      points: [
        "Developed a GitHub App that automatically generates video walkthroughs for UI changes in Pull Requests",
        "Integrated Gemini 1.5 Flash to analyze code diffs and synthesize Playwright scripts for visual verification",
        "Orchestrated a secure, sandboxed execution environment to run generated tests and capture video artifacts",
        "Streamlined code review by embedding visual proof-of-work directly into PR comments, reducing review time",
      ],
    },
  ],
  skills: {
    languages: ["Python", "Java", "Typescript", "Go", "C", "SQL", "Javascript"],
    devTools: [
      "React",
      "Node.js",
      "Tensorflow",
      "PyTorch",
      "Pandas",
      "Scikit-learn",
      "MediaPipe",
      "OpenCV",
      "Linux",
      "Bash",
    ],
    cloudDevOps: [
      "AWS",
      "Google Cloud",
      "Docker",
      "PostgreSQL",
      "MongoDB",
      "Cloudant",
      "Redis",
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
