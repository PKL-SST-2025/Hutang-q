import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';

const ForgotPassword = () => {
  const [email, setEmail] = createSignal('');
  const navigate = useNavigate();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    console.log('Email:', email());
    navigate('/forgotpasswordconfirm'); // After search, redirect to signin or show confirmation
  };

  return (
    <div class="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-[#F1F82D] to-[#EEC028] justify-center items-center p-4">
      <div class="bg-[#FFFF8C] p-6 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 class="text-center text-2xl font-bold text-primer2 mb-2">Forgot Password</h2>
        <p class="text-center text-sm mb-4 font-semibold text-hitam">Please enter your email address to search for your account</p>
        <form onSubmit={handleSubmit} class="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            class="p-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-center"
            required
          />
          <button
            type="submit"
            class="bg-primer1 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Search
          </button>
        </form>
        <p class="text-center text-xs text-gray-700 mt-4">
          Remember password?{' '}
          <a href="/signin" class="text-yellow-600 hover:underline">Click here</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;