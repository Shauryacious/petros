import React from "react";

function Footer() {
  const quickLinks = [
    { href: "#", label: "Home" },
    { href: "#", label: "About" },
    { href: "#", label: "Rock Classification" },
    { href: "#", label: "Contact Us" },
  ];

  const socialLinks = [
    { href: "#", label: "LinkedIn" },
    { href: "#", label: "GitHub" },
  ];

  return (
    <footer className="bg-dark text-gray-400 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-white text-lg font-semibold mb-4">
            About Petros
          </h2>
          <p className="mb-4">
            Petros is an innovative platform dedicated to the identification
            and classification of rocks using advanced image and video analysis.
            Our technology provides detailed reports on rock types, making it an
            essential tool for geologists and enthusiasts alike.
          </p>
        </div>
        <div>
          <h2 className="text-white text-lg font-semibold mb-4">Quick Links</h2>
          <ul>
            {quickLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="hover:text-white transition-colors duration-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-white text-lg font-semibold mb-4">
            Connect with Us
          </h2>
          <div className="flex space-x-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-white transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-white text-lg font-semibold mb-4">Contact</h2>
          <p>Petros Project Team</p>
          <p>Email: contact@petros.com</p>
        </div>
      </div>
      <p className="text-center text-xs pt-8">
        © 2024 Petros. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
