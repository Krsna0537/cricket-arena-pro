import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, ArrowRight, Award, Code, Users, ExternalLink, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-cricket-navy dark:text-white mb-4">Contact Us</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Have questions, feedback, or need support? We're here to help you with all your cricket tournament management needs.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Creator Information */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div>
            <h2 className="text-2xl font-bold text-cricket-navy dark:text-white mb-6 flex items-center">
              <Trophy className="h-6 w-6 text-cricket-accent mr-3" />
              Our Team
            </h2>
            
            {/* Cricket theme decorative element */}
            <div className="absolute -z-10 right-4 top-40 opacity-5 hidden md:block">
              <div className="w-72 h-72 border-[30px] border-cricket-accent rounded-full"></div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-cricket-navy dark:text-white mb-4 flex items-center">
                <Users className="h-5 w-5 text-cricket-accent mr-2" />
                Team Members
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-medium dark:text-gray-200">Prasanna Mesta</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">1VE23CY037</span>
                </li>
                <li className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-medium dark:text-gray-200">Niranjan S</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">1VE23CY033</span>
                </li>
                <li className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-medium dark:text-gray-200">Niranjan S</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">1VE23CY034</span>
                </li>
                <li className="flex justify-between items-center pb-2">
                  <span className="font-medium dark:text-gray-200">Gurudeep M R</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">1VE23CY018</span>
                </li>
              </ul>
              
              <div className="pt-2">
                <h3 className="font-semibold flex items-center mb-2 dark:text-white">
                  <Code className="h-5 w-5 text-cricket-accent mr-2" />
                  GitHub Repository
                </h3>
                <a 
                  href="https://github.com/Krsna0537/cricket-arena-pro.git" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                >
                  github.com/Krsna0537/cricket-arena-pro
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
            
            {/* Cricket theme decorative element */}
            <div className="relative mt-8">
              <div className="absolute -left-4 -top-4 w-10 h-10 rounded-full bg-cricket-accent/10 dark:bg-cricket-accent/20 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-cricket-accent/30 dark:bg-cricket-accent/40"></div>
              </div>
              <div className="absolute -right-4 -bottom-4 w-10 h-10 rounded-full bg-cricket-accent/10 dark:bg-cricket-accent/20 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-cricket-accent/30 dark:bg-cricket-accent/40"></div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative z-10">
                <h3 className="text-xl font-semibold text-cricket-navy dark:text-white mb-4">Project Recognition</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Award className="h-5 w-5 text-cricket-accent" />
                  <span className="font-medium dark:text-gray-200">Cricket Tournament Management System</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Developed as part of our academic project for web development and design course.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-cricket-navy dark:text-white mb-4">Get in Touch</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-cricket-accent mr-3 mt-1" />
                <span className="dark:text-gray-300">123 Cricket Lane<br />Sports District, IN 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-cricket-accent mr-3" />
                <span className="dark:text-gray-300">+91 123-456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-cricket-accent mr-3" />
                <a href="mailto:pmesta246@gmail.com" className="hover:text-cricket-accent dark:text-gray-300 dark:hover:text-cricket-accent transition-colors">
                  pmesta246@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Cricket-themed decorative elements */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-cricket-accent/10 dark:bg-cricket-accent/20 rounded-bl-3xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-cricket-accent/10 dark:bg-cricket-accent/20 rounded-tr-3xl"></div>
          
          <h2 className="text-2xl font-bold text-cricket-navy dark:text-white mb-6">Send us a Message</h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Name
              </label>
              <Input
                type="text"
                id="name"
                placeholder="John Doe"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-cricket-accent focus:border-cricket-accent dark:focus:ring-cricket-accent dark:focus:border-cricket-accent dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                placeholder="john@example.com"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-cricket-accent focus:border-cricket-accent dark:focus:ring-cricket-accent dark:focus:border-cricket-accent dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subject
              </label>
              <Input
                type="text"
                id="subject"
                placeholder="How can we help you?"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-cricket-accent focus:border-cricket-accent dark:focus:ring-cricket-accent dark:focus:border-cricket-accent dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message
              </label>
              <Textarea
                id="message"
                rows={5}
                placeholder="Your message here..."
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-cricket-accent focus:border-cricket-accent dark:focus:ring-cricket-accent dark:focus:border-cricket-accent dark:placeholder-gray-400 w-full"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-cricket-navy dark:bg-cricket-accent dark:text-black text-white py-3 px-6 rounded-md hover:bg-cricket-navy-light dark:hover:bg-cricket-accent/90 transition-colors font-medium flex items-center justify-center"
            >
              Send Message
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
          
          {/* Cricket ball illustration */}
          <div className="mt-10 flex justify-center">
            <div className="w-16 h-16 relative">
              <div className="absolute inset-0 bg-red-600 dark:bg-red-700 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-3/4 border-2 border-white/30 dark:border-white/40 rounded-full transform rotate-12"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage; 