import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { LoadingContext, LoggedInContext, UserContext } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import { colourStyles, timeIntervals } from "../utils/selectSettings";
import { useNavigate } from "react-router-dom";
import jordan from "../assets/landing/jordan.jpeg";
import UserListCard from "../components/UserListCard";
import InvitedUserCard from "../components/InvitedUserCard";

function Preferences() {
  const { setLoading } = useContext(LoadingContext);
  const { user } = useContext(UserContext);
  const { setIsLoggedIn } = useContext(LoggedInContext);
  const navigate = useNavigate();

  const [dailyKetchupTime, setDailyKetchupTime] = useState("");
  const [organisationId, setOrganisationId] = useState();
  const [inviteeEmail, setInviteeEmail] = useState("");

  const users = [
    {
      id: 1,
      name: "Jordan Ang",
      email: "jordanahahahahhahahahyd@gmail.com",
    },
    {
      id: 2,
      name: "Jaelyn Teo",
      email: "jteohn@gmail.com",
    },
    { id: 3, name: "Sam", email: "sam@sam.com" },
    { id: 4, name: "Foong", email: "foong@foong.com" },
  ];

  useEffect(() => {
    const getOrganisationPreferences = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DB_API}/admin/${user.organisationId}`
        );
        setDailyKetchupTime({
          value: response.data.data.time,
          label: response.data.data.time.slice(0, 5),
        });
        setOrganisationId(response.data.data.id);
      } catch (error) {
        toast.error(error.response.data.msg);
      } finally {
        setLoading(false);
      }
    };

    getOrganisationPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateDailyKetchupTime = async (value) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${process.env.REACT_APP_DB_API}/admin/${organisationId}`,
        {
          time: value.value.slice(0, 5),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setDailyKetchupTime({
        value: response.data.data.time,
        label: response.data.data.time.slice(0, 5),
      });
      toast.success("Successfully updated Daily Ketchup Timing");
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  const handleInvite = async () => {
    // TODO: send email & ?? to BE
    if (inviteeEmail === "") {
      toast.error("Invitee email is empty");
      return;
    }
    console.log(inviteeEmail);
    setInviteeEmail("");
    toast.success("Invite sent!");
  };

  const handleLogout = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DB_API}/auth/logout`,
        {
          userId: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success(`${response.data.msg}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(`${error.response.data.msg}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen mt-4 mx-4 min-w-[calc(100vw_-_5rem)] lg:min-w-[calc(100vw_-_9rem)]">
      {/* Header */}
      <div className="border-b border-base-100 flex items-center justify-between py-2 overflow-hidden">
        <h2 className="text-2xl font-bold">Preferences</h2>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-neutral normal-case rounded-xl btn-sm"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>

      {/* Body */}
      <motion.div
        layout
        className="mt-2 max-w-[calc(100vw_-_5rem)] lg:max-w-[calc(100vw_-_9rem)] flex flex-col gap-4"
      >
        <motion.div
          layout="position"
          className="flex flex-col gap-4 xl:flex-row xl:gap-4"
        >
          {/* Organisation Standup Time Preferences - for Admin */}
          <div className="flex flex-col gap-2 shadow-lg px-2 pt-2 pb-4 lg:px-4 rounded-lg min-w-full lg:min-w-[50%] lg:max-w-min">
            <div className="min-w-full lg:min-w-0 lg:mx-">
              <h3 className="text-lg font-semibold">Daily Ketchup Timing</h3>
              <Select
                className="font-semibold text-xs cursor-pointer"
                styles={colourStyles}
                options={timeIntervals}
                onChange={handleUpdateDailyKetchupTime}
                value={dailyKetchupTime}
                placeholder="Select a timing..."
              />
            </div>

            {/* User List */}
            <div className="flex flex-col gap-2 min-w-full lg:min-w-0">
              <h3 className="text-lg font-semibold">Users List</h3>
              {/* User List Card */}
              {users.map((user) => (
                <UserListCard
                  key={user.id}
                  profilePicture={jordan}
                  name={user.name}
                  email={user.email}
                />
              ))}
            </div>
          </div>

          {/* Invited Users List */}
          <div className="flex flex-col gap-2 shadow-lg px-2 pt-2 pb-4 rounded-lg min-w-full lg:min-w-[50%] lg:max-w-min lg:px-4">
            {/* Invite User */}
            <div className="flex flex-col items-start justify-center gap-2 min-w-full lg:min-w-0">
              <h3 className="text-lg font-semibold">Invite</h3>
              <div className="flex w-full gap-2">
                <input
                  type="text"
                  className="input input-sm text-sm w-full rounded-xl"
                  value={inviteeEmail}
                  onChange={(e) => setInviteeEmail(e.target.value)}
                />
                <button
                  className="btn btn-neutral normal-case rounded-xl btn-sm"
                  onClick={handleInvite}
                >
                  Invite
                </button>
              </div>
            </div>
            <h3 className="text-sm font-semibold">Invited</h3>
            {/* Pending User Card */}
            {users.map((user) => (
              <InvitedUserCard key={user.id} email={user.email} />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Preferences;
