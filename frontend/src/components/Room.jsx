import React, { useEffect, useState } from 'react';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import { useNavigate } from "react-router-dom";
import timetableStore from "../store/timetableStore";

function Room() {
  const {
    CreateRoom,
    error,
    ReadRoom,
    utilsRoom,
    UpdateRoom,
    DeleteRoom
  } = timetableStore();

  const [roomName, setRoomName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    ReadRoom();
  }, [ReadRoom]);

  const handleEditInit = (room) => {
    setIsEditing(true);
    setRoomName(room.roomName);
    setEditingId(room._id);

  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await UpdateRoom(editingId, { roomName });
      setIsEditing(false);
      setRoomName("");
      setEditingId(null);
      alert("Room updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update room");
    }
  };

  const handleDelete = async (id) => {
    try {
      await DeleteRoom(id);
      await ReadRoom();
    } catch (error) {
      console.error(error);
      alert("Failed to delete room");
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await CreateRoom({ roomName });
      setRoomName("");
      alert("Room created successfully!");
      navigate(0);
    } catch (error) {
      console.error(error);
      alert("Failed to create room");
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-4 text-black">
        {isEditing ? "Edit Room" : "Create a Room"}
      </h2>

      <form onSubmit={isEditing ? handleEditSubmit : handleCreateSubmit} className="space-y-6">
        <Input
          placeholder="Enter room"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
        <p className='text-red-500'>{error}</p>

        <div className="text-center">
          <Button type="submit" variant="solid" className="w-full bg-blue-600 hover:bg-blue-700">
            {isEditing ? "Update Room" : "Create Room"}
          </Button>
        </div>
      </form>

      <div className="max-h-48 overflow-y-auto mt-4">
        <h3 className="text-black mb-2">Room List</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-800 mt-4">
          {utilsRoom.data?.map((room) => (
            <li
              key={room._id}
              className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded shadow-sm"
            >
              <span className="text-gray-800 font-medium">{room.roomName}</span>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditInit(room)}
                  className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(room._id)}
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

export default Room;
