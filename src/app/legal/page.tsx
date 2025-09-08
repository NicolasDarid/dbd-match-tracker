import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Disclaimer - DBD Match Tracker",
  description:
    "Legal disclaimer and copyright information for DBD Match Tracker",
};

export default function LegalPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-6 text-white">Legal Disclaimer</h1>

        <div className="bg-red-950/20 border border-red-950 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-red-300 mb-4">
            ⚠️ Important Legal Notice
          </h2>
          <p className="text-gray-300">
            This application is not affiliated with, endorsed by, or sponsored
            by Behavior Interactive Inc. Dead by Daylight is a trademark of
            Behavior Interactive Inc.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Copyright and Trademark Notice
          </h2>
          <p className="mb-4 text-gray-300">
            <strong className="text-white">Dead by Daylight</strong> and all
            related characters, names, and distinctive likenesses thereof are
            trademarks of and copyright{" "}
            <strong className="text-white">Behavior Interactive Inc.</strong>{" "}
            All rights reserved.
          </p>
          <p className="mb-4 text-gray-300">
            This fan-made application is created for educational and personal
            use purposes only. We do not claim ownership of any Dead by Daylight
            intellectual property.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Fair Use Statement
          </h2>
          <p className="mb-4 text-gray-300">
            This application uses Dead by Daylight content under the doctrine of
            fair use for the following purposes:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-300">
            <li>
              Educational purposes (learning game development and web
              technologies)
            </li>
            <li>Non-commercial use (no monetary gain from the application)</li>
            <li>
              Transformative use (creating a tool for players to track their
              personal statistics)
            </li>
            <li>Limited use (only necessary content for functionality)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Disclaimer of Affiliation
          </h2>
          <p className="mb-4 text-gray-300">
            <strong className="text-white">DBD Match Tracker</strong> is an
            independent, fan-made application that is:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-300">
            <li>Not officially affiliated with Behavior Interactive Inc.</li>
            <li>Not endorsed or sponsored by Behavior Interactive Inc.</li>
            <li>Not recognized or supported by Behavior Interactive Inc.</li>
            <li>Created by independent developers for the community</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            User-Generated Content
          </h2>
          <p className="mb-4 text-gray-300">
            This application allows users to:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-300">
            <li>Track their personal game statistics</li>
            <li>Upload screenshots of their matches</li>
            <li>Store their personal match history</li>
          </ul>
          <p className="mb-4 text-gray-300">
            All user-generated content remains the property of the respective
            users. We do not claim ownership of user-uploaded content.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Limitation of Liability
          </h2>
          <p className="mb-4 text-gray-300">
            This application is provided &quot;as is&quot; without any
            warranties. The developers:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-300">
            <li>Make no claims about the accuracy of game data</li>
            <li>Are not responsible for any loss of user data</li>
            <li>Reserve the right to discontinue the service at any time</li>
            <li>
              Are not liable for any damages arising from the use of this
              application
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Compliance and Removal
          </h2>
          <p className="mb-4 text-gray-300">
            If you are a representative of Behavior Interactive Inc. and believe
            this application infringes on your intellectual property rights,
            please contact us at:
          </p>
          <div className="bg-gray-800 border border-red-950 p-4 rounded-lg">
            <p className="font-mono text-sm text-gray-300">
              Email: nicolasdarid@gmail.com
              <br />
              Subject: DMCA / Copyright Infringement Notice
            </p>
          </div>
          <p className="mt-4 text-gray-300">
            We will respond promptly to any legitimate concerns and are
            committed to respecting intellectual property rights.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Open Source
          </h2>
          <p className="mb-4 text-gray-300">
            This application is open source and available on GitHub. The source
            code is provided for educational purposes and community
            collaboration.
          </p>
          <p className="mb-4 text-gray-300">
            <strong className="text-white">GitHub Repository:</strong>
            <a
              href="https://github.com/NicolasDarid/dbd-match-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 hover:underline ml-2 transition-colors"
            >
              https://github.com/NicolasDarid/dbd-match-tracker
            </a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Contact Information
          </h2>
          <p className="mb-4 text-gray-300">
            For questions about this legal disclaimer or the application, please
            contact:
          </p>
          <div className="bg-gray-800 border border-red-950 p-4 rounded-lg">
            <p className="font-mono text-sm text-gray-300">
              Developer: Nicolas Darid
              <br />
              Email: nicolasdarid@gmail.com
              <br />
              GitHub: @NicolasDarid
            </p>
          </div>
        </section>

        <div className="border-t border-red-950 pt-6 mt-8">
          <p className="text-sm text-gray-400">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            This legal disclaimer is subject to change without notice.
          </p>
        </div>
      </div>
    </div>
  );
}
