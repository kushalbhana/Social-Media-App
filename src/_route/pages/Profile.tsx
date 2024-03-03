
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useUserContext } from "@/context/AuthContext"
import GridPostList from "@/components/shared/GridPostList";
import { useGetUserPosts } from "@/lib/react-query/queriesAndMutations";

export default function Component() {
  const { user } = useUserContext();

  const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(user.$id);
  


  return (

    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img src={user.imageUrl} alt="/assets/icons/profile-placeholder.svg" className="rounded-full" height={150} width={150}/>
          <div className="name">
            <div className="flex">
            <h2 className="h2-bold mx-10">{user.name}</h2>
            <img src="/assets/icons/edit.svg" height={20} width={20} alt="edit" className="align-right" />
            </div>
            
            <h3 className="h3 mx-10">{`@${user.username}`}</h3>
          </div>

          <div className="stats">

          </div>
        </div>
        <h2 className="h2-bold"> Work In Progress</h2>
    </div>
    </div>
    
  )
}

