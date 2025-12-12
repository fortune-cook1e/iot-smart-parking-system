import { LoginForm } from '@/components/login-form';
import { IconCar } from '@tabler/icons-react';

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-6">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 opacity-90" />

      {/* Animated floating elements */}
      <div className="absolute inset-0">
        <div className="absolute left-[10%] top-[20%] h-72 w-72 animate-pulse rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute right-[15%] top-[40%] h-96 w-96 animate-pulse rounded-full bg-purple-400/20 blur-3xl delay-1000" />
        <div className="absolute bottom-[20%] left-[20%] h-80 w-80 animate-pulse rounded-full bg-pink-400/20 blur-3xl delay-2000" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 bg-size-[40px_40px] opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
        }}
      />

      {/* Floating cars animation */}
      <div className="absolute inset-0 overflow-hidden">
        <IconCar className="absolute left-[5%] top-[15%] h-8 w-8 animate-bounce text-white/30 delay-500" />
        <IconCar className="absolute right-[10%] top-[60%] h-10 w-10 animate-bounce text-white/20 delay-1000" />
        <IconCar className="absolute bottom-[25%] left-[80%] h-6 w-6 animate-bounce text-white/25 delay-1500" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <IconCar className="h-10 w-10 text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white">Smart Parking</h1>
          <p className="text-sm text-white/80">Your intelligent parking solution</p>
        </div>

        {/* Login Form with glass effect */}
        <div className="rounded-2xl bg-white/10 p-1 backdrop-blur-xl">
          <div className="rounded-xl bg-white dark:bg-gray-900">
            <LoginForm />
          </div>
        </div>

        {/* Footer text */}
        <p className="mt-6 text-center text-sm text-white/80">Powered by AI & IoT Technology</p>
      </div>
    </div>
  );
}
