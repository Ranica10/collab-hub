"use client";

import { useEffect, useState } from "react";

const useMounted = () => {
    // State to track if the component is mounted (to avoid hydration issues)
    const [mounted, setMounted] = useState(false);

    // If on the client, set mounted to true
    useEffect(() => {
        setMounted(true);
    }, []);

    return mounted;
}

export default useMounted