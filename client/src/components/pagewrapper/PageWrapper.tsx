import TopBar from '../topbar/TopBar';

interface PageWrapperProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const PageWrapper: React.FC<PageWrapperProps> = ({children, className}) => {
    return (
        <div className={'h-screen flex flex-col ' + (className)}>
            <TopBar />
            <div className='grow px-8 pb-8'>{children}</div>
        </div>
    );
}

export default PageWrapper;
