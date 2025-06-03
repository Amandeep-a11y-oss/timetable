import React, { useEffect, useState } from 'react';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import { useNavigate } from "react-router-dom";
import timetableStore from "../store/timetableStore";

function Group() {
  const {
    CreateGroup,
    ReadGroup,
    UpdateGroup,
    DeleteGroup,
    utilsGroup,
    error
  } = timetableStore();

  const [groupName, setGroupName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    ReadGroup();
  }, [ReadGroup]);

  const handleEditGroup = (group) => {
    setGroupName(group.groupName);
    setEditingId(group._id);
  };

  const handleDeleteGroup = async (id) => {
    try {
      await DeleteGroup(id);
      await ReadGroup();
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("Failed to delete group");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await UpdateGroup(editingId, { groupName });
        alert("Group updated successfully!");
      } else {
        await CreateGroup({ groupName });
        alert("Group created successfully!");
      }

      setGroupName("");
      setEditingId(null);
      navigate(0);
    } catch (error) {
      console.error(error);
      alert('Failed to submit group');
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-4 text-black">
        {editingId ? "Edit Group" : "Create a Group"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          placeholder="Enter Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
        />
        <p className='text-red-500'>{error}</p>

        <div className="text-center">
          <Button type="submit" variant="solid" className="w-full bg-blue-600 hover:bg-blue-700">
            {editingId ? "Update Group" : "Create Group"}
          </Button>
        </div>
      </form>

      <div className="max-h-48 overflow-y-auto mt-4">
        <h3 className="text-black mb-2">Group List</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-800">
          {utilsGroup.data?.map((group) => (
            <li
              key={group._id}
              className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded shadow-sm"
            >
              <span className="text-gray-800 font-medium">{group.groupName}</span>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditGroup(group)}
                  className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteGroup(group._id)}
                  className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md shadow"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Group;
