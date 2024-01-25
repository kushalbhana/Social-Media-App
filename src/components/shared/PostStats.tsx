import { Models } from "appwrite"

type PostStatsProps = {
    post: Models.Document;
    userId: string;
}

const PostStats = ({post, userId}: PostStatsProps) => {
  return (
    <div>
      Stats
    </div>
  )
}

export default PostStats
