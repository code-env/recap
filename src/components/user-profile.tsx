"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, MapPin, CalendarClock } from "lucide-react"
import { Card } from "./ui/card"
import { CommitGraph } from "./commit-graph"

const nothingData = [
  { title: "Total commits", value: 599 },
  { title: "Total repositories", value: 10 },
  { title: "Total stars", value: 100 },
  { title: "Top language", value: "TypeScript" },
  { title: "Most productive day", value: "2024-01-01" },
  { title: "Total forks", value: 100 },
]

const UserProfile = () => {
  return (
    <div>
      {/* user avatar */}
      <div className="flex flex-col items-center justify-center gap-4">
        <Avatar className="size-24 rounded-full flex items-center justify-center overflow-hidden border-brand-600 border-4">
          <AvatarImage
            src="https://github.com/shadcn.png"
            className="object-cover size-full"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-semibold">Bossadi Zenith</h1>
          <p className="text-sm text-gray-500">@code-env</p>
          <p className="text-sm text-gray-500">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi rem
            numquam magni aut, repudiandae
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <Building2 className="size-4" />
            <span>Code Env</span>
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <MapPin className="size-4" />
            <span>Cameroon</span>
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <CalendarClock className="size-4" />
            <span>Joined 2024</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border border-gray-200 rounded-md p-2">
            <p className="text-sm font-semibold">10</p>
            <p className="text-sm text-gray-500">Following</p>
          </div>
          <div className="flex items-center gap-2 border border-gray-200 rounded-md p-2">
            <p className="text-sm font-semibold">10</p>
            <p className="text-sm text-gray-500">Followers</p>
          </div>
          <div className="flex items-center gap-2 border border-gray-200 rounded-md p-2">
            <p className="text-sm font-semibold">10</p>
            <p className="text-sm text-gray-500">Repos</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {nothingData.map((item, index) => (
            <Card className="p-4" key={index}>
              <p className="text-sm font-semibold">{item.value}</p>
              <p className="text-sm text-gray-500">{item.title}</p>
            </Card>
          ))}
        </div>
        <CommitGraph data={[]} />
      </div>
    </div>
  )
}

export default UserProfile
