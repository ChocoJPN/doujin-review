import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content');

export type Post = {
    slug: string;
    title: string;
    date: string;
    rating: number; // 5段階評価
    thumbnail: string; // 画像パス
    excerpt: string; // 抜粋
    content: string; // 本文
};

// 全記事を取得（日付降順）
export function getAllPosts(): Post[] {
    // ディレクトリがなければ作成する（初回実行時などの保険）
    if (!fs.existsSync(postsDirectory)) {
        try {
            fs.mkdirSync(postsDirectory, { recursive: true });
        } catch {
            return [];
        }
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
        .filter((fileName) => fileName.endsWith('.mdx'))
        .map((fileName) => {
            const slug = fileName.replace(/\.mdx$/, '');
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                slug,
                content,
                title: data.title ?? 'No Title',
                date: data.date ?? new Date().toISOString(),
                rating: data.rating ?? 0,
                thumbnail: data.thumbnail ?? '',
                excerpt: data.excerpt ?? '',
            };
        });

    // 日付でソート
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

// スラッグから記事を取得
export function getPostBySlug(slug: string): Post | null {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.mdx`);
        if (!fs.existsSync(fullPath)) {
            return null;
        }
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        return {
            slug,
            content,
            title: data.title ?? 'No Title',
            date: data.date ?? new Date().toISOString(),
            rating: data.rating ?? 0,
            thumbnail: data.thumbnail ?? '',
            excerpt: data.excerpt ?? '',
        };
    } catch (error) {
        return null;
    }
}
