'use client';

import { useState } from 'react';
import ViewCounter from './ViewCounter';

type ViewCountDisplayProps = {
    slug: string;
    initialViews: number;
};

export default function ViewCountDisplay({ slug, initialViews }: ViewCountDisplayProps) {
    const [views, setViews] = useState(initialViews);

    return (
        <>
            <ViewCounter slug={slug} onViewCountUpdate={setViews} />
            <span className="views">👁 {views} views</span>
        </>
    );
}
