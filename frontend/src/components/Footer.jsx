import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white py-10 ">
      <div className="mt-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Khaitan Polytechnic College. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
