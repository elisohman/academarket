const DefaultProfilePic: React.FC = () => {

    return (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_65_52" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40">
                <rect width="40" height="40" rx="20" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_65_52)">
                <path d="M4 40C4 33.6275 9.16594 28.4615 15.5385 28.4615H23.4615C29.8341 28.4615 35 33.6275 35 40V40H4V40Z" fill="#2D3232"/>
                <ellipse cx="19.5" cy="18.4615" rx="8.525" ry="8.46154" fill="#2D3232"/>
            </g>
        </svg>
    );
};

export default DefaultProfilePic;