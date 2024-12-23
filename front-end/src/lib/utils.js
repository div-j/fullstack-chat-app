export function formatMessageTime(data) {
    return new Date(data).toLocaleTimeString("en-Us",{
        hour:"2-digit",
        minute:"2-digit",
        // second:"2-digit",
        hour12:false
    })
    
}