import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { IconCar, IconMapPin, IconBell, IconChartBar } from '@tabler/icons-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-6 py-24 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:75px_75px]" />
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
            <IconCar className="h-4 w-4" />
            AI & IoT-Powered Solution
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl md:text-7xl">
            Smart Parking
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
            Real-time parking space monitoring with IoT sensors, AI predictions, and instant
            notifications. Never waste time searching for parking again.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white px-6 py-24 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Powerful Features
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Everything you need to manage and find parking spaces efficiently
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<IconMapPin className="h-8 w-8" />}
              title="Real-time Tracking"
              description="Monitor parking space availability in real-time with IoT sensors and WebSocket updates."
              color="blue"
            />
            <FeatureCard
              icon={<IconBell className="h-8 w-8" />}
              title="Smart Notifications"
              description="Get instant alerts when your subscribed parking spaces become available."
              color="purple"
            />
            <FeatureCard
              icon={<IconChartBar className="h-8 w-8" />}
              title="AI Predictions"
              description="Machine learning models predict parking availability based on historical data."
              color="green"
            />
            <FeatureCard
              icon={<IconCar className="h-8 w-8" />}
              title="Subscription Management"
              description="Subscribe to your favorite parking spots and never miss availability."
              color="orange"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            <StatCard number="99.9%" label="Uptime" />
            <StatCard number="<1s" label="Response Time" />
            <StatCard number="24/7" label="Monitoring" />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'purple' | 'green' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400',
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <div className={`mb-4 inline-flex rounded-lg p-3 ${colorClasses[color]}`}>{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="mb-2 text-4xl font-bold sm:text-5xl">{number}</div>
      <div className="text-lg text-blue-100">{label}</div>
    </div>
  );
}
