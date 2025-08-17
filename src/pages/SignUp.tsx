import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import logo from "../assets/Logo-removebg-preview(1).png";

const SignUp = () => {
    const [username, setUsername] = createSignal('');
    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [passwordconfirmation, setPasswordConfirmation] = createSignal('');
    const [remember, setRemember] = createSignal(false);
    const [message, setMessage] = createSignal("");
    const navigate = useNavigate();
    

    const handleSignup = async (e: Event) => {
      e.preventDefault();

      try {
        const response = await fetch("http://localhost:3000/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username(),
            email: email(),
            password: password(),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setMessage("Signup success 🎉");
          console.log(data);
          setTimeout(() => navigate('/SignIn'), 1500);
        } else {
          const err = await response.text();
          setMessage(`Signup failed: ${err}`);
        }
      } catch (e) {
        setMessage(`Error: ${e.message}`);
      }
    };


  return (
    <div class="min-h-screen flex flex-col md:flex-row">
        {/* Sign In Box */}
      <div class="flex flex-col md:flex-row flex-1 p-5 md:p-0 items-center justify-center bg-[#fff9df]">
        <div class='flex md:hidden w-full justify-center pb-5'>
                <img src={logo} alt="Logo" class="h-14" />
                <h1 class='text-3xl font-montserrat font-extrabold text-primer2 pt-2'>Hutang-q</h1>
            </div>
        <div class="w-full max-w-sm p-8 bg-[#FFFF8C] rounded-xl">
          <h2 class="text-center text-2xl font-bold text-orange-500 mb-6">Sign Up</h2>

          <form class="space-y-4" onSubmit={handleSignup}>
            <div>
              <label class="block text-sm font-semibold text-gray-800 mb-1">Full Name</label>
              <input
                type="text"
                class="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-200 focus:outline-none"
                placeholder="Enter your full name"
                value={username()}
                onInput={(e) => setUsername(e.currentTarget.value)}
              />
            </div>

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

            <div>
              <label class="block text-sm font-semibold text-gray-800 mb-1">Password Confirmation</label>
              <input
                type="password"
                class="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-200 focus:outline-none"
                placeholder="Repeat your password"
                value={passwordconfirmation()}
                onInput={(e) => setPasswordConfirmation(e.currentTarget.value)}
              />
            </div>

            <div class="flex justify-between items-center text-sm text-gray-700">
              <label class="flex items-center text-xs">
                <input type="checkbox" checked={remember()} onChange={(e) => setRemember(e.currentTarget.checked)} class="mr-1" />
                I agree to the <span class='text-primer1'>Terms & Conditions</span> and<span class='text-primer1'>Privacy Policy</span> 
              </label>
            </div>

            <button
              type="submit"
              class="w-full bg-orange-400 text-white py-2 rounded-md mt-4 hover:bg-orange-500 transition"
            >
              Sign up →
            </button>

            <p class="text-sm text-center mt-2 text-red-500">{message()}</p>

            <p class="text-center text-sm mt-4">
              Already Have Account? <a href="/SignIn" class="text-orange-400 font-medium">Sign in here</a>
            </p>
          </form>
        </div>
      </div>

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
    </div>
  );
};

export default SignUp;
