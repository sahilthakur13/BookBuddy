export const formatEventDate = (dateString) => {
  const date = new Date(dateString);

  const formatted = date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const time = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return { formatted, time };
};


export const formatDuration = (duration)=>{
  let hour = Math.floor(duration / 60)
  let mints = duration % 60 
   return {hour , mints}
}