export const divideArrayIntoChunks = (formData, chunkSize) => {
  const chunkedArray = chunkArray(formData?.items, chunkSize);

  // Create new array of objects with chunks and random IDs
  return chunkedArray.map((chunk) => ({
    items: chunk,
    id: generateRandomId(),
  }));
};

function chunkArray(arr, size) {
  const chunkedArr = [];
  for (let i = 0; i < arr.length; i += size) {
    chunkedArr.push(arr.slice(i, i + size));
  }
  return chunkedArr;
}

export function generateRandomId() {
  return Math.random().toString(36).substr(2, 9); // Generates a random string
}
