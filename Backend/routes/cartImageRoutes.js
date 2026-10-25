
const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, callback) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return callback(
                new Error("Please upload a JPG, PNG, or WebP image.")
            );
        }

        callback(null, true);
    }
});

router.post("/", (req, res, next) => {
    upload.single("image")(req, res, async (error) => {
        if (error) {
            return res.status(400).json({
                message: error.message || "Image upload failed."
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Please select an image."
            });
        }

        try {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "urbanethos/cart-customizations",
                        resource_type: "image"
                    },
                    (uploadError, uploadedImage) => {
                        if (uploadError) {
                            return reject(uploadError);
                        }

                        resolve(uploadedImage);
                    }
                );

                stream.end(req.file.buffer);
            });

            return res.status(201).json({
                message: "Your picture was uploaded successfully.",
                imageUrl: result.secure_url,
                publicId: result.public_id
            });
        } catch (uploadError) {
            console.error(
                "Cart image upload failed:",
                uploadError.message
            );

            return res.status(500).json({
                message: "Unable to upload your picture. Please try again."
            });
        }
    });
});

module.exports = router;
