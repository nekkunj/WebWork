export function DateComponent(mongoDbDate:string){
    // Assuming createdAt is a Date object fetched from MongoDB
    const createdAt: Date = new Date(mongoDbDate);

    // Get the local time zone offset in minutes
    const timeZoneOffset: number = new Date().getTimezoneOffset();

    // Apply the offset to get the local time
    const localTime: Date = new Date(createdAt.getTime() - timeZoneOffset * 60000);

    // Convert the local time to a string representation
    //toLocaleString for date and time
    //toLocaleDateString for just date
    const formattedTimestamp = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric', 
        hour12: true,
      }).format(localTime);
    // const localDateTimeString: string = localTime.toLocaleDateString();

return formattedTimestamp
}