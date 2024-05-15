import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import FileUploader from "../shared/FileUploader"
import { useGetUserById } from "@/lib/react-query/queriesAndMutations"


const formSchema = z.object({
    username: z.string().min(2).max(50),
    name: z.string().min(6).max(20),
    email: z.string().email(),
    bio: z.string().max(50),
    password: z.string().min(6).max(100)
})

export function ProfileForm() {

    const { id } = useParams();
    const {data: userDetails, isLoading: isUserLoading} = useGetUserById(id);
    console.log(userDetails);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: "",
        name: "",
        email: ""
      },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      console.log(values)
    }

    if (isUserLoading) return <p>Loading...</p>

    
    return (

        <div>

            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <div className="flex gap-14">

                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="shad-form_label">Add Photo</FormLabel>
                    <FormControl>
                        <FileUploader 
                        fieldChange={field.onChange}
                        mediaUrl = {userDetails && userDetails?.imageUrl} />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                    </FormItem>
                )}
                />




                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                        This is your public display name.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit">Submit</Button>

                </div>
            </form>
            </Form>

        </div>
      )
  }
