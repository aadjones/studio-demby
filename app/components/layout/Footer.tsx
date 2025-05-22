"use client";

import React from "react";
import {
  FaSoundcloud,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";
import { TbMailFilled } from "react-icons/tb";
import { metaData, socialLinks } from "app/config";
import { IconType } from "react-icons";
import { SubscribeForm } from "@/components/SubscribeForm";

const YEAR = new Date().getFullYear();

interface SocialLinkProps {
  href: string;
  icon: IconType;
}

function SocialLink({ href, icon: Icon }: SocialLinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Icon />
    </a>
  );
}

function SocialLinks() {
  return (
    <div className="flex text-lg gap-3.5 items-center">
      <SocialLink href={socialLinks.soundcloud} icon={FaSoundcloud} />
      <SocialLink href={socialLinks.instagram} icon={FaInstagram} />
      <a
        href="/feed.xml"
        title="Subscribe via RSS"
        className="text-xl hover:opacity-80 transition-opacity"
        target="_blank"
        rel="noopener noreferrer"
      >
        📡
      </a>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="block lg:mt-24 mt-16 text-[#1C1C1C] dark:text-[#D4D4D4]">
      <div className="flex flex-col items-center gap-8 mb-8">
        <div className="text-center">
          <p className="mb-4">🔔 Get a ping when a new ritual drops:</p>
          <SubscribeForm />
        </div>
        <SocialLinks />
      </div>
      <div className="text-center">
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
