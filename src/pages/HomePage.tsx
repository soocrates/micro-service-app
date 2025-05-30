import React from 'react';
import { Link } from 'react-router-dom';
import { Server, Users, FileText, Activity } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero section */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Microservices Demo Application
        </h1>
        <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
          A demonstration of a modern microservices architecture with a beautiful React frontend
          and Python backend services.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            to="/login"
            className="px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-8 transition-colors duration-200"
          >
            Get Started
          </Link>
          <a
            href="https://github.com/yourusername/micro-app"
            target="_blank"
            rel="noreferrer"
            className="ml-4 px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-8 transition-colors duration-200"
          >
            View Source
          </a>
        </div>
      </div>

      {/* Feature section */}
      <div className="py-12 bg-white rounded-xl shadow-sm">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Architecture Overview
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                      <Server className="h-6 w-6 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">User Service</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Handles user authentication, registration, and profile management through a clean REST API.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-green-500 rounded-md shadow-lg">
                      <FileText className="h-6 w-6 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Data Service</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Manages content and provides analytics data through a well-structured API interface.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                      <Users className="h-6 w-6 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">React Frontend</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Beautiful, responsive user interface built with React, Tailwind CSS, and modern best practices.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-purple-500 rounded-md shadow-lg">
                      <Activity className="h-6 w-6 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Docker Deployment</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Containerized services with Docker and Docker Compose for easy local development and testing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-blue-700 rounded-xl shadow-xl">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block">Start using the app today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-100">
            Explore the microservices architecture and see how everything works together.
          </p>
          <Link
            to="/login"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto transition-colors duration-200"
          >
            Sign in to get started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;