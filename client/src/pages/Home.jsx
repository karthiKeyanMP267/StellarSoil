import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CloudIcon,
  UserGroupIcon,
  SunIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import AuthModal from '../components/AuthModal';

const features = [
  {
    name: 'Fresh & Local',
    description: 'Get fresh, locally sourced produce directly from trusted farmers.',
    icon: SparklesIcon,
    color: 'bg-green-600',
  },
  {
    name: 'Expert Farmers',
    description: 'Connect with experienced farmers who follow sustainable practices.',
    icon: UserGroupIcon,
    color: 'bg-amber-600',
  },
  {
    name: 'Seasonal Variety',
    description: 'Access seasonal fruits, vegetables, and organic products year-round.',
    icon: SunIcon,
    color: 'bg-emerald-600',
  },
  {
    name: 'Quality Assured',
    description: 'Every product meets our high standards for quality and freshness.',
    icon: ShieldCheckIcon,
    color: 'bg-lime-600',
  },
];

const Home = () => {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-br from-green-50 via-amber-50 to-emerald-50">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-green-100/20"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-emerald-100/20"></div>
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-amber-100/20"></div>
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-lime-100/20"></div>
        <div className="mx-auto w-full px-6 pb-24 pt-10 sm:pb-32 lg:px-8 lg:py-28">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-x-12 max-w-7xl mx-auto">
            {/* Left Content */}
            <div className="text-center lg:text-left w-full lg:w-1/2 xl:w-3/5">
              <div className="mt-12 sm:mt-24 lg:mt-16">
                <div className="inline-flex space-x-6">
                  <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-semibold leading-6 text-green-600 ring-1 ring-inset ring-green-500/20">
                    What's new
                  </span>
                  <span className="inline-flex items-center space-x-2 text-sm font-medium text-green-600">
                    <span>Fresh Harvest Daily</span>
                    <ChevronRightIcon className="h-5 w-5 text-green-500" />
                  </span>
                </div>
              </div>
              <h1 className="mt-10 text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-amber-600">
                Discover Fresh <br />
                Local Produce
              </h1>
              <p className="mt-6 text-lg lg:text-xl leading-8 text-gray-600">
                Connect directly with local farmers, discover fresh produce, and support sustainable farming practices. Experience the farm-to-table difference with StellarSoil.
              </p>
              <div className="mt-10 flex items-center lg:justify-start justify-center gap-x-6">
                {!user ? (
                  <>
                    <button
                      onClick={() => { setAuthMode('register'); setAuthModalOpen(true); }}
                      className="rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-green-500/25 hover:from-green-700 hover:to-emerald-700 hover:shadow-green-500/35 transition-all duration-300"
                    >
                      Get started
                      <span className="ml-2 inline-block">→</span>
                    </button>
                    <button
                      onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }}
                      className="text-base font-semibold leading-6 text-green-600 px-6 py-4 rounded-full border-2 border-green-500 bg-white hover:bg-green-50 hover:border-green-600 hover:text-green-700 transition-all duration-300"
                    >
                      Sign in
                      <span className="ml-2 inline-block">→</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/farms"
                    className="rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-green-500/25 hover:from-green-700 hover:to-emerald-700 hover:shadow-green-500/35 transition-all duration-300"
                  >
                    Explore Farms
                    <span className="ml-2 inline-block">→</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Right Image */}
            <div className="mt-12 lg:mt-0 w-full lg:w-1/2 xl:w-2/5">
              <div className="relative mx-auto max-w-lg">
                <div className="absolute -top-4 -right-4 -bottom-4 -left-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-10"></div>
                <div className="relative rounded-2xl shadow-2xl w-full h-[400px] bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                  <SparklesIcon className="w-24 h-24 text-green-600 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-green-600">Why Choose StellarSoil</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Experience the Farm-Fresh Difference
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We connect you directly with local farmers, ensuring you get the freshest produce while supporting sustainable agriculture.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div className={`${feature.color} p-2 rounded-lg`}>
                      <feature.icon className="h-5 w-5 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-b from-white to-green-50">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to experience farm-fresh quality?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Join StellarSoil today and discover the difference of truly fresh, locally sourced produce.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => { setAuthMode('register'); setAuthModalOpen(true); }}
                className="rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
              >
                Get started today
                <span className="ml-2 inline-block">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export default Home;
