import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            MediMate
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Your AI-powered blood test analysis companion
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Link href="/blood-test-analysis" 
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="text-sky-600 text-4xl mb-4">🔬</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Test Analysis</h2>
              <p className="text-gray-600">Get instant analysis of your blood test results with AI-powered insights</p>
            </Link>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-sky-600 text-4xl mb-4">ℹ️</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">About Project</h2>
              <p className="text-gray-600">Learn how MediMate uses advanced AI to provide accurate and reliable blood test analysis</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4">
                <div className="text-sky-600 text-2xl mb-2">1</div>
                <h3 className="font-medium text-gray-800 mb-2">Enter Your Data</h3>
                <p className="text-gray-600 text-sm">Input your blood test results or upload an image</p>
              </div>
              <div className="p-4">
                <div className="text-sky-600 text-2xl mb-2">2</div>
                <h3 className="font-medium text-gray-800 mb-2">AI Analysis</h3>
                <p className="text-gray-600 text-sm">Our AI analyzes your results with medical expertise</p>
              </div>
              <div className="p-4">
                <div className="text-sky-600 text-2xl mb-2">3</div>
                <h3 className="font-medium text-gray-800 mb-2">Get Insights</h3>
                <p className="text-gray-600 text-sm">Receive detailed analysis and recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 