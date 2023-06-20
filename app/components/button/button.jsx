export const Button = ({children, handleClick}) => {
    return (
        <button className="text-green-400 p-1 border-solid border-2  bg-white/30 rounded-md backdrop-blur-md" onClick={handleClick}>{children}</button>
    )
}