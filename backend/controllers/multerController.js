const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

exports.detectObjects = (req, res) => {
    let imagePath;

    if (req.file) {
        imagePath = path.join(__dirname, '..', req.file.path);
    } else if (req.body.image) {
        const base64Data = req.body.image.replace(/^data:image\/jpeg;base64,/, "");
        imagePath = path.join(__dirname, '..', 'uploads', `image_${Date.now()}.jpeg`);

        fs.writeFileSync(imagePath, base64Data, 'base64');
    } else {
        return res.status(400).json({
            status: 'fail',
            message: 'No image provided'
        });
    }

    const command = `python3 controllers/python/script.py --image ${imagePath}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({
                status: 'fail',
                message: 'Object detection failed'
            });
        }

        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).json({
                status: 'fail',
                message: 'Object detection failed'
            });
        }

        try {
            const outputLines = stdout.split('\n').slice(3).join('\n');
            const detectedObjects = JSON.parse(outputLines);

            return res.status(200).json({
                status: 'success',
                detected_objects: detectedObjects
            });
        } catch (parseError) {
            console.error(`Parse Error: ${parseError.message}`);
            return res.status(500).json({
                status: 'fail',
                message: 'Error parsing detected objects'
            });
        }
    });
};
