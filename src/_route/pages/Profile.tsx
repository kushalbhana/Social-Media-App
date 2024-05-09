import { useUserContext } from "@/context/AuthContext"
import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetUserPosts } from "@/lib/react-query/queriesAndMutations";

export default function Component() {
  const { user } = useUserContext();

  const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(user.id);
  const relatedPosts = userPosts?.documents.filter(
    (userPost) => userPost.$id !== user.id
  );

  return (

    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Profile</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4 py-4">
          <img src={user.imageUrl} alt="/assets/icons/profile-placeholder.svg" className="rounded-full h-36 w-36" />
          <div className="name">
            <div className="flex">
            <h2 className="h2-bold mx-10">{user.name}</h2>
            <img src="/assets/icons/edit.svg" height={20} width={20} alt="edit" className="align-right" />
            </div>
            
            <h3 className="h3 mx-10">{`@${user.username}`}</h3>
            <div>
              <p className="mx-10 mt-2 max-w-44">{user.bio}</p>
            </div>
          </div>

          <div className="stats">

          </div>
        </div>
        <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} />
        )}
      </div>
    </div>
    </div>
    
  )
}

