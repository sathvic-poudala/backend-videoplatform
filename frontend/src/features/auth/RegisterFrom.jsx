import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { formToJSON } from 'axios';
import api from '../../api/axios';

export default function RegisterFrom() {
  const [details, setDetails] = useState({
    userName: "",
    email: "",
    fullName: "",
    password: "",
    avatar: null,
    coverImage: null
  })
  const [error, setError] = useState("") 

  const handleChange = (event) => {
    const {value,name} = event.target

    setDetails({
      ...details,
      [name]: value
    })
  }

  const handleFileChange = (event) => {
    const {files,name} = event.target

    setDetails({
      ...details,
      [name]: files[0]
    })
  }

  const handleSubmit = async(event) => {
    event.preventDefault()
    setError("")
    try {
      const data = new FormData()

      data.append("userName",details.userName)
      data.append("fullName",details.fullName)
      data.append("email", details.email);
      data.append("password", details.password);
      data.append("avatar", details.avatar);

      if (details.coverImage) {
        data.append("coverImage", details.coverImage);
      }

      await api.post("/users/register", data);
      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to register."
      )
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
            Username
          </label>
          <div className="mt-2">
            <input
              id="username"
              name="userName"
              value={details.userName}
              onChange={handleChange}
              type="text"
              placeholder="janesmith"
              className="block w-full rounded-md bg-gray-50 px-3 py-2 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 transition-all focus:outline-2 focus:-outline-offset-2 focus:outline-[#2E6F40] dark:bg-black/10 dark:text-white dark:outline-gray-600 dark:focus:outline-[#68BA7F] sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
            Full Name
          </label>
          <div className="mt-2">
            <input
              id="fullName"
              name="fullName"
              value={details.fullName}
              onChange={handleChange}
              type="text"
              placeholder="Jane Smith Rao"
              className="block w-full rounded-md bg-gray-50 px-3 py-2 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 transition-all focus:outline-2 focus:-outline-offset-2 focus:outline-[#2E6F40] dark:bg-black/10 dark:text-white dark:outline-gray-600 dark:focus:outline-[#68BA7F] sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
          Email address
        </label>
        <div className="mt-2">
          <input
            id="email"
            name="email"
            value={details.email}
            onChange={handleChange}
            type="email"
            required
            placeholder="you@example.com"
            autoComplete="email"
            className="block w-full rounded-md bg-gray-50 px-3 py-2 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 transition-all focus:outline-2 focus:-outline-offset-2 focus:outline-[#2E6F40] dark:bg-black/10 dark:text-white dark:outline-gray-600 dark:focus:outline-[#68BA7F] sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
          Password
        </label>
        <div className="mt-2">
          <input
            id="password"
            name="password"
            value={details.password}
            onChange={handleChange}
            type="password"
            required
            autoComplete="new-password"
            className="block w-full rounded-md bg-gray-50 px-3 py-2 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 transition-all focus:outline-2 focus:-outline-offset-2 focus:outline-[#2E6F40] dark:bg-black/10 dark:text-white dark:outline-gray-600 dark:focus:outline-[#68BA7F] sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <hr className="my-6 border-gray-900/10 dark:border-white/10" />

      {/* Avatar Upload */}
      <div>
        <label htmlFor="avatar" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
          Profile Picture
        </label>
        <div className="mt-2 flex items-center gap-x-4">
          <UserCircleIcon aria-hidden="true" className="h-14 w-14 text-gray-400" />
          <label
            htmlFor="avatar-upload"
            className="cursor-pointer rounded-md bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-100 dark:bg-white/10 dark:text-white dark:ring-0 dark:hover:bg-white/20"
          >
            <span>Upload</span>
            <input 
            id="avatar-upload" 
            onChange={handleFileChange}
            name="avatar" 
            type="file" 
            className="sr-only" />
          </label>
        </div>
      </div>

      {/* Cover Image Upload */}
      <div>
        <label htmlFor="cover-upload" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
          Cover Image
        </label>
        <div className="mt-2 flex justify-center rounded-xl border border-dashed border-gray-900/25 bg-gray-50 px-6 py-8 transition-colors hover:border-[#68BA7F] dark:border-white/20 dark:bg-black/10 dark:hover:border-[#68BA7F]">
          <div className="text-center">
            <PhotoIcon aria-hidden="true" className="mx-auto h-10 w-10 text-gray-400" />
            <div className="mt-4 flex text-sm leading-6 text-gray-700 dark:text-gray-300">
              <label
                htmlFor="cover-upload"
                className="relative cursor-pointer rounded-md bg-transparent font-semibold text-[#2E6F40] transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-[#2E6F40] focus-within:ring-offset-2 hover:text-[#68BA7F] dark:text-[#68BA7F] dark:hover:text-[#CFFFDC]"
              >
                <span>Upload a file</span>
                <input 
                id="cover-upload" 
                name="coverImage"
                onChange={handleFileChange} 
                type="file" 
                className="sr-only" />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="flex w-full transform justify-center rounded-md bg-[#2E6F40] px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#1e4d2a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E6F40] dark:bg-[#68BA7F] dark:text-[#253D2C] dark:hover:bg-[#CFFFDC]"
        >
          Create Account
        </button>
      </div>
    </form>
  )
}