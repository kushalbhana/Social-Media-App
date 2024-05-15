// import { useParams } from "react-router-dom";
import { ProfileForm } from "@/components/forms/ProfileForm";

// import { ProfileForm } from "../../components/forms/ProfileForm";


const UpdateProfile = () => {

  // const {id} = useParams();
  // const {data: In, isPending} = useGetUserById(id || "");
  return (
    <div>
      <div className='top-details'>
        <div className="profile-picture">
          <ProfileForm />
        </div>
      </div>
    </div>
  )
}

export default UpdateProfile
