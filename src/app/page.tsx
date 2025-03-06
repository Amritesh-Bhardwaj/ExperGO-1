import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">Data visualization made simple</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Track, analyze, and visualize your data with our powerful dashboard tools.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/kpi">
          <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            Get Started
          </button>
        </Link>
        <button className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors cursor-pointer">
          Learn More
        </button>
      </div>
    </div>
  );
}
