import { useChannel } from "../../../context/context";

export default function Members() {
  const { members } = useChannel();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Members</h2>

      <div className="space-y-2">
        {members && members.length > 0 ? (
          members.map((meb) => (
            <div key={meb.user_id} className="border p-3 rounded bg-white">
              <p className="font-medium">Name: {meb.username}</p>
              <p className="text-sm text-gray-600">ID: {meb.user_id}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No members found.</p>
        )}
      </div>
    </div>
  );
}
