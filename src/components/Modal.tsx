import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import portfolioData from "../data/portfolio.json";

interface ModalProps {
  isOpen: boolean;
  section: string | null;
  onClose: () => void;
}

export default function Modal({ isOpen, section, onClose }: ModalProps) {
  if (!isOpen || !section) return null;

  const renderContent = () => {
    switch (section) {

      // ABOUT
      case "about":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-800 border-b border-indigo-200 pb-2">
              About Me
            </h2>

            <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-900">
                {portfolioData.basics.name}
              </h3>

              <p className="text-indigo-800 font-medium mb-4">
                {portfolioData.basics.title}
              </p>

              <p className="text-gray-700">
                {portfolioData.basics.summary}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-gray-900">{portfolioData.basics.location}</p>
              </div>

              <div className="bg-white p-4 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-500">Email</p>
                <a
                  href={`mailto:${portfolioData.basics.email}`}
                  className="text-indigo-800 hover:underline"
                >
                  {portfolioData.basics.email}
                </a>
              </div>
            </div>
          </div>
        );


      // EDUCATION
      case "education":
        return (
          <div className="space-y-6">

            <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-800 border-b border-indigo-200 pb-2">
              Education
            </h2>

            {portfolioData.education.map((edu, idx) => (
              <div
                key={idx}
                className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-gray-900">
                  {edu.degree}
                </h3>

                <p className="text-indigo-800">{edu.institution}</p>

                <div className="flex justify-between mt-3 text-sm">
                  <span className="text-gray-500">{edu.dates}</span>
                  <span className="text-gray-700">{edu.details}</span>
                </div>
              </div>
            ))}

          </div>
        );


      // PROJECTS
      case "projects":
        return (
          <div className="space-y-6">

            <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-800 border-b border-indigo-200 pb-2">
              Projects
            </h2>

            <div className="grid gap-4 md:gap-6 max-h-[60vh] overflow-y-auto custom-scrollbar">

              {portfolioData.projects.map((proj, idx) => (

                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm"
                >

                  <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                    {proj.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-3">

                    {proj.tech_stack.map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}

                  </div>

                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    {proj.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>

                </motion.div>

              ))}

            </div>

          </div>
        );


      // SKILLS
      case "skills":
        return (
          <div className="space-y-6">

            <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-800 border-b border-indigo-200 pb-2">
              Skills
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

              {Object.entries(portfolioData.skills).map(([category, skills]) => (

                <div
                  key={category}
                  className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm"
                >

                  <h3 className="text-lg font-semibold text-indigo-800 mb-3 capitalize">
                    {category.replace("_", " ")}
                  </h3>

                  <div className="flex flex-wrap gap-2">

                    {skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}

                  </div>

                </div>

              ))}

            </div>

          </div>
        );


      // EXPERIENCE
      case "experience":
        return (
          <div className="space-y-6">

            <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-800 border-b border-indigo-200 pb-2">
              Experience
            </h2>

            {portfolioData.experience.map((exp, idx) => (

              <div
                key={idx}
                className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm"
              >

                <div className="flex justify-between mb-2">

                  <h3 className="text-xl font-extrabold text-gray-900">
                    {exp.role}
                  </h3>

                  <span className="text-sm text-indigo-800">
                    {exp.dates}
                  </span>

                </div>

                <p className="text-gray-600 mb-3">
                  {exp.company} • {exp.location}
                </p>

                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">

                  {exp.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}

                </ul>

              </div>

            ))}

          </div>
        );


      // RESUME
      case "resume":
        return (
          <div className="text-center space-y-6">

            <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-800 border-b border-indigo-200 pb-2">
              Download Resume
            </h2>

            <a
              href="/resume.pdf"
              download
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
            >
              Download Resume
            </a>

          </div>
        );


      // CONTACT
      case "contact":
        return (
          <div className="space-y-6">

            <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-800 border-b border-indigo-200 pb-2">
              Contact
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <a
                href={`mailto:${portfolioData.basics.email}`}
                className="bg-white border border-gray-200 p-6 rounded-xl text-center hover:shadow-md"
              >
                <div className="text-3xl mb-2">📧</div>
                <p className="text-gray-700">{portfolioData.basics.email}</p>
              </a>

              <a
                href={`tel:${portfolioData.basics.phone}`}
                className="bg-white border border-gray-200 p-6 rounded-xl text-center hover:shadow-md"
              >
                <div className="text-3xl mb-2">📱</div>
                <p className="text-gray-700">{portfolioData.basics.phone}</p>
              </a>

              {portfolioData.basics.links.map((link, idx) => (
                <a
                  key={idx}
                  href={`https://${link}`}
                  target="_blank"
                  className="bg-white border border-gray-200 p-6 rounded-xl text-center hover:shadow-md"
                >
                  🔗 {link}
                </a>
              ))}

            </div>

          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>

      <motion.div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >

        <motion.div
          className="relative w-[95%] md:w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-8 max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
        >

          <button
            onClick={onClose}
            className="absolute top-2 right-2 md:top-4 md:right-4"
          >
            <X />
          </button>

          {renderContent()}

        </motion.div>

      </motion.div>

    </AnimatePresence>
  );
}