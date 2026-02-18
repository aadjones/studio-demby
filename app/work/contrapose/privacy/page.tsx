import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Contrapose",
  description:
    "Privacy Policy for Contrapose by Studio Demby. We don't collect your data, period.",
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <article className="prose prose-neutral max-w-none">
        <h1>Privacy Policy for Contrapose</h1>

        <p>
          <strong>Effective Date:</strong> October 6, 2025
          <br />
          <strong>Last Updated:</strong> October 6, 2025
        </p>

        <p>
          Studio Demby (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates the Contrapose mobile
          application (the &ldquo;App&rdquo;). This Privacy Policy explains our practices
          regarding data collection and use.
        </p>

        <h2>Data Collection</h2>

        <p>
          <strong>We do not collect, store, or transmit any personal information.</strong>
        </p>

        <p>The Contrapose app:</p>
        <ul>
          <li>
            <strong>Does not require account creation</strong> or login
          </li>
          <li>
            <strong>Does not collect names, email addresses, or contact information</strong>
          </li>
          <li>
            <strong>Does not track your location</strong>
          </li>
          <li>
            <strong>Does not use analytics or tracking services</strong>
          </li>
          <li>
            <strong>Does not share data with third parties</strong>
          </li>
        </ul>

        <h2>Local Data Storage</h2>

        <p>
          The app stores the following data <strong>locally on your device only</strong>:
        </p>
        <ul>
          <li>
            <strong>Practice history</strong>: Records of which practice cards
            you&apos;ve drawn to improve card rotation and prevent repetition
          </li>
          <li>
            <strong>User preferences</strong>: Your selected practice mode
            (Practice or Improvisation)
          </li>
        </ul>

        <p>This data:</p>
        <ul>
          <li>
            <strong>Never leaves your device</strong>
          </li>
          <li>
            <strong>Is not transmitted to our servers or any third party</strong>
          </li>
          <li>
            <strong>Is deleted if you uninstall the app</strong>
          </li>
          <li>
            <strong>Can be cleared by deleting and reinstalling the app</strong>
          </li>
        </ul>

        <h2>Third-Party Services</h2>

        <p>
          The app does not use any third-party services, SDKs, or analytics
          tools.
        </p>

        <h2>External Links</h2>

        <p>The app contains links to external websites:</p>
        <ul>
          <li>
            <strong>Request a Card form</strong> (Google Forms) - subject to
            Google&apos;s privacy policy
          </li>
          <li>
            <strong>Support link</strong> (Ko-fi) - subject to Ko-fi&apos;s privacy
            policy
          </li>
        </ul>

        <p>
          We are not responsible for the privacy practices of these external
          services.
        </p>

        <h2>Children&apos;s Privacy</h2>

        <p>
          The app does not knowingly collect any information from children under
          13. The app is designed for general music education and is safe for
          all ages.
        </p>

        <h2>Changes to This Privacy Policy</h2>

        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by updating the &ldquo;Last Updated&rdquo; date at the top of
          this policy.
        </p>

        <h2>Contact Us</h2>

        <p>
          If you have questions about this Privacy Policy, please contact us at:
        </p>

        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:aaron.demby.jones@gmail.com">
            aaron.demby.jones@gmail.com
          </a>
          <br />
          <strong>Website:</strong>{" "}
          <a
            href="https://studiodemby.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://studiodemby.com
          </a>
        </p>

        <hr />

        <p>
          <strong>Summary:</strong> Contrapose is a privacy-first app. We don&apos;t
          collect your data, period.
        </p>
      </article>
    </div>
  );
}
