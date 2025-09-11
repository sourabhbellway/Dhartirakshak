import React from 'react'

const About = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-dark-green mb-6">About DhartiRakshak</h1>
        
        <div className="prose prose-lg max-w-none">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              DhartiRakshak is dedicated to empowering farmers and agricultural communities through 
              innovative technology, research, and knowledge sharing. We believe in sustainable 
              agriculture practices that protect our land while ensuring food security for future generations.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="font-semibold text-emerald-800 mb-2">🌱 Research & Development</h3>
                <p className="text-gray-700 text-sm">
                  We conduct and share cutting-edge agricultural research to help farmers 
                  adopt modern, sustainable farming techniques.
                </p>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="font-semibold text-emerald-800 mb-2">📚 Knowledge Sharing</h3>
                <p className="text-gray-700 text-sm">
                  Our platform provides access to the latest agricultural news, 
                  schemes, and expert insights for the farming community.
                </p>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="font-semibold text-emerald-800 mb-2">🤝 Community Support</h3>
                <p className="text-gray-700 text-sm">
                  We foster a supportive community where farmers can share experiences, 
                  ask questions, and learn from each other.
                </p>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="font-semibold text-emerald-800 mb-2">🌍 Sustainability Focus</h3>
                <p className="text-gray-700 text-sm">
                  Promoting eco-friendly farming practices that protect the environment 
                  while maintaining productivity and profitability.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Values</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span><strong>Innovation:</strong> Embracing new technologies and methods to improve agricultural outcomes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span><strong>Sustainability:</strong> Committed to practices that preserve our land for future generations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span><strong>Community:</strong> Building strong networks of support among farmers and agricultural experts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span><strong>Education:</strong> Providing accessible knowledge and resources for continuous learning</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span><strong>Transparency:</strong> Open and honest communication in all our interactions</span>
              </li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Team</h2>
            <p className="text-gray-700 leading-relaxed">
              DhartiRakshak is powered by a diverse team of agricultural experts, 
              researchers, technologists, and passionate individuals who share a common 
              vision of transforming agriculture through innovation and collaboration. 
              Our team combines decades of experience in farming, research, and technology 
              to deliver solutions that truly make a difference.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Join Our Mission</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Whether you're a farmer, researcher, student, or simply someone passionate 
              about sustainable agriculture, there's a place for you in the DhartiRakshak community. 
              Together, we can build a more sustainable and prosperous future for agriculture.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="bg-dark-green text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors">
                Join Our Community
              </button>
              <button className="border border-dark-green text-dark-green px-6 py-2 rounded-md hover:bg-emerald-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
