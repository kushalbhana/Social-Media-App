import { useUserContext } from "@/context/AuthContext"
import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetUserPosts,
   useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { useParams, Link } from "react-router-dom";



export default function Component() {
  const { user } = useUserContext();
  const { id } = useParams<{id: string}>();

  const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(id);
  const { data: userDetails, isLoading: isUserDetailsLoading
  } = useGetUserById(id);
  console.log(userDetails)
  const relatedPosts = userPosts?.documents.filter(
    (userPost) => userPost.$id !== id
  );


  if (isUserDetailsLoading) return( <Loader />)
  return (
   
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Profile</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4 py-4">
          <img src={userDetails && userDetails.imageUrl} alt="/assets/icons/profile-placeholder.svg" className="rounded-full h-20 w-20 md:h-36 md:w-36" />
          <div className="name">
            <div className="flex">
            <h2 className=" h4-bold mx-6 md:h2-bold md:mx-10">{userDetails && userDetails.name}</h2>
            <Link to = {`/update-profile/${userDetails.$id}`}>
            {userDetails && (userDetails.$id === user.id) ? (<img src="/assets/icons/edit.svg" height={20} width={20} alt="edit" className="align-right" />) : (null)}
            </Link>
            
            </div>
            
            <h3 className="mx-6 h4 md:mx-10">{`@${userDetails && userDetails.username}`}</h3>
            <div>
              <p className="mx-6 md:mx-10 mt-2 max-w-44">{userDetails && userDetails.bio}</p>
            </div>
          </div>

          <div className="stats">

          </div>
        </div>
        <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          Posts By User
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

