import pool from "../config/db.js";
import { uploadToCloudinary, deleteImageByUrl } from "../middlewares/upload-middleware.js";

export const getRooms = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM rooms");
    return res.status(200).json({
      status: "success",
      data: rows,
      message: 'Rooms retrieved successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Database error",
      errorCode: 'ERR_DATABASE',
      data: null
    });
  }
};

export const getRoomById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query("SELECT * FROM rooms WHERE id = ?", [id]);
    if (rows.length > 0) {
      return res.status(200).json({
        status: "success",
        data: rows[0],
        message: 'Room retrieved successfully',
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Room not found",
        errorCode: 'ERR_ROOM_NOT_FOUND',
        data: null
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Database error",
      errorCode: 'ERR_DATABASE',
      data: null
    });
  }
};

export const createRoom = async (req, res) => {
  try {
    const { roomName, description, facilities } = req.body;

    const capacity = parseInt(req.body.capacity);

    let imageUrl = null;

    if (!roomName|| !description || !facilities) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required fields',
            errorCode: 'ERR_MISSING_FIELDS',
            data: null,
        });
    }

    if (capacity <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Capacity must be greater than 0",
        errorCode: 'ERR_INVALID_INPUT',
        data: null
      });
    }

    if (typeof capacity !== "number") {
      return res.status(400).json({
        status: "error",
        message: "Capacity must be a number",
        errorCode: 'ERR_INVALID_INPUT',
        data: null
      });
    }

    if (req.file) {

      const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      imageUrl = cloudinaryResult.secure_url;
    }

    let parsedFacilities = facilities;
    if (typeof facilities === 'string') {
      try {
        parsedFacilities = JSON.parse(facilities);
      } catch (e) {
        parsedFacilities = [facilities];
      }
    }




    const [rows] = await pool.query(
      "SELECT id FROM rooms ORDER BY id DESC LIMIT 1",
    );
    const roomCode = "ROOM-" + (rows[0].id + 1);

    const [result] = await pool.query(
      "INSERT INTO rooms (room_code, room_name, capacity, description, facilities, image_url) VALUES (?, ?, ?, ?, ?, ?)",
      [roomCode, roomName, capacity, description, JSON.stringify(parsedFacilities), imageUrl],
    ); // Convert facilities array to JSON string

    if (result.affectedRows > 0) {
      return res.status(201).json({
        status: "success",
        message: 'Room created successfully',
        data: {
          id: result.insertId,
          roomName,
          capacity,
          description,
          facilities,
        },
      });
    } else {
      return res.status(500).json({
        status: "error",
        message: "Failed to create room",
        errorCode: 'ERR_CREATE_FAILED'
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: err.message,
      errorCode: 'ERR_DATABASE',
      data: null
    });
  }
};

export const deleteRoom = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM rooms WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: "success",
        message: "Room deleted successfully",
        data: null
      });
    }
    else {
      return res.status(404).json({
        status: 'error',
        message: 'Room not found to delete',
        errorCode: 'ERR_ROOM_NOT_FOUND',
        data: null
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Database error",
      errorCode: 'ERR_DATABASE',
      data: null
    });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { roomName, facilities, description } = req.body;
    const { id } = req.params;

    const capacity = parseInt(req.body.capacity);


    if (!roomName || !capacity || !facilities || !description || !id) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
        errorCode: 'ERR_MISSING_FIELDS',
        data: null
      });
    }

    if (capacity <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Capacity must be greater than 0",
        errorCode: 'ERR_INVALID_INPUT',
        data: null
      });
    }

    if (typeof capacity !== "number") {
      return res.status(400).json({
        status: "error",
        message: "Capacity must be a number",
        errorCode: 'ERR_INVALID_INPUT',
        data: null
      });
    }

    let parsedFacilities = facilities;
    if (typeof facilities === 'string') {
      try {
        parsedFacilities = JSON.parse(facilities);
      } catch (e) {
        parsedFacilities = [facilities];
      }
    }

    const oldRoomResult = await pool.query("SELECT * FROM rooms WHERE id = ?", [id]);
    if (oldRoomResult[0].length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Room not found",
        errorCode: 'ERR_ROOM_NOT_FOUND',
        data: null
      });
    }

    const oldImageUrl = oldRoomResult[0][0].image_url;
    let finalImageUrl = oldImageUrl;

    if (req.file) {

      const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      finalImageUrl = cloudinaryResult.secure_url;

      // Lang
      if (oldImageUrl) {
        await deleteImageByUrl(oldImageUrl);
      }
    }




    const [result] = await pool.query(
      "UPDATE rooms SET room_name = ?, capacity = ?, description = ?, facilities = ?, image_url = ? WHERE id = ? ",
      [roomName, capacity, description, JSON.stringify(parsedFacilities), finalImageUrl, id],
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: "success",
        message: "Room updated successfully",
        data: {
          id,
          roomName,
          capacity,
          description,
          facilities,
          finalImageUrl,
        },
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Room not found",
        errorCode: 'ERR_ROOM_NOT_FOUND',
        data: null
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Database error",
      errorCode: 'ERR_DATABASE',
      data: null
    });
  }
};
