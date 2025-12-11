import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../Store/Reducers/AuthReducer";
import { RootState } from "../Store/store";

const ContactCard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.auth.user);

  return (
    <div className="max-w-md mx-auto z-10 bg-white shadow-md rounded-lg p-6 w-80 absolute right-16 sm:max-w-lg lg:max-w-xl">
      <div className="flex items-center justify-between space-x-4 mb-2">
        <ProfileImage
          onClick={() => navigate("/profile")}
          username={user?.username}
        />
        <SettingsIcon onClick={() => navigate("/profile")} />
      </div>

      <div className="border w-full mb-6"></div>

      {user && (
        <div className="space-y-4">
          <DetailRow label="Name" value={user.username} />
          <DetailRow label="Role" value={"admin"} />
          <DetailRow label="Email" value={user.email} />
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={() => dispatch(logout())}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

const ProfileImage = ({
  onClick,
  username,
}: {
  onClick: () => void;
  username?: string;
}) => (
  <div onClick={onClick} className="flex cursor-pointer items-center gap-2">
    <img
      className="w-16 h-16 rounded-full"
      src="https://uploads-ssl.webflow.com/647c2797a041413036e8e6fd/647d8981865d5dee2d03896e_Daco_5511364.png"
      alt="User Profile"
    />
    {username && <h2 className="text-xl font-semibold">{username}</h2>}
  </div>
);

const SettingsIcon = ({ onClick }: { onClick: () => void }) => (
  <div onClick={onClick} className="hover:cursor-pointer">
    <i className="pi pi-spin pi-cog"></i>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-600 mr-2">{label} </span>
    <span className="text-gray-900 font-medium text-center">{value}</span>
  </div>
);

export default ContactCard;
