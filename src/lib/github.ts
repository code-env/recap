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
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN as string}`,
      },
    })

    let totalCommits = 0
    for (const repo of repos.data) {
      const commits = await octokit.rest.repos.listCommits({
        owner: username,
        repo: repo.name,
        since: `${year}-01-01T00:00:00Z`,
        until: `${year}-12-31T23:59:59Z`,
        per_page: 1000,
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

const currentYear = new Date().getFullYear()

export const getYearlyGitHubStats = async (username: string, token: string) => {
  try {
    const octokit = createOctokitInstance(token)
    const repos = await octokit.rest.repos.listForUser({
      username,
      per_page: 500,
    })

    const user = await octokit.rest.users.getByUsername({ username })

    console.log({ user })

    const repoData = repos.data

    let totalCommits = 0
    let repoCommits: Record<string, number> = {}
    let repoStars: Record<string, number> = {}
    let dailyCommits: Record<string, number> = {}
    let languageUsage: Record<string, number> = {}
    let totalForks = 0
    let createdReposThisYear = 0
    let totalFilesPushed = 0

    for (const repo of repoData) {
      const commits = await octokit.rest.repos.listCommits({
        owner: username,
        repo: repo.name,
        since: `${currentYear}-01-01T00:00:00Z`,
        until: `${currentYear}-12-31T23:59:59Z`,
        per_page: 1000,
      })

      // Count commits
      const commitCount = commits.data.length
      totalCommits += commitCount
      repoCommits[repo.name] = commitCount

      // Count daily commits
      for (const commit of commits.data) {
        const commitDate = new Date(commit.commit.author?.date || "")
          .toISOString()
          .split("T")[0]
        dailyCommits[commitDate] = (dailyCommits[commitDate] || 0) + 1
      }

      // Aggregate stars
      repoStars[repo.name] = repo.stargazers_count || 0

      // Count forks
      totalForks += repo.forks_count || 0

      // Count repos created this year
      if (new Date(repo.created_at || "").getFullYear() === currentYear) {
        createdReposThisYear++
      }

      // Aggregate language usage
      const languages = await octokit.rest.repos.listLanguages({
        owner: username,
        repo: repo.name,
      })
      for (const [language, bytes] of Object.entries(languages.data)) {
        languageUsage[language] = (languageUsage[language] || 0) + bytes
      }
    }

    // Fetch issues
    const issues = await octokit.rest.issues.listForAuthenticatedUser({
      filter: "created",
      state: "all",
      per_page: 100,
    })
    const openedIssues = issues.data.filter(
      (issue) =>
        !issue.pull_request &&
        new Date(issue.created_at).getFullYear() === currentYear
    ).length
    const closedIssues = issues.data.filter(
      (issue) =>
        issue.closed_at &&
        new Date(issue.closed_at).getFullYear() === currentYear
    ).length

    // Fetch PRs
    let totalPRs = 0
    let mergedPRs = 0
    for (const repo of repoData) {
      const prs = await octokit.rest.pulls.list({
        owner: username,
        repo: repo.name,
        state: "all",
        per_page: 100,
      })
      totalPRs += prs.data.filter(
        (pr) => new Date(pr.created_at).getFullYear() === currentYear
      ).length
      mergedPRs += prs.data.filter(
        (pr) =>
          pr.merged_at && new Date(pr.merged_at).getFullYear() === currentYear
      ).length
    }

    // Find most committed repo
    const mostCommittedRepo =
      Object.entries(repoCommits).sort((a, b) => b[1] - a[1])[0] || null

    // Find most starred repo
    const mostStarredRepo =
      Object.entries(repoStars).sort((a, b) => b[1] - a[1])[0] || null

    // Find most productive day
    const mostProductiveDay =
      Object.entries(dailyCommits).sort((a, b) => b[1] - a[1])[0] || null

    // Find top language
    const topLanguage =
      Object.entries(languageUsage).sort((a, b) => b[1] - a[1])[0] || null

    return {
      totalCommits,
      mostCommittedRepo,
      mostStarredRepo,
      createdReposThisYear,
      totalPRs,
      mergedPRs,
      openedIssues,
      closedIssues,
      mostProductiveDay,
      totalForks,
      topLanguage,
      totalFilesPushed,
    }
  } catch (error) {
    console.error("Error fetching GitHub stats:", error)
    throw error
  }
}
