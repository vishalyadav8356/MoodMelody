const ImageKit = require('@imagekit/nodejs');
const { toFile } = ImageKit;

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile({buffer, filename, folder = ""}) {
    const file = await client.files.upload({
        file: await toFile(buffer, filename),
        fileName: filename,
        folder
    });

    return file
}

module.exports = {
    uploadFile
}