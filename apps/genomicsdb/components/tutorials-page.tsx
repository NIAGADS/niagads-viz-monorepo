"use client";

import "./tutorials-page.css";
import { PlayCircle } from "lucide-react";
import type { FC } from "react";

interface Tutorial {
    id: string;
    title: string;
}

const tutorials: Tutorial[] = [
    { id: "vfs11w4-u_Q", title: "Introduction and Navigation Features" },
    { id: "y_wemO6kHoU", title: "Navigating the Gene Report Page" },
    { id: "h6ImfJwByyU", title: "Navigating the NIAGADS Genome Browser" },
    { id: "13SI-AaTOyo", title: "Navigating the Variant Report Page" },
    { id: "Hk0xPDb-4Xs", title: "Navigating the Dataset Report Page" },
];

export const TutorialsPage: FC = () => {
    return (
        <div className="tutorials-container">
            <header className="tutorials-header">
                <h1 className="tutorials-title">Video Tutorials</h1>
                <p className="tutorials-subtitle">
                    Learn how to use the NIAGADS Alzheimer's Genomics Database with our short, helpful video guides.
                </p>
            </header>

            <div className="tutorials-grid">
                {tutorials.map((tutorial) => (
                    <div key={tutorial.id} className="tutorial-card">
                        <iframe
                            className="tutorial-video"
                            src={`https://www.youtube.com/embed/${tutorial.id}`}
                            title={tutorial.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                        <h2 className="tutorial-video-title">{tutorial.title}</h2>
                    </div>
                ))}
            </div>

            <div className="playlist-section">
                <a
                    href="https://www.youtube.com/playlist?list=PLkQb0-TdWhp-TQzZmwAuFyXYpDumwYGsFD"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="playlist-link"
                >
                    <PlayCircle size={20} />
                    View Full Playlist on YouTube
                </a>
            </div>
        </div>
    );
};
