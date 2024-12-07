import UsernameForm from "@/components/user-name-form"
import UserProfile from "@/components/user-profile"
import React from "react"

const Page = () => {
  return (
    <div className="min-h-screen flex items-center flex-col gap-10 py-20">
      {/* <UsernameForm /> */}
      <UserProfile />
    </div>
  )
}

export default Page
