import { Toaster } from "react-hot-toast";

type Props = {
    children: React.ReactNode
}

export default function ToastProvider({children}: Props) {
    return (
        <>
            <Toaster toastOptions={{
                duration: 3000,
                style: {
                    marginTop: '4rem', 
                    border: '2px solid', 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
                }
            }}/>
            {children}
        </>
    );
}