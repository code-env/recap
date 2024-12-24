import { getMonthlyCommitsData, getYearlyGitHubStats } from "@/lib/github"
import { z } from "zod"
import { router } from "../__internals/router"
import { publicProcedure } from "../procedures"
import { format } from "date-fns"

export const githubRouter = router({
  getUser: publicProcedure
    .input(z.object({ username: z.string().min(1) }))
    .query(async ({ ctx, c, input }) => {
      const { username } = input
      const commitsData = await getMonthlyCommitsData(
        username,
        process.env.GITHUB_TOKEN as string
      )
      const yearlyStats = await getYearlyGitHubStats(
        username,
        process.env.GITHUB_TOKEN as string
      )

      const user = yearlyStats.user.data

      return c.superjson({
        commitsData,
        yearlyStats,
        user: {
          name: user.name,
          username: user.login,
          bio: user.bio,
          avatar: user.avatar_url,
          company: user.company,
          location: user.location,
          joinedDate: user.created_at,
          following: user.following,
          followers: user.followers,
          repositories: user.public_repos,
        },
        stats: [
          {
            title: "Total commits",
            value: yearlyStats.totalCommits,
            // icon: UserIcon,
          },
          {
            title: "Most Starred Repo",
            value: yearlyStats.mostStarredRepo,
            // icon: UserIcon,
          },
          {
            title: "Most Committed Repo",
            value: yearlyStats.mostCommittedRepo,
            // icon: UserIcon,
          },
          {
            title: "Top Language",
            value: yearlyStats.topLanguage,
            // icon: UserIcon,
          },
          {
            title: "Most Productive Day",
            value: yearlyStats.mostProductiveDay,
            // icon: UserIcon,
          },
          {
            title: "Total Forks",
            value: yearlyStats.totalForks,
            // icon: UserIcon,
          },
        ],
      })
    }),
})
