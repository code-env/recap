import { Octokit } from "octokit"
import { CommitData } from "./type"

// Function to create an Octokit instance dynamically with the user-provided token
const createOctokitInstance = (token: string) => {
  return new Octokit({
    auth: token,
  })
}

export const getMonthlyCommitsData = async (
  username: string,
  token: string
) => {
  const octokit = createOctokitInstance(token)
  const year = new Date().getFullYear()
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  )

  const commitsCount: CommitData[] = months.map((month) => ({
    month,
    count: 0,
  }))

  try {
    const repos = await octokit.rest.repos.listForUser({
      username,
      per_page: 500,
    })

    let totalCommits = 0
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
          totalCommits = commitsCount[monthIndex].count
        }
      }
    }

    console.log({ totalCommits })

    return commitsCount
  } catch (error) {
    console.error("Error fetching commits:", error)
    throw error
  }
}

// Fetch followers gained in a specific year
export const getFollowersGainedThisYear = async (
  username: string,
  token: string,
  year: number
) => {
  const octokit = createOctokitInstance(token) // Use the user-provided token

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
