import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { PostValidation } from "@/lib"
import { Models } from "appwrite"
import { useUserContext } from "@/context/AuthContext"
import { useToast } from "../ui/use-toast"
import { useNavigate } from "react-router-dom"
import { useCreatePost } from "@/lib/react-query/queriesAndMutations"

type PostFormProps = {
  post?: Models.Document;
}


const PostForm = ({post}: PostFormProps) => {
  const {mutateAsync: createPost, isPending: isCreatingPost} = useCreatePost();
  const {user} = useUserContext();
  const navigate = useNavigate();
  const {toast} = useToast();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post?.tags.join(",") : ''
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {
    const newPost = await createPost({
      ...values,
      userId: user.id
    })

    console.log('newPost');
    if(!newPost){
      toast({
        title: "Please try again!!"
      })
    }
    navigate("/");
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea placeholder="Caption" {...field} className="shad-textarea custom-scroll"/>
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photo</FormLabel>
              <FormControl>
                <FileUploader 
                fieldChange={field.onChange}
                mediaUrl = {post?.imageUrl} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Location</FormLabel>
              <FormControl>
                <Textarea placeholder="San Diego" {...field} className="shad-textarea custom-scroll"/>
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Tags</FormLabel>
              <FormControl>
                <Textarea placeholder="Art, Design, Travel" {...field} className="shad-textarea custom-scroll"/>
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
        <Button type="button" className="shad-button_dark_4">Cancel</Button>
        <Button type="submit" className="shad-button_primary whitespace-nowrap">Submit</Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm
