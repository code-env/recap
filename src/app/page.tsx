import { ModeToggle } from "@/components/mode-toggle"
import UsernameForm from "@/components/user-name-form"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

const Page = () => {
  return (
    <div className="min-h-screen flex items-center flex-col gap-10 py-20">
      <UsernameForm />
      <div className="absolute top-4 right-4 text-primary border-border flex gap-2 items-center">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <ModeToggle />
      </div>
    </div>
  )
}

export default Page
