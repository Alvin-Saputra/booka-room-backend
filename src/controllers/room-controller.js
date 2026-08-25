import pool from "../config/db.js";
import { uploadToCloudinary, deleteImageByUrl } from "../middlewares/upload-middleware.js";
import { eq } from "drizzle-orm";
import { orm } from "../database/orm.js";
import { rooms } from "../database/schema.js";
import { desc } from "drizzle-orm";

export const getRooms = async (req, res) => {
  try {
    const allRooms = await orm.select().from(rooms);
    return res.status(200).json({
      status: "success",
      data: allRooms,
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
    const specificRoom = await orm.select().from(rooms).where(eq(rooms.id, id));
    if (specificRoom) {
      return res.status(200).json({
        status: "success",
        data: specificRoom,
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

    const [specificRoom] = await orm.select().from(rooms).orderBy(desc(rooms.id)).limit(1);
    const roomCode = "ROOM-" + (specificRoom.id + 1);

    const [result] = await orm.insert(rooms).values({
      room_code: roomCode,
      room_name: roomName,
      capacity: capacity,
      description: description,
      facilities: parsedFacilities,
      image_url: imageUrl
    })

    if (result.affectedRows > 0) {
      return res.status(201).json({
        status: "success",
        message: 'Room created successfully',
        data: {
          id: result.insertId,
          roomName,
          capacity,
          description,
          parsedFacilities,
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
    const [result] = await orm.delete(rooms).where(eq(rooms.id, id));
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

    const [oldRoomResult] =  await orm.select().from(rooms).where(eq(rooms.id, id));
    if (!oldRoomResult) {
      return res.status(404).json({
        status: "error",
        message: "Room not found",
        errorCode: 'ERR_ROOM_NOT_FOUND',
        data: null
      });
    }

    const oldImageUrl = oldRoomResult.image_url;
    let finalImageUrl = oldImageUrl;

    if (req.file) {

      const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      finalImageUrl = cloudinaryResult.secure_url;

      // Lang
      if (oldImageUrl) {
        await deleteImageByUrl(oldImageUrl);
      }
    }

      const [result] = await orm.update(rooms).set({
                room_name: roomName,
                capacity: capacity,
                description: description,
                facilities: parsedFacilities
            }).where(eq(rooms.id, id));

    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: "success",
        message: "Room updated successfully",
        data: {
          id,
          roomName,
          capacity,
          description,
          parsedFacilities,
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
