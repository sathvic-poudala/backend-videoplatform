import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function LoginForm() {
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    })

    const [error, setError] = useState("")
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (event) => {
        const {value, name} = event.target
        
        const newCredentials = {
            email: credentials.email,
            password: credentials.password
        }

        newCredentials[name] = value

        setCredentials(newCredentials)

    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("")
        try {
            await login(credentials)
            navigate("/");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to login. Please check your credentials."
            )
        }
    }

    return (
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">  
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                            Email address
                        </label>

                        <input
                        id="email"
                        name="email"
                        type="email"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 dark:bg-gray-900 dark:text-white dark:outline-gray-700 dark:placeholder:text-gray-500"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                            >
                                Password
                            </label>

                            <Link
                                to="/forgot-password"
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <input
                        id="password"
                        name="password"
                        type="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                        autoComplete="current-password"
                        className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 dark:bg-gray-900 dark:text-white dark:outline-gray-700 dark:placeholder:text-gray-500"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                        {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "loging in..." : "login"}
                    </button>
                </form>
            </div>
    );
}