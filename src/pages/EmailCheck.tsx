import { useNavigate } from "@solidjs/router";

const ForgotPasswordConfirmation = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/signin');
  };

  return (
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-200 to-yellow-400 p-4">
      <div class="bg-yellow-100 rounded-2xl shadow-md p-8 w-full max-w-sm text-center">
        <h1 class="text-2xl font-bold text-primer2 mb-6">Forgot Password</h1>
        <p class="text-lg font-medium text-gray-700 mb-8">
          Please check your email and confirmation
        </p>
        <button
          onClick={handleNext}
          class="bg-primer1 hover:bg-orange-500 text-white font-semibold py-2 rounded-xl w-full transition duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordConfirmation;
