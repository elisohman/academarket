import TopBar from '../topbar/TopBar';

interface PageWrapperProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const PageWrapper: React.FC<PageWrapperProps> = ({children, className}) => {
    return (
        <div className={'page-container ' + (className)}>
            <TopBar />
            <div className='content-container'>{children}</div>
        </div>
    );
}

export default PageWrapper;
