"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CommitData, StatsData, UserData } from "@/lib/type"
import { format } from "date-fns"
import { Building2, CalendarClock, MapPin } from "lucide-react"
import { CommitGraph } from "./commit-graph"
import { Card } from "./ui/card"
interface UserProfileProps {
  userData: UserData
  statsData: StatsData[]
  commitsData: CommitData[]
}
const UserProfile = ({
  userData,
  statsData,
  commitsData,
}: UserProfileProps) => {
  const profileName = userData.name.split(" ").map((name) => name.charAt(0))

  // console.log(userData.repositories)

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-4">
        <Avatar className="size-24 rounded-full flex items-center justify-center overflow-hidden border-primary border-4">
          <AvatarImage
            src={userData.avatar}
            className="object-cover size-full"
          />
          <AvatarFallback>{profileName}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-semibold text-primary">
            {userData.name}
          </h1>
          <p className="text-sm text-muted-foreground">@{userData.username}</p>
          <p className="text-sm text-muted-foreground">{userData.bio}</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <Building2 className="size-4" />
            <span>{userData.company}</span>
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <MapPin className="size-4" />
            <span>{userData.location}</span>
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <CalendarClock className="size-4" />
            <span>
              Joined {format(new Date(userData.joinedDate), "MMMM d, yyyy")}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border border-border rounded-md p-2">
            <p className="text-sm font-semibold text-primary">
              {userData.following}
            </p>
            <p className="text-sm text-muted-foreground">Following</p>
          </div>
          <div className="flex items-center gap-2 border border-border rounded-md p-2">
            <p className="text-sm font-semibold text-primary">
              {userData.followers}
            </p>
            <p className="text-sm text-muted-foreground">Followers</p>
          </div>
          <div className="flex items-center gap-2 border border-border rounded-md p-2">
            <p className="text-sm font-semibold text-primary">
              {userData.repositories}
            </p>
            <p className="text-sm text-muted-foreground">Repos</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full">
          {statsData.map((item, index) => {
            const value = item.value.toString().split(",")[0]

            const isValidDate = !isNaN(new Date(value).getTime())
            const realDate = isValidDate
              ? format(new Date(value), "MMMM d, yyyy")
              : value

            return (
              <Card className="p-4 shadow-none flex flex-col gap-2" key={index}>
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 text-sm">{item.title}</p>
                  {/* <item.icon className="size-4" /> */}
                </div>
                <p className="text-sm font-semibold">{value}</p>
              </Card>
            )
          })}
        </div>
        <CommitGraph data={commitsData} />
      </div>
    </div>
  )
}

export default UserProfile
