import { resumeData } from "@/data/resume";
import { ALLOW_CUSTOM_PROMPT } from "@/lib/forward-pass/config";
import { HeroController } from "./HeroController";

const { name, bio, contact } = resumeData.personalInfo;

const links = [
  { label: "Resume", href: "/Alexander_Xie_resume.pdf", external: true },
  { label: "GitHub", href: contact.github, external: true },
  { label: "LinkedIn", href: contact.linkedin, external: true },
  { label: "Contact", href: `mailto:${contact.email}`, external: false },
];

const kbd = "rounded border border-[#2a3245] px-1 font-mono text-[11px]";

// Always dark, regardless of the site theme: the scene is designed for a dark background.
export const Hero = () => {
  return (
    <section className="relative h-[calc(100svh-4rem)] min-h-[600px] overflow-hidden max-[800px]:h-auto max-[800px]:min-h-[calc(100svh-4rem)] bg-[#07090d] text-[#e6e9ef]">
      <HeroController
        heading={<h1 className="mt-[26px] mb-1.5 text-[clamp(44px,6vw,72px)] font-semibold tracking-[-0.03em]">{name}</h1>}
      >
        <p className="mt-3 max-w-[460px] text-sm leading-relaxed text-[#8a93a6]">{bio}</p>
        <nav className="mt-7 flex flex-wrap gap-5 text-sm">
          {links.map(({ label, href, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="border-b border-[#2a3245] pb-0.5 text-[#e6e9ef] hover:border-[#ffb454] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb454]"
            >
              {label}
            </a>
          ))}
        </nav>
        <p className="mt-[18px] text-xs leading-normal text-[#8a93a6]">
          {ALLOW_CUSTOM_PROMPT ? (
            <>
              The prompt above is the model&apos;s input. Edit it and press <kbd className={kbd}>Enter</kbd> to run a new forward pass.
            </>
          ) : (
            <>The prompt above is the model&apos;s input.</>
          )}
          <span className="pointer-coarse:hidden"> Drag the scene to rotate it.</span>
        </p>
      </HeroController>
    </section>
  );
};
