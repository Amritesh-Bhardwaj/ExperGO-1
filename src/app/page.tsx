import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">ExperGo</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/kpi"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Data visualization</span>
              <span className="block text-blue-600">made simple</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Track, analyze, and visualize your data with our powerful
              dashboard tools.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/kpi"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Get started
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <a
                  href="#features"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature section with sample charts */}
      <div id="features" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Powerful data visualization tools
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Transform your data into actionable insights with our
              comprehensive charting solutions.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Chart example 1 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-48 bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                  <div className="w-full h-32 px-4 flex items-end justify-between">
                    <div
                      className="w-4 bg-blue-500 rounded-t"
                      style={{ height: "60%" }}
                    ></div>
                    <div
                      className="w-4 bg-blue-500 rounded-t"
                      style={{ height: "75%" }}
                    ></div>
                    <div
                      className="w-4 bg-blue-500 rounded-t"
                      style={{ height: "45%" }}
                    ></div>
                    <div
                      className="w-4 bg-blue-500 rounded-t"
                      style={{ height: "90%" }}
                    ></div>
                    <div
                      className="w-4 bg-blue-500 rounded-t"
                      style={{ height: "60%" }}
                    ></div>
                    <div
                      className="w-4 bg-blue-500 rounded-t"
                      style={{ height: "80%" }}
                    ></div>
                    <div
                      className="w-4 bg-blue-500 rounded-t"
                      style={{ height: "70%" }}
                    ></div>
                    <div
                      className="w-4 bg-blue-500 rounded-t"
                      style={{ height: "85%" }}
                    ></div>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Bar Charts
                </h3>
                <p className="mt-2 text-gray-600">
                  Visualize categorical data with customizable bar charts
                </p>
              </div>

              {/* Chart example 2 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-48 bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                  <div className="relative w-32 h-32 mx-auto rounded-full bg-gray-200">
                    <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-800">
                        65%
                      </span>
                    </div>
                    <div className="absolute inset-0 h-32 w-32 rounded-full border-8 border-transparent border-t-green-500 border-r-green-500 border-b-green-500"></div>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Pie & Doughnut Charts
                </h3>
                <p className="mt-2 text-gray-600">
                  Show composition and proportions with elegant circular charts
                </p>
              </div>

              {/* Chart example 3 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-48 bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                  <div className="w-full h-32 px-4 relative">
                    <svg className="w-full h-full" viewBox="0 0 100 50">
                      <path
                        d="M0,40 Q10,20 20,35 T40,30 T60,25 T80,15 T100,10"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                      />
                      <path
                        d="M0,45 Q20,40 40,35 T60,30 T100,20"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Line Charts
                </h3>
                <p className="mt-2 text-gray-600">
                  Track changes over time with smooth line and area charts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Sign up today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Join thousands of users who are already transforming their data into
            meaningful insights.
          </p>
          <Link
            href="/signup"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 sm:w-auto"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
