import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'stats.json');

export type PostStats = {
    views: number;
    likes: number;
};

export type Database = Record<string, PostStats>;

// データの読み込み
export function getStats(): Database {
    if (!fs.existsSync(DB_PATH)) {
        return {};
    }
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch {
        return {};
    }
}

// データの保存
function saveStats(data: Database) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// 閲覧数の加算
export function incrementView(slug: string): number {
    const db = getStats();
    if (!db[slug]) {
        db[slug] = { views: 0, likes: 0 };
    }
    db[slug].views++;
    saveStats(db);
    return db[slug].views;
}

// いいねの加算
export function incrementLike(slug: string): number {
    const db = getStats();
    if (!db[slug]) {
        db[slug] = { views: 0, likes: 0 };
    }
    db[slug].likes++;
    saveStats(db);
    return db[slug].likes;
}

// いいねの減算
export function decrementLike(slug: string): number {
    const db = getStats();
    if (!db[slug]) {
        db[slug] = { views: 0, likes: 0 };
    }
    db[slug].likes = Math.max(0, db[slug].likes - 1);
    saveStats(db);
    return db[slug].likes;
}

// 特定記事のスタッツ取得
export function getPostStats(slug: string): PostStats {
    const db = getStats();
    return db[slug] || { views: 0, likes: 0 };
}
