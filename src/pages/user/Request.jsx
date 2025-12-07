import { useEffect, useState } from "react";
import { userInvites } from "../../api/services/channelService";

function Request() {
  const [requests, setRequests] = useState(null);

  useEffect(() => {
    const fetchUserReq = async () => {
      try {
        const data = await userInvites();
        console.log("user invites data: ", data);
        setRequests(data?.requests);
      } catch (e) {
        console.log(e);
      }
    };
    fetchUserReq();
  }, []);

  return (
    <div>
      {requests && requests.length > 0 ? (
        <div>
          {requests.map((r) => (
            <li>{r?.status}</li>
          ))}
        </div>
      ) : (
        <div>
          <h1>No request</h1>
        </div>
      )}
    </div>
  );
}

export default Request;
