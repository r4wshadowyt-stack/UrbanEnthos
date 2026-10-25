
const express = require("express");
const multer = require("multer");
const pool = require("../config/db");
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

function uploadToCloudinary(buffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "urbanethos/custom-requests",
                resource_type: "image"
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        stream.end(buffer);
    });
}

router.post("/", (req, res, next) => {
    upload.single("referenceImage")(req, res, async (uploadError) => {
        if (uploadError) {
            const message =
                uploadError.code === "LIMIT_FILE_SIZE"
                    ? "The image must be 5 MB or smaller."
                    : uploadError.message;

            return res.status(400).json({ message });
        }

        let uploadedImage = null;

        try {
            const customerName = String(
                req.body.customerName || ""
            ).trim();

            const phone = String(
                req.body.phone || ""
            ).trim();

            const email = String(
                req.body.email || ""
            ).trim();

            const productRequired = String(
                req.body.productRequired || ""
            ).trim();

            const description = String(
                req.body.description || ""
            ).trim();

            if (
                !customerName ||
                !phone ||
                !productRequired ||
                !description
            ) {
                return res.status(400).json({
                    message: "Please complete all required fields."
                });
            }

            if (
                customerName.length > 150 ||
                phone.length > 30 ||
                email.length > 255 ||
                productRequired.length > 200 ||
                description.length > 10000
            ) {
                return res.status(400).json({
                    message: "One or more fields exceed the allowed length."
                });
            }

            if (
                email &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            ) {
                return res.status(400).json({
                    message: "Please enter a valid email address."
                });
            }

            if (req.file) {
                uploadedImage = await uploadToCloudinary(
                    req.file.buffer
                );
            }

            const result = await pool.query(
                `INSERT INTO custom_design_requests
                    (
                        customer_name,
                        phone,
                        email,
                        product_required,
                        description,
                        image_url,
                        image_public_id
                    )
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING id, status, created_at`,
                [
                    customerName,
                    phone,
                    email || null,
                    productRequired,
                    description,
                    uploadedImage ? uploadedImage.secure_url : null,
                    uploadedImage ? uploadedImage.public_id : null
                ]
            );

            return res.status(201).json({
                message: "Your custom design request was submitted successfully!",
                request: result.rows[0]
            });
        } catch (error) {
            if (uploadedImage && uploadedImage.public_id) {
                try {
                    await cloudinary.uploader.destroy(
                        uploadedImage.public_id
                    );
                } catch (cleanupError) {
                    console.error(
                        "Uploaded image cleanup failed."
                    );
                }
            }

            console.error(
                "Custom design request submission failed:",
                error.message
            );

            return res.status(500).json({
                message: "We couldn't submit your request. Please try again."
            });
        }
    });
});

module.exports = router;
