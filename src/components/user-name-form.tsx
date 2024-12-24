"use client"

import { client } from "@/app/lib/client"
import { Button } from "@/components/ui/button"
import html2canvas from "html2canvas"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { usernameSchema } from "@/lib/schema"

import { CommitData, StatsData, UserData } from "@/lib/type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Image } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import UserProfile from "./user-profile"

const UsernameForm = () => {
  const [commitsData, setCommitsData] = useState<CommitData[]>([])
  const [userData, setUserData] = useState<UserData>()
  const [statsData, setStatsData] = useState<StatsData[] | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const { mutate, isPending, data } = useMutation({
    mutationFn: async (username: string) => {
      const res = await client.github.getUser.$get({ username })
      return res
    },
  })

  const receivedData = async () => {
    const newData = await data?.json()
    setCommitsData(newData?.commitsData ?? [])
    setUserData(newData?.user as unknown as UserData)
    setStatsData(newData?.stats as unknown as StatsData[])
  }

  useEffect(() => {
    receivedData()
  }, [data])

  const form = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof usernameSchema>) => {
    mutate(values.name)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-10 max-w-3xl w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex gap-4 items-end"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-primary">Your name</FormLabel>
                <FormControl>
                  <Input placeholder="GitHub username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Loading..." : "Submit"}
          </Button>
        </form>
      </Form>
      {isPending && (
        <div className="rounded-xl border bg-card animate-pulse text-card-foreground shadow p-4 h-[319.588px] w-full" />
      )}
      {userData && statsData && (
        <>
          <UserProfile
            userData={userData}
            statsData={statsData}
            commitsData={commitsData}
          />
          <TakeASnapshot
            username={userData?.username ?? ""}
            canvasRef={canvasRef}
          />
        </>
      )}
    </div>
  )
}

interface TakeASnapshotProps {
  username: string
  canvasRef: React.RefObject<HTMLCanvasElement>
}

const TakeASnapshot = ({ username, canvasRef }: TakeASnapshotProps) => {
  const captureSnapshot = async () => {
    const elementToCapture = document.body
    if (!elementToCapture) return

    try {
      const canvas = await html2canvas(elementToCapture, {
        useCORS: true,
        scale: 10,
      })

      const image = canvas.toDataURL("image/png")
      const a = document.createElement("a")

      a.href = image

      a.download = `${username}-recap-snapshot.png`
      a.click()
    } catch (error: any) {
      console.error(error.message)
    }
  }

  return (
    <div className="fixed bottom-4 right-4">
      <Button variant="outline" onClick={captureSnapshot}>
        Save Snapshot <Image className="w-4 h-4" />
      </Button>
    </div>
  )
}

export default UsernameForm
