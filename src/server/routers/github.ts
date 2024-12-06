import { getFollowersGainedThisYear, getMonthlyCommitsData } from "@/lib/github"
import { z } from "zod"
import { router } from "../__internals/router"
import { publicProcedure } from "../procedures"

export const githubRouter = router({
  getUser: publicProcedure
    .input(z.object({ username: z.string().min(1) }))
    .query(async ({ ctx, c, input }) => {
      const { username } = input
      const commitsData = await getMonthlyCommitsData(
        username,
        process.env.GITHUB_TOKEN as string
      )

      const followersGainedThisYear = await getFollowersGainedThisYear(
        username,
        process.env.GITHUB_TOKEN as string,
        new Date().getFullYear()
      )
      return c.superjson({
        commitsData,
        followersGainedThisYear,
      })
    }),
})
