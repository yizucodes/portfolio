import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { CaseStudyVideo } from "@/components/ui/case-study-video";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LensImage } from "@/components/ui/lens-image";
import { DATA } from "@/data/resume";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Markdown from "react-markdown";

const BLUR_FADE_DELAY = 0.04;

export async function generateStaticParams() {
  return DATA.work
    .filter((work): work is typeof work & { caseStudy: { enabled: boolean; slug: string } } => 
      "caseStudy" in work && !!work.caseStudy?.enabled
    )
    .map((work) => ({
      slug: work.caseStudy.slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const work = DATA.work.find(
    (w) => "caseStudy" in w && w.caseStudy?.slug === params.slug
  );

  if (!work || !("caseStudy" in work) || !work.caseStudy?.enabled) {
    return {
      title: "Case Study Not Found",
    };
  }

  return {
    title: `${work.company} Case Study | ${DATA.name}`,
    description: work.caseStudy.preview.problem,
    openGraph: {
      title: `${work.company} Case Study`,
      description: work.caseStudy.preview.problem,
      type: "article",
    },
  };
}

export default function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const work = DATA.work.find(
    (w) => "caseStudy" in w && w.caseStudy?.slug === params.slug
  );

  if (!work || !("caseStudy" in work) || !work.caseStudy?.enabled) {
    notFound();
  }

  const caseStudy = work.caseStudy;
  const content = caseStudy.content;
  const hasVideo = !!caseStudy.video;

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      {/* Back Navigation */}
      <BlurFade delay={BLUR_FADE_DELAY}>
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to Work Experience
        </Link>
      </BlurFade>

      {/* Header Section (Full Width) */}
      <section>
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="flex items-center gap-4">
            <Avatar className="border size-16 bg-muted-background dark:bg-foreground">
              <AvatarImage
                src={work.logoUrl}
                alt={work.company}
                className="object-contain"
              />
              <AvatarFallback>{work.company[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                {work.company}
              </h1>
              <p className="text-muted-foreground">{work.title}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {work.start} - {work.end ?? "Present"}
              </p>
            </div>
          </div>
        </BlurFade>
      </section>

      {/* Visual Flow Section: Video → Images */}
      {(hasVideo || (content.images && content.images.length > 0)) && (
        <section className="space-y-4 sm:space-y-6">
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            {/* Use 2-column grid when both video and images exist, otherwise single centered column */}
            <div className={`grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 ${
              hasVideo && content.images && content.images.length > 0 
                ? "lg:grid-cols-2" 
                : "max-w-3xl"
            }`}>
              {/* Video Section */}
              {hasVideo && caseStudy.video && (
                <div className="space-y-2">
                  <div className="relative w-full rounded-lg overflow-hidden border shadow-lg">
                    <CaseStudyVideo
                      src={caseStudy.video.src}
                      thumbnail={caseStudy.video.thumbnail}
                      alt={`${work.company} case study video`}
                      mode="inline"
                      showControls={false}
                      autoplay={true}
                      loop={true}
                      muted={true}
                      aspectRatio="16:9"
                      minHeight="min-h-[350px] sm:min-h-[450px] lg:min-h-[500px]"
                      className="w-full"
                    />
                  </div>
                  {caseStudy.video.caption && (
                    <p className="text-xs text-muted-foreground text-center lg:text-left">
                      {caseStudy.video.caption}
                    </p>
                  )}
                </div>
              )}

              {/* Images Section */}
              {content.images && content.images.length > 0 && content.images[0] && (
                <div className="space-y-2">
                  <LensImage
                    src={content.images[0]}
                    alt={`${work.company} case study image`}
                    containerClassName="w-full min-h-[350px] sm:min-h-[450px] lg:min-h-[500px] rounded-lg overflow-hidden border shadow-lg bg-background"
                    className="object-contain"
                    zoomFactor={2.5}
                    lensSize={250}
                    duration={0.15}
                    ariaLabel={`Zoom to see ${work.company} details`}
                    objectFit="contain"
                  />
                  <p className="text-xs text-muted-foreground text-center lg:text-left">
                    Hover to zoom
                  </p>
                </div>
              )}
            </div>
          </BlurFade>
        </section>
      )}

      {/* Content Section: Single Column */}
      <section className="max-w-3xl space-y-10">
        {/* Problem Section */}
        <div className="space-y-4">
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <h2 className="text-2xl font-bold">Problem</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            <Markdown className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
              {content.problem}
            </Markdown>
          </BlurFade>
        </div>

        {/* Approach Section */}
        <div className="space-y-4">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2 className="text-2xl font-bold">Approach</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 6}>
            <Markdown className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
              {content.approach}
            </Markdown>
          </BlurFade>
        </div>

        {/* Challenges Section */}
        {content.challenges && content.challenges.length > 0 && (
          <div className="space-y-4">
            <BlurFade delay={BLUR_FADE_DELAY * 7}>
              <h2 className="text-2xl font-bold">Challenges</h2>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 8}>
              <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
                {content.challenges.map((challenge, index) => (
                  <li key={index}>{challenge}</li>
                ))}
              </ul>
            </BlurFade>
          </div>
        )}

        {/* Results Section */}
        {content.results && content.results.length > 0 && (
          <div className="space-y-4">
            <BlurFade delay={BLUR_FADE_DELAY * 9}>
              <h2 className="text-2xl font-bold">Results</h2>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 10}>
              <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
                {content.results.map((result, index) => (
                  <li key={index}>{result}</li>
                ))}
              </ul>
            </BlurFade>
          </div>
        )}

        {/* Technologies Section */}
        {content.technologies && content.technologies.length > 0 && (
          <div className="space-y-4">
            <BlurFade delay={BLUR_FADE_DELAY * 11}>
              <h2 className="text-2xl font-bold">Technologies</h2>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 12}>
              <div className="flex flex-wrap gap-2">
                {content.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </BlurFade>
          </div>
        )}
      </section>
    </main>
  );
}
