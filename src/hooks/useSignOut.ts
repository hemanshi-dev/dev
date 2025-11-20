export const useSignOut = () => {


    return () => {
        localStorage.clear()
    };
};