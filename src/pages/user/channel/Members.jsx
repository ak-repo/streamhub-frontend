import { useChannel } from "../../../context/context";

export default function Members() {
  const { members, isOwner } = useChannel();

  const handleAddMember = () => {
    // Add your add member logic here
    console.log("Add member clicked");
  };

  const handleDeleteMember = (memberId) => {
    // Add your delete member logic here
    console.log("Delete member:", memberId);
  };

  return (
    <div className="dark:bg-gray-800 min-h-full rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Channel Members</h2>
        <div className="flex space-x-3">
          <button
            onClick={handleAddMember}
            className="bg-sky-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
          >
            Add Member
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {members && members.length > 0 ? (
          members.map((member) => (
            <div
              key={member.userId}
              className="border border-sky-500 rounded-lg p-4 dark:bg-gray-800 hover:bg-sky-900 transition duration-150"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-white">
                    {member.username}
                  </p>
                  <p className="text-sm text-gray-500">ID: {member.userId}</p>
                </div>
                {isOwner && (
                  <button
                    onClick={() => handleDeleteMember(member.userId)}
                    className="bg-sky-950 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition duration-200"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No members found.</p>
            <p className="text-gray-400 text-sm mt-2">
              Add members to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
