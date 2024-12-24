export type CommitData = {
  month: string
  count: number
}

export type UserData = {
  name: string
  username: string
  bio: string
  avatar: string
  company: string
  location: string
  joinedDate: string
  following: number
  followers: number
  repositories: number
}

export type StatsData = {
  title: string
  value: number | string
  // icon: React.ElementType
}
