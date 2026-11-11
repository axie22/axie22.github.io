export type ProjectCategory = "LLM systems" | "Applied ML" | "Systems";

export interface Project {
  title: string;
  techStack: string[];
  date: string;
  /** Full bullets, kept for reference. The site shows `summary` instead. */
  points: string[];
  github?: string;
  /** One-sentence summary used in the card header / list row. */
  summary: string;
  /** Only featured projects render as cards; everything else is a list row. */
  featured?: {
    kind: string; // e.g. "Real-time voice agent"
    architecture: string[]; // rendered as "a → b → c"
    architectureNote?: string; // one dim sentence under the pipeline
    howItWorks: string;
  };
  /** Filter category for the "More projects" list. */
  category: ProjectCategory;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  location: string;
  date: string;
  logo: string | null;
  /** Zoom for logos with a lot of built-in padding (fills the timeline tile). Default 1. */
  logoScale?: number;
  techStack: string[];
  points: string[];
  /** Short headline result, shown in amber under the date. Omit to show nothing. */
  highlight?: string;
}

export const resumeData = {
  personalInfo: {
    name: "Alexander Xie",
    role: "Software Engineer",
    contact: {
      email: "alexxie9667@gmail.com",
      linkedin: "https://linkedin.com/in/alexanderxie04",
      github: "https://github.com/axie22",
    },
    bio: "Senior at NYU studying Computer Science and Data Science. Building the systems and infrastructure that people depend on.",
  },
  education: [
    {
      school: "New York University",
      degree: "Dual Major in Computer Science and Data Science",
      date: "Aug 2022 - May 2026",
      coursework:
        "LLMs, Software Engineering, Machine Learning, Algorithms, Data Management, Operating Systems, Causal Inference",
    },
  ],
  experience: [
    {
      company: "IBM",
      role: "Software Engineer",
      location: "New York, NY",
      date: "Jun 2026 - Present",
      logo: "/ibm.png",
      logoScale: 1.3,
      techStack: ["Python", "watsonx.data", "Spark", "Presto", "dbt", "Airflow", "Confluent", "Langfuse"],
      points: [
        "Building AI agents and data pipelines on the Nexus Squad (Agentic AI & Workflow Automation)",
      ],
    },
    {
      company: "Amazon",
      role: "Software Development Engineer Intern",
      location: "Boston, MA",
      date: "Jun 2025 - Aug 2025",
      logo: "/amazon.png",
      highlight: "93% faster config creation",
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
      highlight: "+18% forecast accuracy",
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
      date: "Feb 2024 - May 2026",
      logo: "/nyu.png",
      highlight: "45% fewer misconfigurations",
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
      highlight: "400+ vulnerabilities fixed",
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
      github: "https://github.com/axie22/Orbit",
      summary:
        "A real-time AI technical interviewer you talk to. It listens, keeps track of the conversation, and answers out loud.",
      category: "LLM systems",
      featured: {
        kind: "Real-time voice agent",
        architecture: ["LiveKit audio", "speech-to-text", "Gemini (Vertex AI)", "ElevenLabs TTS", "LiveKit audio"],
        architectureNote:
          "LLM calls run in a dedicated inference worker, separate from the Next.js app, so real-time audio never waits on the UI.",
        howItWorks:
          "Context-aware prompting with conversation memory, so it gives structured, interview-style guidance instead of one-off answers.",
      },
      points: [
        "Built a real-time AI tech interviewer using LiveKit for low-latency audio streaming and session orchestration",
        "Designed an end-to-end STT → LLM → TTS pipeline using Vertex AI and ElevenLabs for real-time voice feedback",
        "Implemented context-aware prompting and conversation memory to deliver structured, interview-style guidance",
        "Deployed a containerized Next.js application with a dedicated inference worker to isolate real-time LLM workloads",
      ],
    },
    {
      // TODO(alex): new name
      title: "Aura",
      techStack: ["GitHub Apps", "Gemini 1.5 Flash", "Playwright", "Next.js"],
      date: "Feb 2025 - Present",
      github: "https://github.com/axie22/Aura",
      summary:
        "A GitHub App that records a video of your UI change actually working and posts it on the pull request.",
      category: "LLM systems",
      featured: {
        kind: "Agentic code review",
        architecture: ["PR webhook", "Gemini reads the diff", "writes a Playwright script", "sandboxed run", "video posted to the PR"],
        howItWorks:
          "Reviewers get visual proof instead of “trust me, the button works”, with tests generated from the diff rather than written by hand.",
      },
      points: [
        "Developed a GitHub App that automatically generates video walkthroughs for UI changes in Pull Requests",
        "Integrated Gemini 1.5 Flash to analyze code diffs and synthesize Playwright scripts for visual verification",
        "Orchestrated a secure, sandboxed execution environment to run generated tests and capture video artifacts",
        "Streamlined code review by embedding visual proof-of-work directly into PR comments, reducing review time",
      ],
    },
    {
      title: "LLM Inference Engineering",
      techStack: ["PyTorch", "CUDA", "Jupyter"],
      // TODO(alex): confirm the start date (taken from the repo's creation date).
      date: "Apr 2026 - Present",
      github: "https://github.com/axie22/llm-inference-engineering",
      summary:
        "An 8-week workshop on LLM inference: KV caching, FlashAttention, batching, quantization, and serving, with lecture notes and Jupyter labs.",
      category: "LLM systems",
      points: [],
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
      github: "https://github.com/axie22/Turtl.Bio",
      summary:
        "Regulatory intelligence for biotech: RAG over 1,000+ FDA documents, shaped by 15+ customer discovery interviews.",
      category: "LLM systems",
      points: [
        "Led 15+ customer discovery interviews with pharma and biotech teams to understand regulatory pain points",
        "Leading AI and infra roadmap for a regulatory intelligence platform serving insights from 1,000+ FDA documents",
        "Designing scalable APIs and RAG pipelines to answer regulatory questions from FDA filings",
      ],
    },
    {
      title: "SignalFeed",
      techStack: [
        "Python",
        "FastAPI",
        "Next.js",
        "PostgreSQL",
        "Ollama",
        "Docker",
      ],
      date: "Mar 2026 - Present",
      github: "https://github.com/axie22/DailyNews",
      summary:
        "ML news aggregator that scrapes arXiv, Hugging Face, RSS, and X every 6 hours, dedupes, and summarizes locally with Ollama.",
      category: "LLM systems",
      points: [
        "Built an ML news aggregator with scheduled scraping from arXiv, Hugging Face, RSS feeds, and X/Twitter API",
        "Engineered a pipeline that deduplicates articles, summarizes them via local Ollama models, and stores in Postgres",
        "Implemented APScheduler for automated 6-hour pipeline runs with cost-managed API usage and hard monthly caps",
        "Designed a Next.js frontend styled like TLDR with filtering, tagging, and pagination for curated ML content",
      ],
    },
    {
      title: "Gauge",
      techStack: [
        "Next.js 16",
        "TypeScript",
        "Ollama",
        "PostgreSQL",
        "Tailwind CSS",
      ],
      date: "Mar 2026 - Present",
      github: "https://github.com/axie22/Gauge",
      summary:
        "Training dashboard over Hevy and WHOOP data with ACWR, plateau detection, and local-LLM coaching.",
      category: "Applied ML",
      points: [
        "Built a personal training intelligence dashboard that connects to Hevy workout history and WHOOP biometric data",
        "Engineered a full analytics pipeline with ACWR calculations, plateau detection, and session quality scoring",
        "Implemented AI coaching powered by local Ollama models with complete training context for personalized guidance",
        "Designed six dedicated pages covering training, recovery, nutrition, and analytics with real-time data visualization",
      ],
    },
    {
      title: "ASLingo",
      techStack: ["Python", "TensorFlow", "MediaPipe", "OpenCV"],
      date: "Feb 2025 - Aug 2025",
      github: "https://github.com/axie22/ASLingo",
      summary:
        "Real-time ASL alphabet recognition from 21 MediaPipe hand landmarks, classifying 26 letters with TensorFlow.",
      category: "Applied ML",
      points: [
        "Built a real-time ASL alphabet recognition system using MediaPipe Hands to extract 21 3D hand landmarks per frame",
        "Trained a TensorFlow classifier on labeled gesture frames to recognize 26 ASL letter signs",
        "Engineered an OpenCV video pipeline for end-to-end frame processing with low-latency inference",
        "Implemented a live overlay displaying confidence scores and predicted sign output for interactive feedback",
      ],
    },
    {
      title: "Chip8 Emulator",
      techStack: ["C++", "SDL2", "CMake", "Emulation"],
      date: "Jan 2025 - Feb 2025",
      github: "https://github.com/axie22/Chip8Emulator",
      summary:
        "All 35 opcodes in C++, a 64×32 framebuffer at 60 Hz via SDL2, with register and memory debug tools.",
      category: "Systems",
      points: [
        "Built a fully functional Chip-8 emulator in C++ implementing all 35 opcodes for accurate ROM execution",
        "Engineered a display system using SDL2 to render a 64×32 framebuffer at 60 Hz with configurable scaling",
        "Implemented precise CPU timing and sound timer logic to ensure authentic gameplay speed and audio feedback",
        "Added debug tooling including register dumps and memory inspection to streamline opcode troubleshooting",
      ],
    },
  ] satisfies Project[],
  skills: {
    languages: [
      "C++",
      "Python",
      "TypeScript",
      "Go",
      "Java",
      "C",
      "SQL",
      "JavaScript",
    ],
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
      "Spark",
      "Airflow",
      "dbt",
      "Langfuse",
    ],
    infrastructure: [
      "AWS",
      "Docker",
      "PostgreSQL",
      "Google Cloud",
      "Redis",
      "MongoDB",
      "Cloudant",
      "IBM Cloud",
      "watsonx.data",
      "Presto",
      "Apache Iceberg",
      "Confluent Kafka",
    ],
    certifications: [
      {
        name: "Claude Certified Developer - Foundations",
        issuer: "Anthropic",
        image: "/certs/claude-certified-developer.svg",
        link: "https://www.credly.com/badges/c82ff778-e886-413e-94d0-0d2ab5d38a7e/public_url",
      },
      {
        name: "Open Source Contributor",
        issuer: "IBM",
        image: "/certs/open-source-contributor.svg",
        link: "https://www.credly.com/badges/fe25b7f5-04f3-44f6-aeb9-1da074ff12f9/public_url",
      },
      {
        name: "Trustworthy AI and AI Ethics",
        issuer: "IBM",
        image: "/certs/trustworthy-ai.svg",
        link: "https://www.credly.com/badges/e01bc386-11e4-4161-954e-cde6d0258f22/public_url",
      },
      {
        name: "Containers & Kubernetes Essentials",
        issuer: "IBM",
        image: "/certs/containers-kubernetes.svg",
        link: "https://www.credly.com/badges/7d820027-2e0f-4730-bf84-63af6335ffca/public_url",
      },
      {
        name: "IBM DevSecOps Explorer - Security & Automation for DevOps",
        issuer: "IBM",
        image: "/certs/devsecops-explorer.svg",
        link: "https://www.credly.com/badges/9b29370e-7cf2-4154-ad21-85376ffa6c7a/public_url",
      },
      {
        name: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services",
        image: "/AWS_CCP.png",
        link: "https://www.credly.com/badges/c7405f9d-927b-402f-b089-e96e91d7c3bf/public_url",
      },
      {
        name: "IBM Accelerate Software Developer",
        issuer: "IBM",
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
