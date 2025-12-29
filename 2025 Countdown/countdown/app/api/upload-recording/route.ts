import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from 'octokit';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as Blob;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const content = Buffer.from(buffer).toString('base64');

        const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN,
        });

        const owner = process.env.GITHUB_OWNER || 'pratikh6i';
        const repo = process.env.GITHUB_REPO || 'vibe-projects';
        const path = `recordings/celebration-${Date.now()}.webm`;

        await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path,
            message: 'Add New Year celebration recording',
            content,
        });

        return NextResponse.json({ success: true, path });
    } catch (err: any) {
        console.error('GitHub Upload Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
