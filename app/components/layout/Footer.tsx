"use client";

import React from "react";
import {
  FaSoundcloud,
  FaGithub,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa6";
import { TbMailFilled } from "react-icons/tb";
import { metaData, socialLinks } from "app/config";
import { IconType } from "react-icons";
import { SubscribeForm } from "@/components/SubscribeForm";

const YEAR = new Date().getFullYear();

interface SocialLinkProps {
  href: string;
  icon: IconType;
  /** Icon-only links need a name for screen readers. */
  label: string;
}

function SocialLink({ href, icon: Icon, label }: SocialLinkProps) {
  return (
    // 44×44 tap target around an 18px icon: the icon stays small, the hit area fits a thumb.
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center"
    >
      <Icon aria-hidden="true" />
    </a>
  );
}

function SocialLinks() {
  return (
    <div className="flex text-lg items-center">
      <SocialLink href={socialLinks.soundcloud} icon={FaSoundcloud} label="SoundCloud" />
      <SocialLink href={socialLinks.instagram} icon={FaInstagram} label="Instagram" />
      <SocialLink href={socialLinks.youtube} icon={FaYoutube} label="YouTube" />
      <SocialLink href={socialLinks.github} icon={FaGithub} label="GitHub" />
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="block lg:mt-24 mt-16 text-ink-900 w-full px-4">
      <div className="flex flex-col items-center gap-6 mb-8 w-full max-w-xl mx-auto">
        <SocialLinks />
        <div className="text-center w-full">
          <p className="mb-3 text-sm text-ink-500">
            New work by email:
          </p>
          <div className="w-full flex flex-col sm:flex-row gap-2 items-center justify-center">
            <SubscribeForm />
          </div>
        </div>
      </div>
      <div className="text-center text-sm sm:text-base mt-6">
        <time>© {YEAR}</time>{" "}
        <a
          className="no-underline"
          href={socialLinks.soundcloud}
          target="_blank"
          rel="noopener noreferrer"
        >
          {metaData.title}
        </a>
      </div>
      <style jsx>{`
        @media screen and (max-width: 480px) {
          article {
            padding-top: 2rem;
            padding-bottom: 4rem;
          }
        }
      `}</style>
    </footer>
  );
}
