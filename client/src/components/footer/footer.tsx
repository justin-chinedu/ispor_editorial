import Favorite from "@mui/icons-material/Favorite";
export const Footer = () => {
    return (
        <footer className="bg-gray-800 h-64 justify-end items-center">
            <div className=" h-full flex flex-col items-center justify-end gap-y-1 py-6 opacity-70">
                <p className="text-white text-sm font-medium">Made With <span className="text-white"><Favorite/></span> by <a href="mailto:chinedujustin491@gmail.com" className="underline select-none">Justin Chinedu</a></p>
                <a href="mailto:isporunneditorial@gmail.com" className=" text-sm text-primary-color hover:underline select-none">Contact the Editorial</a>
                <p className="text-primary-color text-sm">ISPOR UNN</p>
                <p className="text-primary-color text-sm">©{new Date().getFullYear()}</p>
            </div>
        </footer>
    )
}