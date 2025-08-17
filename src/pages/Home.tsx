import { Component } from "solid-js";
import logo from "../assets/Logo-removebg-preview(1).png";

interface Keuntungan {
    text: string;
}

interface Kata {
    title: string;
    description: string;
}

const Home: Component = () => {

    const keuntungan: Keuntungan[] = [
        {
            text: 'Debt & Loan Record Summary'
        },
        {
            text: 'Auto Reminders for Due Dates'
        },
        {
            text: 'Save Payment Proof'
        },
        {
            text: 'Complete History & Filters'
        }
    ];

    const kata: Kata[] = [
        {
            title: 'Simple',
            description: 'A simple way to track and manage your debts and loans.'
        },
        {
            title: 'Smart',
            description: 'Smart reminders. Smart records. Smart choices.'
        },
        {
            title: 'Secure',
            description: 'A secure way to manage your debts and loans, all in one place.'
        }
    ];

  return (
    <div>
        <nav class="flex justify-between mt-2">
            <div class="flex ml-2 md:ml-5">
                <img src={logo} alt="" class="h-9"/>
                <h1 class="font-montserrat font-extrabold text-primer1 text-xl md:text-2xl">Hutang-q</h1>
            </div>
            <ul class="flex font-montserrat font-extrabold">
                <li class="bg-primer1 w-18 md:w-28 h-9 md:h-11 flex items-center justify-center rounded-sm">
                    <a href="/signup" class="text-sm md:text-base">Sign Up</a>
                </li>
                <li class="w-18 md:w-28 h-9 md:h-11 flex items-center justify-center">
                    <a href="/signin" class="text-sm md:text-base">Sign In</a>
                </li>
            </ul>
        </nav>
        <main class="pt-20">
            {/*atas*/}
            <div class="flex flex-col items-center font-montserrat space-y-8">
                <h1 class="text-center text-secondary font-extrabold text-5xl md:text-7xl">Manage Your Debts <br/> & Loans Easily</h1>
                <h3 class="text-hitam font-semibold text-center text-md md:text-2xl">Keep track of who owes what — anytime, anywhere. <br/> Simple, smart, and secure.</h3>
                <a href="/signup" class="flex justify-center items-center text-2xl md:text-4xl h-16 md:h-28 w-52 md:w-80 rounded-2xl bg-primer1 font-extrabold text-white">Get Started</a>
            </div>
            {/*atas pertama*/}
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-36">
                <div class="grid md:grid-cols-2 gap-10 text-hitam">
                    {keuntungan.map((keuntungan) =>(
                        <div class="font-semibold font-montserrat text-center text-2xl">
                            <h2 class="">{keuntungan.text}</h2>
                        </div>
                    ))}
                </div>
            </div>
            {/*tengah kedua*/}
            <div class="h-36 md:h-64 w-full bg-primer1 flex text-center justify-center items-center">
                <h1 class="font-montserrat font-extrabold text-white text-lg md:text-5xl">Its time to manage your debt and loan <br/> records the smart way!</h1>
            </div>
            {/*bawah*/}
            <div class="py-36">
                <div class="max-w-7xl mx-auto">
                    <div class="grid md:grid-cols-3 gap-5 text-hitam">
                        {kata.map((kata) =>(
                            <div class="font-montserrat text-center space-y-2.5">
                                <h1 class="font-extrabold text-lg md:text-4xl">{kata.title}</h1>
                                <h3 class="font-semibold text-md md:text-xl">{kata.description}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
        <footer class="bg-primer1 md:h-80 font-montserrat px-3 md:px-6 pt-3 md:pt-6">
            <div class="space-y-18">
                <div class="md:space-y-3">
                    <h1 class="text-white font-extrabold text-center text-md md:text-6xl md:text-left">Let's start managing your debts and loans smartly!</h1>
                    <ul class="md:text-xl flex justify-center md:justify-start font-montserrat font-extrabold space-x-1 md:space-x-5">
                        <li class="w-28 md:w-44 h-11 flex items-center justify-center border-2 border-white rounded-sm text-hitam">
                            <a href="/signup" class="">Sign Up</a>
                        </li>
                        <li class="bg-white w-28 md:w-44 h-11 flex items-center justify-center rounded-sm text-hitam">
                            <a href="/signin">Sign In</a>
                        </li>
                    </ul>
                </div>
                <div class="flex justify-between font-montserrat text-sm md:text-2xl font-semibold">
                    <ul class="flex text-white space-x-4 md:space-x-28">
                        <li>
                            <a href="">About Us</a>
                        </li>
                        <li>
                            Privacy Policy
                        </li>
                        <li>
                            Contact Us
                        </li>
                    </ul>
                    <h1>Hutang-q</h1>
                </div>
            </div>
        </footer>
    </div>
  );
};

export default Home;
