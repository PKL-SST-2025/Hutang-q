import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import logo from '../assets/Logo-removebg-preview(1).png';

const SignIn = () => {
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [remember, setRemember] = createSignal(false);
  const [message, setMessage] = createSignal("");
  const navigate = useNavigate();
  

  const handleSignIn = async (e: Event) => {
      e.preventDefault();

      try {
        const response = await fetch("http://localhost:3000/api/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email(),
            password: password(),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setMessage("Signin success 🎉");
          console.log(data);
          setTimeout(() => navigate('/dashboard'), 1500);
          console.log("JWT Token:", data.token);
          localStorage.setItem("token", data.token);
        } else {
          const err = await response.text();
          setMessage(`Signin failed: ${err}`);
        }
      } catch (e) {
        setMessage(`Error: ${e.message}`);
      }
    };

  return (
    <div class="min-h-screen flex flex-col md:flex-row">
      {/* Motivational Text - Hidden on small screens */}
      <div class="hidden md:flex w-1/2 bg-gradient-to-br from-yellow-300 to-yellow-500 items-center justify-center p-10 text-white">
        <div class="max-w-md">
            <div class='flex gap-2'>
                <img src={logo} alt="Logo" class="mb-6 w-19" />
                <h1 class='text-4xl font-montserrat font-extrabold text-white pt-4'>Hutang-q</h1>
            </div>
          <h1 class="text-5xl font-montserrat font-extrabold mb-4 text-hitam">No more forgotten debts.</h1>
          <p class="text-4xl font-semibold font-montserrat text-hitam">Manage debts and loans in one simple app.</p>
        </div>
      </div>

      {/* Sign In Box */}
      <div class="flex flex-col md:flex-row flex-1 p-5 md:p-0 items-center justify-center bg-[#fff9df]">
        <div class='flex md:hidden w-full justify-center pb-5'>
                <img src={logo} alt="Logo" class="h-14" />
                <h1 class='text-3xl font-montserrat font-extrabold text-primer2 pt-2'>Hutang-q</h1>
            </div>
        <div class="w-full max-w-sm p-8 bg-[#FFFF8C] rounded-xl">
          <h2 class="text-center text-2xl font-bold text-orange-500 mb-6">Sign in</h2>

          <form class="space-y-4" onSubmit={handleSignIn}>
            <div>
              <label class="block text-sm font-semibold text-gray-800 mb-1">Email</label>
              <input
                type="email"
                class="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-200 focus:outline-none"
                placeholder="Enter your email"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-800 mb-1">Password</label>
              <input
                type="password"
                class="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-200 focus:outline-none"
                placeholder="Enter your Password"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
              />
            </div>

            <div class="flex justify-between items-center text-sm text-gray-700">
              <label class="flex items-center">
                <input type="checkbox" checked={remember()} onChange={(e) => setRemember(e.currentTarget.checked)} class="mr-1" />
                Remember me
              </label>
              <a href="/forgotpassword" class="text-xs text-gray-500 hover:text-orange-400">Forget Password?</a>
            </div>

            <button
              type="submit"
              class="w-full bg-orange-400 text-white py-2 rounded-md mt-4 hover:bg-orange-500 transition"
            >
              Sign in →
            </button>

            <p class="text-sm text-center mt-2 text-red-500">{message()}</p>

            <p class="text-center text-sm mt-4">
              Don't Have Account? <a href="/SignUp" class="text-orange-400 font-medium">Register here</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
