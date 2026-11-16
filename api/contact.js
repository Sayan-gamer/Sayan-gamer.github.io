import { put } from '@vercel/blob';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { purpose, service, name, company, email, phone, message } = req.body;
            
            console.log("Processing submission for:", name);

            // 1. Format the data you want to save
            const submissionData = {
                timestamp: new Date().toISOString(),
                purpose,
                service,
                name,
                company,
                email,
                phone,
                message
            };

            // 2. Create a unique filename using the current time
            // Example: submissions/contact-1731789452000.json
            const filename = `submissions/contact-${Date.now()}.json`;

            // 3. Convert the data to a formatted JSON string
            const fileContent = JSON.stringify(submissionData, null, 2);

            // 4. Upload to Vercel Blob
            const blob = await put(filename, fileContent, {
                access: 'public', // Makes the file accessible via a URL
                addRandomSuffix: true // Adds extra random characters so filenames never clash
            });

            console.log("Successfully saved to Blob:", blob.url);
            
            // 5. Send success back to HTML
            return res.status(200).json({ success: true, url: blob.url });

        } catch (error) {
            console.error("Blob upload error:", error);
            return res.status(500).json({ success: false, error: "Server error" });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
