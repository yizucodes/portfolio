"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { ChevronRightIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { CaseStudyVideo } from "@/components/ui/case-study-video";

interface CaseStudyPreview {
  problem: string;
  metrics: readonly string[];
}

interface CaseStudy {
  enabled: boolean;
  slug: string;
  preview: CaseStudyPreview;
  video?: {
    src: string;
    thumbnail?: string;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
  };
}

interface ResumeCardProps {
  logoUrl: string;
  altText: string;
  title: string;
  subtitle?: string;
  href?: string;
  badges?: readonly string[];
  period: string;
  description?: string | string[] | readonly string[];
  caseStudy?: CaseStudy;
}
export const ResumeCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  badges,
  period,
  description,
  caseStudy,
}: ResumeCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (description || caseStudy?.enabled) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  const handleCaseStudyLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigation handled by Link component
  };

  return (
    <div
      className="relative block cursor-pointer"
      onClick={handleClick}
    >
      <Card className={cn("flex", caseStudy?.enabled && "border-primary/20")}>
        <div className="flex-none">
          <Avatar className="border size-12 m-auto bg-muted-background dark:bg-foreground">
            <AvatarImage
              src={logoUrl}
              alt={altText}
              className="object-contain"
            />
            <AvatarFallback>{altText[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-grow ml-4 items-center flex-col group">
          <CardHeader>
            <div className="flex items-center justify-between gap-x-2 text-base">
              <h3 className="inline-flex items-center justify-center font-semibold leading-none text-xs sm:text-sm gap-x-1">
                {title}
                {badges && (
                  <span className="inline-flex gap-x-1">
                    {badges.map((badge, index) => (
                      <Badge
                        variant="secondary"
                        className="align-middle text-xs"
                        key={index}
                      >
                        {badge}
                      </Badge>
                    ))}
                  </span>
                )}
                <ChevronRightIcon
                  className={cn(
                    "size-4 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100",
                    isExpanded ? "rotate-90" : "rotate-0"
                  )}
                />
              </h3>
              <div className="text-xs sm:text-sm tabular-nums text-muted-foreground text-right">
                {period}
              </div>
            </div>
            {subtitle && <div className="font-sans text-xs">{subtitle}</div>}
          </CardHeader>
          {description && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: isExpanded ? 1 : 0,
                height: isExpanded ? "auto" : 0,
              }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-2 text-xs sm:text-sm overflow-hidden"
            >
              {Array.isArray(description) ? (
                <ul className="list-disc list-inside space-y-1 pl-2">
                  {description.map((bullet, index) => (
                    <li key={index}>{bullet}</li>
                  ))}
                </ul>
              ) : (
                description
              )}
              {caseStudy?.enabled && isExpanded && (
                <div className="mt-3">
                  <Link
                    href={`/work/${caseStudy.slug}`}
                    onClick={handleCaseStudyLinkClick}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Read full case study
                    <ExternalLinkIcon className="size-3" />
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
};
