"use client"

import { client } from "@/app/lib/client"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usernameSchema } from "@/lib/schema"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CommitGraph } from "./commit-graph"
import { CommitData } from "@/lib/type"
import { useState, useEffect } from "react"

const UsernameForm = () => {
  const [commitsData, setCommitsData] = useState<CommitData[]>([])

  const { mutate, isPending, data } = useMutation({
    mutationFn: async (username: string) => {
      const res = await client.github.getUser.$get({ username })
      return res
    },
  })

  const receivedData = async () => {
    const newData = await data?.json()
    setCommitsData(newData?.commitsData ?? [])
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
    <div className="flex flex-col items-center justify-center gap-10 max-w-xl w-full">
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
                <FormLabel>Your name</FormLabel>
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
        <div className="rounded-xl border bg-card animate-pulse text-card-foreground shadow p-4 h-[319.588px] w-[573.49px]" />
      )}
      {commitsData.length > 0 && <CommitGraph data={commitsData} />}
    </div>
  )
}

export default UsernameForm
