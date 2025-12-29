import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    const memoriesDir = path.join(process.cwd(), 'public', 'memories');

    try {
        if (!fs.existsSync(memoriesDir)) {
            return NextResponse.json({ files: [] });
        }

        const files = fs.readdirSync(memoriesDir)
            .filter(file => !file.startsWith('.') && file !== '.gitkeep')
            .map(file => ({
                url: `/memories/${file}`,
                type: file.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image'
            }));

        return NextResponse.json({ files });
    } catch (err) {
        return NextResponse.json({ files: [] });
    }
}
