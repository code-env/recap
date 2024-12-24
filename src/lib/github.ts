import { Octokit } from "octokit"
import type { CommitData } from "./type"
import type { OAuthStrategy } from "@clerk/types"
import { auth, clerkClient } from "@clerk/nextjs/server"

const createOctokitInstance = (token: string) => {
  return new Octokit({ auth: token })
}

const getAccessToken = async (): Promise<string> => {
  const { userId } = await auth()
  const client = await clerkClient()

  if (!userId) {
    throw new Error("User not found")
  }

  const provider: OAuthStrategy = "oauth_github"
  const clerkResponse = await client.users.getUserOauthAccessToken(
    userId,
    provider
  )

  return clerkResponse.data[0]?.token || ""
}

export const getMonthlyCommitsData = async (
  username: string,
  authToken: string
): Promise<CommitData[]> => {
  const { userId } = await auth()
  const token = await getAccessToken()

  if (!userId) {
    throw new Error("User not found")
  }

  const octokit = createOctokitInstance(token)
  const year = new Date().getFullYear()
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  )

  try {
    const repos = await octokit.rest.repos.listForUser({
      username,
      per_page: 500,
      headers: {
        authorization: `token ${token}`,
      },
    })

    console.log(repos.data.length)

    const commitsCount: CommitData[] = months.map((month) => ({
      month,
      count: 0,
    }))

    for (const repo of repos.data) {
      const commits = await octokit.rest.repos.listCommits({
        owner: username,
        repo: repo.name,
        since: `${year}-01-01T00:00:00Z`,
        until: `${year}-12-31T23:59:59Z`,
      })

      for (const commit of commits.data) {
        const commitDate = new Date(commit.commit.author?.date || "")
        if (commitDate.getFullYear() === year) {
          const monthIndex = commitDate.getMonth()
          commitsCount[monthIndex].count++
        }
      }
    }

    return commitsCount
  } catch (error) {
    console.error("Error fetching commits:", error)
    throw error
  }
}

export const getFollowersGainedThisYear = async (
  username: string,
  token: string,
  year: number
): Promise<number> => {
  const octokit = createOctokitInstance(token)

  try {
    const followers = await octokit.rest.users.listFollowersForUser({
      username,
    })
    return followers.data.length
  } catch (error) {
    console.error("Error fetching followers:", error)
    throw error
  }
}

export const getYearlyGitHubStats = async (
  username: string,
  token: string
): Promise<Record<string, any>> => {
  const octokit = createOctokitInstance(token)
  const year = new Date().getFullYear()

  try {
    const repos = await octokit.rest.repos.listForAuthenticatedUser({
      per_page: 100,
      visibility: "all",
    })

    const user = await octokit.rest.users.getByUsername({ username })

    let totalCommits = 0
    const repoCommits: Record<string, number> = {}
    const dailyCommits: Record<string, number> = {}
    const languageUsage: Record<string, number> = {}

    for (const repo of repos.data) {
      const commits = await octokit.rest.repos.listCommits({
        owner: username,
        repo: repo.name,
        since: `${year}-01-01T00:00:00Z`,
        until: `${year}-12-31T23:59:59Z`,
      })

      const commitCount = commits.data.length
      totalCommits += commitCount
      repoCommits[repo.name] = commitCount

      for (const commit of commits.data) {
        const commitDate = new Date(commit.commit.author?.date || "")
          .toISOString()
          .split("T")[0]
        dailyCommits[commitDate] = (dailyCommits[commitDate] || 0) + 1
      }

      const languages = await octokit.rest.repos.listLanguages({
        owner: username,
        repo: repo.name,
      })
      for (const [language, bytes] of Object.entries(languages.data)) {
        languageUsage[language] = (languageUsage[language] || 0) + bytes
      }
    }

    return {
      user,
      totalCommits,
      repoCommits,
      dailyCommits,
      languageUsage,
    }
  } catch (error) {
    console.error("Error fetching GitHub stats:", error)
    throw error
  }
}
