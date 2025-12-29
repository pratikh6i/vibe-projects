'use client';

export default function Landscape() {
    return (
        <div className="landscape-container">
            <div className="hills">
                <div className="hill hill-1"></div>
                <div className="hill hill-2"></div>
                <div className="hill hill-3"></div>
            </div>
            <div className="houses">
                {/* Simple SVG/CSS shapes to represent a village */}
                <div className="house house-1">
                    <div className="roof"></div>
                    <div className="window glowing"></div>
                </div>
                <div className="house house-2">
                    <div className="roof"></div>
                    <div className="window glowing"></div>
                </div>
            </div>
        </div>
    );
}
